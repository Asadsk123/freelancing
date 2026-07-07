import { eq, or, and, lt, sql, desc } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { emailQueue } from "@/db/schema";

type EmailRow = typeof emailQueue.$inferSelect;

const MAX_ATTEMPTS = 5;

export class EmailQueueRepository extends BaseRepository {
  /** Records a message as `queued`. This row is the source of truth for retries. */
  async enqueue(data: {
    to: string;
    from: string;
    subject: string;
    htmlBody: string;
    textBody: string;
    metadata?: Record<string, string>;
  }): Promise<EmailRow> {
    const result = await this.db
      .insert(emailQueue)
      .values({
        to: data.to,
        from: data.from,
        subject: data.subject,
        htmlBody: data.htmlBody,
        textBody: data.textBody,
        metadata: data.metadata ?? null,
        status: "queued",
      })
      .returning();
    return result[0]!;
  }

  async markSending(id: string): Promise<void> {
    await this.db
      .update(emailQueue)
      .set({ status: "sending", attempts: sql`${emailQueue.attempts} + 1` })
      .where(eq(emailQueue.id, id));
  }

  async markSent(id: string): Promise<void> {
    await this.db
      .update(emailQueue)
      .set({ status: "sent", sentAt: new Date(), lastError: null })
      .where(eq(emailQueue.id, id));
  }

  async markFailed(id: string, error: string): Promise<void> {
    await this.db
      .update(emailQueue)
      .set({ status: "failed", lastError: error.slice(0, 500) })
      .where(eq(emailQueue.id, id));
  }

  /**
   * Rows a future background worker should retry: still `queued`, or `failed`
   * but under the attempt cap. Ordered oldest-first.
   */
  async findRetryable(limit = 25): Promise<EmailRow[]> {
    return this.db
      .select()
      .from(emailQueue)
      .where(
        or(
          eq(emailQueue.status, "queued"),
          and(eq(emailQueue.status, "failed"), lt(emailQueue.attempts, MAX_ATTEMPTS)),
        ),
      )
      .orderBy(desc(emailQueue.createdAt))
      .limit(limit);
  }
}

export const emailQueueRepository = new EmailQueueRepository();
