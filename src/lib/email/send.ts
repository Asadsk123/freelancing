import { hasDatabase } from "@/db";
import { emailQueueRepository } from "@/lib/repositories/email-queue";
import { captureError } from "@/lib/observability/capture";
import type { EmailMessage, RenderedEmail, SendOutcome } from "./types";
import { getFromAddress } from "./config";
import { getProvider } from "./providers";

/** Removes anything that could leak secrets from an error before logging. */
function sanitizeError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  return raw.replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer ***").slice(0, 300);
}

/**
 * Delivers an email. This function NEVER throws — email is always best-effort
 * so the caller's main action can complete regardless. It records the message
 * to `email_queue` (when a DB is available) and updates its status, so a future
 * background worker can retry failures.
 */
export async function deliverEmail(message: EmailMessage): Promise<SendOutcome> {
  let queueId: string | undefined;

  if (hasDatabase()) {
    try {
      const row = await emailQueueRepository.enqueue({
        to: message.to,
        from: message.from,
        subject: message.subject,
        htmlBody: message.html,
        textBody: message.text,
        metadata: message.metadata,
      });
      queueId = row.id;
    } catch (err) {
      // Persisting the queue row should not block delivery.
      console.error("[email] failed to enqueue:", sanitizeError(err));
    }
  }

  try {
    if (queueId) await emailQueueRepository.markSending(queueId).catch(() => {});
    const provider = getProvider();
    const { id } = await provider.send(message);
    if (queueId) await emailQueueRepository.markSent(queueId).catch(() => {});
    return { delivered: true, providerId: id };
  } catch (err) {
    const safe = sanitizeError(err);
    await captureError(err, {
      scope: "email-delivery",
      extra: { subject: message.subject.slice(0, 100), queued: Boolean(queueId) },
    });
    if (queueId) await emailQueueRepository.markFailed(queueId, safe).catch(() => {});
    return { delivered: false, error: safe };
  }
}

/** Convenience: build a message from a rendered template + recipient and deliver. */
export function sendRendered(
  to: string,
  rendered: RenderedEmail,
  options?: { from?: "default" | "support"; metadata?: Record<string, string> },
): Promise<SendOutcome> {
  return deliverEmail({
    to,
    from: getFromAddress(options?.from ?? "default"),
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    metadata: options?.metadata,
  });
}
