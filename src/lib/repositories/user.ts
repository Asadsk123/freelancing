import { eq, and, desc, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { users, projects } from "@/db/schema";

type UserRow = typeof users.$inferSelect;
type UserRole = UserRow["role"];

export type ClientWithProjectCount = UserRow & {
  projectCount: number;
};

const ADMIN_EMAIL = "admin@royalasad.com";

export class UserRepository extends BaseRepository {
  async createClient(data: {
    email: string;
    name: string;
    company?: string | null;
    phone?: string | null;
  }): Promise<UserRow> {
    const existing = await this.findByEmail(data.email);
    if (existing) return existing;
    const [row] = await this.db
      .insert(users)
      .values({ email: data.email, name: data.name, role: "client", company: data.company ?? null, phone: data.phone ?? null })
      .returning();
    if (!row) throw new Error("Failed to create client");
    return row;
  }

  async findByEmail(email: string): Promise<UserRow | undefined> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return row;
  }

  async findOrCreate(email: string): Promise<UserRow> {
    const existing = await this.findByEmail(email);
    if (existing) return existing;

    const name = deriveNameFromEmail(email);
    const role = email === ADMIN_EMAIL ? "admin" : "client";

    const [row] = await this.db
      .insert(users)
      .values({ email, name, role })
      .returning();
    if (!row) throw new Error("Failed to create user");
    return row;
  }

  async countByRole(role: "admin" | "client"): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, role));
    return result?.count ?? 0;
  }

  async findAllClients(): Promise<ClientWithProjectCount[]> {
    const rows = await this.db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        phone: users.phone,
        company: users.company,
        role: users.role,
        notificationPreference: users.notificationPreference,
        avatarUrl: users.avatarUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        projectCount: sql<number>`count(${projects.id})::int`,
      })
      .from(users)
      .leftJoin(projects, eq(users.id, projects.clientId))
      .where(eq(users.role, "client"))
      .groupBy(users.id)
      .orderBy(desc(users.createdAt));
    return rows;
  }

  async findById(id: string): Promise<UserRow | undefined> {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row;
  }

  async updateProfile(
    id: string,
    data: { name?: string; phone?: string | null; company?: string | null },
  ): Promise<UserRow | undefined> {
    const [row] = await this.db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return row;
  }

  async toggleActive(id: string): Promise<UserRow | undefined> {
    const existing = await this.findById(id);
    if (!existing) return undefined;

    const [row] = await this.db
      .update(users)
      .set({ isActive: !existing.isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return row;
  }

  /** All administrators, newest first. */
  async findAllAdmins(): Promise<UserRow[]> {
    return this.db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .orderBy(desc(users.createdAt));
  }

  /** Count of administrators whose account is active. */
  async countActiveAdmins(): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(and(eq(users.role, "admin"), eq(users.isActive, true)));
    return result?.count ?? 0;
  }

  async setActive(id: string, isActive: boolean): Promise<UserRow | undefined> {
    const [row] = await this.db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return row;
  }

  async setRole(id: string, role: UserRole): Promise<UserRow | undefined> {
    const [row] = await this.db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return row;
  }

  async updateNotificationPreference(
    id: string,
    preference: UserRow["notificationPreference"],
  ): Promise<UserRow | undefined> {
    const [row] = await this.db
      .update(users)
      .set({ notificationPreference: preference, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return row;
  }
}

function deriveNameFromEmail(email: string): string {
  const namePart = email.split("@")[0] ?? "User";
  return namePart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const userRepository = new UserRepository();
