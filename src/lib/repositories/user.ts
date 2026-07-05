import { eq, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { users } from "@/db/schema";

type UserRow = typeof users.$inferSelect;

const ADMIN_EMAIL = "admin@royalasad.com";

export class UserRepository extends BaseRepository {
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
}

function deriveNameFromEmail(email: string): string {
  const namePart = email.split("@")[0] ?? "User";
  return namePart
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const userRepository = new UserRepository();
