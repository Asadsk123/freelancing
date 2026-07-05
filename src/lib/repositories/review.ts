import { eq, desc, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { reviews, users, projects } from "@/db/schema";

type ReviewRow = typeof reviews.$inferSelect;

export type ReviewWithDetails = ReviewRow & {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
};

export class ReviewRepository extends BaseRepository {
  async findAll(): Promise<ReviewWithDetails[]> {
    return this.db
      .select({
        id: reviews.id,
        projectId: reviews.projectId,
        clientId: reviews.clientId,
        rating: reviews.rating,
        testimonial: reviews.testimonial,
        isPublished: reviews.isPublished,
        publishedAt: reviews.publishedAt,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        clientName: users.name,
        clientEmail: users.email,
        projectTitle: projects.title,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .innerJoin(projects, eq(reviews.projectId, projects.id))
      .orderBy(desc(reviews.createdAt));
  }

  async findPublished(): Promise<ReviewWithDetails[]> {
    return this.db
      .select({
        id: reviews.id,
        projectId: reviews.projectId,
        clientId: reviews.clientId,
        rating: reviews.rating,
        testimonial: reviews.testimonial,
        isPublished: reviews.isPublished,
        publishedAt: reviews.publishedAt,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        clientName: users.name,
        clientEmail: users.email,
        projectTitle: projects.title,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .innerJoin(projects, eq(reviews.projectId, projects.id))
      .where(eq(reviews.isPublished, true))
      .orderBy(desc(reviews.publishedAt));
  }

  async findById(id: string): Promise<ReviewWithDetails | undefined> {
    const [row] = await this.db
      .select({
        id: reviews.id,
        projectId: reviews.projectId,
        clientId: reviews.clientId,
        rating: reviews.rating,
        testimonial: reviews.testimonial,
        isPublished: reviews.isPublished,
        publishedAt: reviews.publishedAt,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        clientName: users.name,
        clientEmail: users.email,
        projectTitle: projects.title,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .innerJoin(projects, eq(reviews.projectId, projects.id))
      .where(eq(reviews.id, id))
      .limit(1);
    return row;
  }

  async togglePublished(id: string): Promise<ReviewRow | undefined> {
    const existing = await this.db
      .select({ isPublished: reviews.isPublished })
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);
    if (!existing[0]) return undefined;

    const nowPublished = !existing[0].isPublished;
    const [row] = await this.db
      .update(reviews)
      .set({
        isPublished: nowPublished,
        publishedAt: nowPublished ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, id))
      .returning();
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning({ id: reviews.id });
    return result.length > 0;
  }

  async count(): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviews);
    return result?.count ?? 0;
  }

  async countPublished(): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviews)
      .where(eq(reviews.isPublished, true));
    return result?.count ?? 0;
  }
}

export const reviewRepository = new ReviewRepository();
