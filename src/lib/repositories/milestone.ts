import { eq, asc, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { milestones } from "@/db/schema";

type MilestoneRow = typeof milestones.$inferSelect;
type MilestoneStatus = MilestoneRow["status"];

export class MilestoneRepository extends BaseRepository {
  async findByProjectId(projectId: string): Promise<MilestoneRow[]> {
    return this.db
      .select()
      .from(milestones)
      .where(eq(milestones.projectId, projectId))
      .orderBy(asc(milestones.sortOrder), asc(milestones.createdAt));
  }

  async findById(id: string): Promise<MilestoneRow | undefined> {
    const [row] = await this.db
      .select()
      .from(milestones)
      .where(eq(milestones.id, id))
      .limit(1);
    return row;
  }

  async create(data: {
    projectId: string;
    title: string;
    description?: string | null;
    status?: MilestoneStatus;
    sortOrder?: number;
    dueDate?: Date | null;
  }): Promise<MilestoneRow> {
    const status = data.status ?? "upcoming";
    const result = await this.db
      .insert(milestones)
      .values({
        projectId: data.projectId,
        title: data.title,
        description: data.description ?? null,
        status,
        sortOrder: data.sortOrder ?? 0,
        dueDate: data.dueDate ?? null,
        completedDate: status === "completed" ? new Date() : null,
      })
      .returning();
    return result[0]!;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string | null;
      status: MilestoneStatus;
      sortOrder: number;
      dueDate: Date | null;
    }>,
  ): Promise<MilestoneRow | undefined> {
    const payload: Record<string, unknown> = { ...data, updatedAt: new Date() };

    if (data.status !== undefined) {
      if (data.status === "completed") {
        const existing = await this.db
          .select({ completedDate: milestones.completedDate })
          .from(milestones)
          .where(eq(milestones.id, id))
          .limit(1);
        if (existing[0] && !existing[0].completedDate) {
          payload.completedDate = new Date();
        }
      } else {
        payload.completedDate = null;
      }
    }

    const [row] = await this.db
      .update(milestones)
      .set(payload)
      .where(eq(milestones.id, id))
      .returning();
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(milestones)
      .where(eq(milestones.id, id))
      .returning({ id: milestones.id });
    return result.length > 0;
  }

  async countByProjectId(projectId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(milestones)
      .where(eq(milestones.projectId, projectId));
    return result?.count ?? 0;
  }
}

export const milestoneRepository = new MilestoneRepository();
