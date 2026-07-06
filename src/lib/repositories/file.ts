import { eq, desc, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { files, users } from "@/db/schema";

type FileRow = typeof files.$inferSelect;

export type FileWithUploader = FileRow & {
  uploaderName: string;
};

export class FileRepository extends BaseRepository {
  async findByProjectId(projectId: string): Promise<FileWithUploader[]> {
    return this.db
      .select({
        id: files.id,
        projectId: files.projectId,
        milestoneId: files.milestoneId,
        uploadedBy: files.uploadedBy,
        fileName: files.fileName,
        mimeType: files.mimeType,
        fileSize: files.fileSize,
        originalKey: files.originalKey,
        watermarkedKey: files.watermarkedKey,
        status: files.status,
        revisionNote: files.revisionNote,
        version: files.version,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
        uploaderName: users.name,
      })
      .from(files)
      .innerJoin(users, eq(files.uploadedBy, users.id))
      .where(eq(files.projectId, projectId))
      .orderBy(desc(files.createdAt));
  }

  async findById(id: string): Promise<FileWithUploader | undefined> {
    const [row] = await this.db
      .select({
        id: files.id,
        projectId: files.projectId,
        milestoneId: files.milestoneId,
        uploadedBy: files.uploadedBy,
        fileName: files.fileName,
        mimeType: files.mimeType,
        fileSize: files.fileSize,
        originalKey: files.originalKey,
        watermarkedKey: files.watermarkedKey,
        status: files.status,
        revisionNote: files.revisionNote,
        version: files.version,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
        uploaderName: users.name,
      })
      .from(files)
      .innerJoin(users, eq(files.uploadedBy, users.id))
      .where(eq(files.id, id))
      .limit(1);
    return row;
  }

  async updateStatus(
    id: string,
    status: FileRow["status"],
    revisionNote?: string | null,
  ): Promise<FileRow | undefined> {
    const [row] = await this.db
      .update(files)
      .set({
        status,
        revisionNote: revisionNote ?? null,
        updatedAt: new Date(),
      })
      .where(eq(files.id, id))
      .returning();
    return row;
  }

  async countByProjectId(projectId: string): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(files)
      .where(eq(files.projectId, projectId));
    return result?.count ?? 0;
  }
}

export const fileRepository = new FileRepository();
