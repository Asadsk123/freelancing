import { eq, desc, and, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { services, serviceCategories } from "@/db/schema";

type ServiceRow = typeof services.$inferSelect;

export type ServiceWithCategory = ServiceRow & {
  categoryName: string;
  categorySlug: string;
};

export class ServiceRepository extends BaseRepository {
  async create(data: {
    categoryId: string;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription?: string | null;
    icon?: string | null;
    features?: string[];
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<ServiceRow> {
    const [row] = await this.db
      .insert(services)
      .values({
        categoryId: data.categoryId,
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription || null,
        icon: data.icon || null,
        features: data.features ?? [],
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      })
      .returning();
    if (!row) throw new Error("Failed to create service");
    return row;
  }

  async findAll(): Promise<ServiceWithCategory[]> {
    return this.db
      .select({
        id: services.id,
        categoryId: services.categoryId,
        name: services.name,
        slug: services.slug,
        shortDescription: services.shortDescription,
        fullDescription: services.fullDescription,
        icon: services.icon,
        features: services.features,
        sortOrder: services.sortOrder,
        isActive: services.isActive,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
        categoryName: serviceCategories.name,
        categorySlug: serviceCategories.slug,
      })
      .from(services)
      .innerJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
      .orderBy(services.sortOrder, desc(services.createdAt));
  }

  async findActive(): Promise<ServiceWithCategory[]> {
    return this.db
      .select({
        id: services.id,
        categoryId: services.categoryId,
        name: services.name,
        slug: services.slug,
        shortDescription: services.shortDescription,
        fullDescription: services.fullDescription,
        icon: services.icon,
        features: services.features,
        sortOrder: services.sortOrder,
        isActive: services.isActive,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
        categoryName: serviceCategories.name,
        categorySlug: serviceCategories.slug,
      })
      .from(services)
      .innerJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
      .where(
        and(
          eq(services.isActive, true),
          eq(serviceCategories.isActive, true),
        ),
      )
      .orderBy(services.sortOrder, desc(services.createdAt));
  }

  async findById(id: string): Promise<ServiceWithCategory | undefined> {
    const [row] = await this.db
      .select({
        id: services.id,
        categoryId: services.categoryId,
        name: services.name,
        slug: services.slug,
        shortDescription: services.shortDescription,
        fullDescription: services.fullDescription,
        icon: services.icon,
        features: services.features,
        sortOrder: services.sortOrder,
        isActive: services.isActive,
        createdAt: services.createdAt,
        updatedAt: services.updatedAt,
        categoryName: serviceCategories.name,
        categorySlug: serviceCategories.slug,
      })
      .from(services)
      .innerJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
      .where(eq(services.id, id))
      .limit(1);
    return row;
  }

  async update(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      slug?: string;
      shortDescription?: string;
      fullDescription?: string | null;
      icon?: string | null;
      features?: string[];
      sortOrder?: number;
    },
  ): Promise<ServiceRow | undefined> {
    const [row] = await this.db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return row;
  }

  async toggleActive(id: string): Promise<ServiceRow | undefined> {
    const existing = await this.db
      .select({ isActive: services.isActive })
      .from(services)
      .where(eq(services.id, id))
      .limit(1);
    if (!existing[0]) return undefined;

    const [row] = await this.db
      .update(services)
      .set({ isActive: !existing[0].isActive, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return row;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(services)
      .where(eq(services.id, id))
      .returning({ id: services.id });
    return result.length > 0;
  }

  async count(): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(services);
    return result?.count ?? 0;
  }

  async countActive(): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(services)
      .where(eq(services.isActive, true));
    return result?.count ?? 0;
  }
}

export const serviceRepository = new ServiceRepository();
