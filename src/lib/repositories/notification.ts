import { eq, desc, and, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { notifications } from "@/db/schema";

type NotificationRow = typeof notifications.$inferSelect;

export class NotificationRepository extends BaseRepository {
  async findByUserId(userId: string): Promise<NotificationRow[]> {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async countUnread(userId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
        ),
      );
    return result?.count ?? 0;
  }

  async markAsRead(id: string, userId: string): Promise<NotificationRow | undefined> {
    const [row] = await this.db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, userId),
        ),
      )
      .returning();
    return row;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
        ),
      )
      .returning({ id: notifications.id });
    return result.length;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.db
      .delete(notifications)
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, userId),
        ),
      )
      .returning({ id: notifications.id });
    return result.length > 0;
  }
}

export const notificationRepository = new NotificationRepository();
