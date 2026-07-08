import { desc, eq } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { auditLog, users } from "@/db/schema";
import { hasDatabase } from "@/db";

type AuditLogRow = typeof auditLog.$inferSelect;

export type AuditEntry = {
  /** The actor; null for unauthenticated/system events. */
  userId: string | null;
  /** Verb in past tense, e.g. "project.status_changed", "team.promoted". */
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export type AuditLogWithActor = AuditLogRow & { actorName: string | null };

export class AuditLogRepository extends BaseRepository {
  /**
   * Best-effort audit write: never throws and never blocks the calling
   * action — a failed audit insert must not fail the mutation it records.
   */
  async record(entry: AuditEntry): Promise<void> {
    if (!hasDatabase()) return;
    try {
      await this.db.insert(auditLog).values({
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadata: entry.metadata ?? null,
      });
    } catch (err) {
      console.error("Failed to record audit entry:", err);
    }
  }

  async findRecent(limit = 50): Promise<AuditLogWithActor[]> {
    return this.db
      .select({
        id: auditLog.id,
        userId: auditLog.userId,
        action: auditLog.action,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        metadata: auditLog.metadata,
        ipAddress: auditLog.ipAddress,
        createdAt: auditLog.createdAt,
        actorName: users.name,
      })
      .from(auditLog)
      .leftJoin(users, eq(auditLog.userId, users.id))
      .orderBy(desc(auditLog.createdAt))
      .limit(limit);
  }
}

export const auditLogRepository = new AuditLogRepository();
