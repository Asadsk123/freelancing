import { eq } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { sessions } from "@/db/schema";

type SessionRow = typeof sessions.$inferSelect;

export class SessionRepository extends BaseRepository {
  async create(userId: string, expiresAt: Date): Promise<SessionRow> {
    const [row] = await this.db
      .insert(sessions)
      .values({ userId, expiresAt })
      .returning();
    if (!row) throw new Error("Failed to create session");
    return row;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.db.delete(sessions).where(eq(sessions.userId, userId));
  }
}

export const sessionRepository = new SessionRepository();
