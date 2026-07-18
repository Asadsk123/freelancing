import { logger } from "./logger";

/**
 * Error monitoring with a provider abstraction (mirrors the email/storage
 * pattern): when SENTRY_DSN is set, events are delivered to Sentry via its
 * envelope HTTP API using fetch — no SDK dependency. Without a DSN, errors go
 * to the structured logger so nothing is silently swallowed.
 *
 * `captureError` is best-effort and never throws: monitoring must never take
 * down the action it observes.
 */

type CaptureContext = {
  /** Where the error happened, e.g. "upload-route", "email-retry-cron". */
  scope: string;
  /** Small, non-sensitive tags (ids, statuses). Redacted by the logger path. */
  extra?: Record<string, string | number | boolean>;
};

type ParsedDsn = { endpoint: string; publicKey: string };

function parseDsn(dsn: string): ParsedDsn | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\//, "");
    if (!url.username || !projectId) return null;
    return {
      endpoint: `${url.protocol}//${url.host}/api/${projectId}/envelope/`,
      publicKey: url.username,
    };
  } catch {
    return null;
  }
}

function toEvent(error: unknown, context: CaptureContext) {
  const err = error instanceof Error ? error : new Error(String(error));
  return {
    event_id: crypto.randomUUID().replace(/-/g, ""),
    timestamp: new Date().toISOString(),
    platform: "javascript",
    level: "error",
    environment: process.env.NODE_ENV ?? "development",
    tags: { scope: context.scope },
    extra: context.extra ?? {},
    exception: {
      values: [
        {
          type: err.name,
          value: err.message.slice(0, 500),
          stacktrace: err.stack
            ? { frames: [{ filename: "server", function: err.stack.split("\n")[1]?.trim().slice(0, 200) ?? "unknown" }] }
            : undefined,
        },
      ],
    },
  };
}

export async function captureError(error: unknown, context: CaptureContext): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`error.${context.scope}`, { message: message.slice(0, 300), ...context.extra });

  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  const parsed = parseDsn(dsn);
  if (!parsed) {
    logger.warn("observability.invalid_dsn");
    return;
  }

  try {
    const event = toEvent(error, context);
    const envelope =
      JSON.stringify({ event_id: event.event_id, sent_at: event.timestamp }) +
      "\n" +
      JSON.stringify({ type: "event" }) +
      "\n" +
      JSON.stringify(event);

    await fetch(parsed.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_client=royal-asad/1.0, sentry_key=${parsed.publicKey}`,
      },
      body: envelope,
    });
  } catch {
    // Never let monitoring failures cascade; the structured log above stands.
  }
}
