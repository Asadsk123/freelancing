import { eq, desc, sql, and } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { projects, milestones, users } from "@/db/schema";

type ProjectRow = typeof projects.$inferSelect;
type MilestoneRow = typeof milestones.$inferSelect;

export type ProjectWithClient = ProjectRow & {
  clientName: string;
  clientEmail: string;
};

export type ProjectWithDetails = ProjectRow & {
  clientName: string;
  clientEmail: string;
  milestones: MilestoneRow[];
};

export class ProjectRepository extends BaseRepository {
  async create(data: {
    trackingId: string;
    clientId: string;
    title: string;
    serviceId?: string | null;
    description?: string | null;
    startDate?: Date | null;
    targetDate?: Date | null;
  }): Promise<ProjectRow> {
    const [row] = await this.db
      .insert(projects)
      .values({
        trackingId: data.trackingId,
        clientId: data.clientId,
        title: data.title,
        serviceId: data.serviceId || null,
        description: data.description || null,
        startDate: data.startDate,
        targetDate: data.targetDate,
      })
      .returning();
    if (!row) throw new Error("Failed to create project");
    return row;
  }

  async findAll(): Promise<ProjectWithClient[]> {
    const rows = await this.db
      .select({
        id: projects.id,
        trackingId: projects.trackingId,
        clientId: projects.clientId,
        serviceId: projects.serviceId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        targetDate: projects.targetDate,
        completedDate: projects.completedDate,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        clientName: users.name,
        clientEmail: users.email,
      })
      .from(projects)
      .innerJoin(users, eq(projects.clientId, users.id))
      .orderBy(desc(projects.createdAt));
    return rows;
  }

  async findByClientId(clientId: string): Promise<ProjectRow[]> {
    return this.db
      .select()
      .from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt));
  }

  async findByIdWithDetails(id: string): Promise<ProjectWithDetails | undefined> {
    const [projectRow] = await this.db
      .select({
        id: projects.id,
        trackingId: projects.trackingId,
        clientId: projects.clientId,
        serviceId: projects.serviceId,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        startDate: projects.startDate,
        targetDate: projects.targetDate,
        completedDate: projects.completedDate,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        clientName: users.name,
        clientEmail: users.email,
      })
      .from(projects)
      .innerJoin(users, eq(projects.clientId, users.id))
      .where(eq(projects.id, id))
      .limit(1);

    if (!projectRow) return undefined;

    const projectMilestones = await this.db
      .select()
      .from(milestones)
      .where(eq(milestones.projectId, id))
      .orderBy(milestones.sortOrder);

    return { ...projectRow, milestones: projectMilestones };
  }

  async updateStatus(
    id: string,
    status: ProjectRow["status"],
  ): Promise<ProjectRow | undefined> {
    const now = new Date();
    const [row] = await this.db
      .update(projects)
      .set({
        status,
        updatedAt: now,
        completedDate: status === "completed" ? now : null,
      })
      .where(eq(projects.id, id))
      .returning();
    return row;
  }

  async countByStatus(status: ProjectRow["status"]): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(eq(projects.status, status));
    return result?.count ?? 0;
  }

  async countActiveByClientId(clientId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(
        and(
          eq(projects.clientId, clientId),
          sql`${projects.status} IN ('pending', 'in_progress', 'on_hold')`,
        ),
      );
    return result?.count ?? 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });
    return result.length > 0;
  }
}

export const projectRepository = new ProjectRepository();
