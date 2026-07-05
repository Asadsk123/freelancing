import { eq, desc } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { serviceCategories } from "@/db/schema";

type ServiceCategoryRow = typeof serviceCategories.$inferSelect;

export class ServiceCategoryRepository extends BaseRepository {
  async findAll(): Promise<ServiceCategoryRow[]> {
    return this.db
      .select()
      .from(serviceCategories)
      .orderBy(serviceCategories.sortOrder, desc(serviceCategories.createdAt));
  }

  async findActive(): Promise<ServiceCategoryRow[]> {
    return this.db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.isActive, true))
      .orderBy(serviceCategories.sortOrder, desc(serviceCategories.createdAt));
  }

  async findById(id: string): Promise<ServiceCategoryRow | undefined> {
    const [row] = await this.db
      .select()
      .from(serviceCategories)
      .where(eq(serviceCategories.id, id))
      .limit(1);
    return row;
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string | null;
    sortOrder?: number;
  }): Promise<ServiceCategoryRow> {
    const [row] = await this.db
      .insert(serviceCategories)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    if (!row) throw new Error("Failed to create category");
    return row;
  }
}

export const serviceCategoryRepository = new ServiceCategoryRepository();
