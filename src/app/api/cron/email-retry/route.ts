import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { emailQueueRepository } from "@/lib/repositories/email-queue";
import { getProvider } from "@/lib/email/providers";
import { getEmailMode } from "@/lib/email/config";
import { logger } from "@/lib/observability/logger";
import { captureError } from "@/lib/observability/capture";

export const runtime = "nodejs";

/**
 * Email retry worker. Re-attempts `queued` and retryable `failed` rows from
 * `email_queue`. Intended to be hit by a scheduler (Vercel Cron, cPanel cron,
 * GitHub Action) with `Authorization: Bearer $CRON_SECRET`.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Database not connected." }, { status: 503 });
  }
  if (getEmailMode() !== "production") {
    return NextResponse.json({ processed: 0, note: "Email mode is log-only; nothing to retry." });
  }

  const rows = await emailQueueRepository.findRetryable();
  const provider = getProvider();
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      await emailQueueRepository.markSending(row.id);
      await provider.send({
        to: row.to,
        from: row.from,
        subject: row.subject,
        html: row.htmlBody ?? "",
        text: row.textBody ?? "",
        metadata: row.metadata ?? undefined,
      });
      await emailQueueRepository.markSent(row.id);
      sent++;
    } catch (err) {
      const safe = (err instanceof Error ? err.message : String(err))
        .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer ***")
        .slice(0, 300);
      await captureError(err, { scope: "email-retry-cron", extra: { queueId: row.id } });
      await emailQueueRepository.markFailed(row.id, safe).catch(() => {});
      failed++;
    }
  }

  logger.info("cron.email_retry.completed", { processed: rows.length, sent, failed });
  return NextResponse.json({ processed: rows.length, sent, failed });
}

/** GET variant for schedulers that cannot POST. */
export const GET = POST;
