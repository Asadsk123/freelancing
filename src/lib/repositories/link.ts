import { eq, desc } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { projectLinks, users } from "@/db/schema";

type LinkRow = typeof projectLinks.$inferSelect;

export type LinkWithSubmitter = LinkRow & {
  submitterName: string;
  submitterRole: "admin" | "client";
};

export class LinkRepository extends BaseRepository {
  async create(data: {
    projectId: string;
    submittedBy: string;
    url: string;
    label: string;
    linkType: LinkRow["linkType"];
    note?: string | null;
  }): Promise<LinkRow> {
    const [row] = await this.db.insert(projectLinks).values(data).returning();
    if (!row) throw new Error("Failed to create link");
    return row;
  }

  async findByProjectId(projectId: string): Promise<LinkWithSubmitter[]> {
    return this.db
      .select({
        id: projectLinks.id,
        projectId: projectLinks.projectId,
        submittedBy: projectLinks.submittedBy,
        url: projectLinks.url,
        label: projectLinks.label,
        linkType: projectLinks.linkType,
        note: projectLinks.note,
        createdAt: projectLinks.createdAt,
        submitterName: users.name,
        submitterRole: users.role,
      })
      .from(projectLinks)
      .innerJoin(users, eq(projectLinks.submittedBy, users.id))
      .where(eq(projectLinks.projectId, projectId))
      .orderBy(desc(projectLinks.createdAt));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.delete(projectLinks).where(eq(projectLinks.id, id)).returning({ id: projectLinks.id });
    return result.length > 0;
  }
}

export const linkRepository = new LinkRepository();
