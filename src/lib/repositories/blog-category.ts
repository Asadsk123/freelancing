import { eq, desc } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { blogCategories } from "@/db/schema";

type BlogCategoryRow = typeof blogCategories.$inferSelect;

export class BlogCategoryRepository extends BaseRepository {
  async findAll(): Promise<BlogCategoryRow[]> {
    return this.db
      .select()
      .from(blogCategories)
      .orderBy(desc(blogCategories.createdAt));
  }

  async findById(id: string): Promise<BlogCategoryRow | undefined> {
    const [row] = await this.db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1);
    return row;
  }

  async create(data: {
    name: string;
    slug: string;
    description: string | null;
  }): Promise<BlogCategoryRow> {
    const result = await this.db
      .insert(blogCategories)
      .values(data)
      .returning();
    return result[0]!;
  }
}

export const blogCategoryRepository = new BlogCategoryRepository();
