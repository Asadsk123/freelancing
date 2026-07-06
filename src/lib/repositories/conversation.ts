import { eq, asc } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { projectConversations, conversationMessages, users } from "@/db/schema";

type ConversationRow = typeof projectConversations.$inferSelect;
type MessageRow = typeof conversationMessages.$inferSelect;

export type MessageWithSender = MessageRow & {
  senderName: string;
  senderRole: "admin" | "client";
};

export class ConversationRepository extends BaseRepository {
  async findMessagesByProjectId(projectId: string): Promise<MessageWithSender[]> {
    return this.db
      .select({
        id: conversationMessages.id,
        conversationId: conversationMessages.conversationId,
        senderId: conversationMessages.senderId,
        content: conversationMessages.content,
        createdAt: conversationMessages.createdAt,
        senderName: users.name,
        senderRole: users.role,
      })
      .from(conversationMessages)
      .innerJoin(
        projectConversations,
        eq(conversationMessages.conversationId, projectConversations.id),
      )
      .innerJoin(users, eq(conversationMessages.senderId, users.id))
      .where(eq(projectConversations.projectId, projectId))
      .orderBy(asc(conversationMessages.createdAt));
  }

  async getOrCreateByProjectId(projectId: string): Promise<ConversationRow> {
    const [existing] = await this.db
      .select()
      .from(projectConversations)
      .where(eq(projectConversations.projectId, projectId))
      .limit(1);
    if (existing) return existing;

    const inserted = await this.db
      .insert(projectConversations)
      .values({ projectId })
      .onConflictDoNothing()
      .returning();
    if (inserted[0]) return inserted[0];

    // Conflict path: another request created it concurrently — fetch it.
    const [row] = await this.db
      .select()
      .from(projectConversations)
      .where(eq(projectConversations.projectId, projectId))
      .limit(1);
    if (!row) throw new Error("Failed to get or create conversation");
    return row;
  }

  async addMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
  }): Promise<MessageRow> {
    const result = await this.db
      .insert(conversationMessages)
      .values(data)
      .returning();
    return result[0]!;
  }
}

export const conversationRepository = new ConversationRepository();
