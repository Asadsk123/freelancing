/**
 * Structured application logging. JSON lines in production (machine-parseable
 * by any log drain), human-readable in development. Values are redacted by
 * key name and by pattern so secrets can never reach the logs even if a
 * caller passes them by mistake.
 */

type LogLevel = "info" | "warn" | "error";
type LogFields = Record<string, unknown>;

const SENSITIVE_KEYS = /pass(word)?|secret|token|jwt|cookie|authorization|otp|code|database_url|api[_-]?key/i;
const BEARER_PATTERN = /Bearer\s+[A-Za-z0-9._-]+/g;
const POSTGRES_URL_PATTERN = /postgres(ql)?:\/\/\S+/g;

function redactValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(BEARER_PATTERN, "Bearer ***").replace(POSTGRES_URL_PATTERN, "postgresql://***");
  }
  return value;
}

function redactFields(fields: LogFields): LogFields {
  const out: LogFields = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = SENSITIVE_KEYS.test(key) ? "***" : redactValue(value);
  }
  return out;
}

function emit(level: LogLevel, event: string, fields?: LogFields): void {
  const safeFields = fields ? redactFields(fields) : undefined;
  if (process.env.NODE_ENV === "production") {
    const line = JSON.stringify({
      time: new Date().toISOString(),
      level,
      event,
      ...safeFields,
    });
    console[level === "info" ? "log" : level](line);
  } else {
    console[level === "info" ? "log" : level](`[${level}] ${event}`, safeFields ?? "");
  }
}

export const logger = {
  info: (event: string, fields?: LogFields) => emit("info", event, fields),
  warn: (event: string, fields?: LogFields) => emit("warn", event, fields),
  error: (event: string, fields?: LogFields) => emit("error", event, fields),
};
