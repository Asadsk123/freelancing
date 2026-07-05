import { eq, desc, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { blogPosts, blogCategories, users } from "@/db/schema";

type BlogPostRow = typeof blogPosts.$inferSelect;

export type BlogPostWithDetails = BlogPostRow & {
  categoryName: string | null;
  authorName: string;
};

export class BlogPostRepository extends BaseRepository {
  async findAll(): Promise<BlogPostWithDetails[]> {
    return this.db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        coverImageUrl: blogPosts.coverImageUrl,
        categoryId: blogPosts.categoryId,
        authorId: blogPosts.authorId,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        categoryName: blogCategories.name,
        authorName: users.name,
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .orderBy(desc(blogPosts.createdAt));
  }

  async findPublished(): Promise<BlogPostWithDetails[]> {
    return this.db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        coverImageUrl: blogPosts.coverImageUrl,
        categoryId: blogPosts.categoryId,
        authorId: blogPosts.authorId,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        categoryName: blogCategories.name,
        authorName: users.name,
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async findById(id: string): Promise<BlogPostWithDetails | undefined> {
    const [row] = await this.db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        coverImageUrl: blogPosts.coverImageUrl,
        categoryId: blogPosts.categoryId,
        authorId: blogPosts.authorId,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        categoryName: blogCategories.name,
        authorName: users.name,
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(eq(blogPosts.id, id))
      .limit(1);
    return row;
  }

  async findBySlug(slug: string): Promise<BlogPostWithDetails | undefined> {
    const [row] = await this.db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        content: blogPosts.content,
        coverImageUrl: blogPosts.coverImageUrl,
        categoryId: blogPosts.categoryId,
        authorId: blogPosts.authorId,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        categoryName: blogCategories.name,
        authorName: users.name,
      })
      .from(blogPosts)
      .innerJoin(users, eq(blogPosts.authorId, users.id))
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return row;
  }

  async create(data: {
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImageUrl: string | null;
    categoryId: string | null;
    authorId: string;
    status: "draft" | "published" | "archived";
  }): Promise<BlogPostRow> {
    const result = await this.db
      .insert(blogPosts)
      .values({
        ...data,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning();
    return result[0]!;
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      coverImageUrl: string | null;
      categoryId: string | null;
      status: "draft" | "published" | "archived";
    }>,
  ): Promise<BlogPostRow | undefined> {
    const updatePayload: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.status === "published") {
      const existing = await this.db
        .select({ publishedAt: blogPosts.publishedAt })
        .from(blogPosts)
        .where(eq(blogPosts.id, id))
        .limit(1);
      if (existing[0] && !existing[0].publishedAt) {
        updatePayload.publishedAt = new Date();
      }
    } else if (data.status) {
      updatePayload.publishedAt = null;
    }

    const [row] = await this.db
      .update(blogPosts)
      .set(updatePayload)
      .where(eq(blogPosts.id, id))
      .returning();
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id });
    return result.length > 0;
  }

  async count(): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts);
    return result?.count ?? 0;
  }

  async countByStatus(status: "draft" | "published" | "archived"): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(eq(blogPosts.status, status));
    return result?.count ?? 0;
  }
}

export const blogPostRepository = new BlogPostRepository();
