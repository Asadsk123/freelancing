import { eq, desc, gte, sql } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { inquiries } from "@/db/schema";
import type { InquiryFormData } from "@/lib/validations/inquiry";

type InquiryRow = typeof inquiries.$inferSelect;
type InquiryInsert = typeof inquiries.$inferInsert;

export class InquiryRepository extends BaseRepository {
  async create(
    data: InquiryFormData,
    trackingId: string,
  ): Promise<InquiryRow> {
    const insert: InquiryInsert = {
      trackingId,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      serviceInterest: data.service || null,
      message: data.message,
      budget: data.budget || null,
    };

    const [row] = await this.db.insert(inquiries).values(insert).returning();
    if (!row) {
      throw new Error("Failed to create inquiry");
    }
    return row;
  }

  async findAll(): Promise<InquiryRow[]> {
    return this.db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt));
  }

  async findById(id: string): Promise<InquiryRow | undefined> {
    const [row] = await this.db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, id))
      .limit(1);
    return row;
  }

  async countSince(date: Date): Promise<number> {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)::int` })
      .from(inquiries)
      .where(gte(inquiries.createdAt, date));
    return result?.count ?? 0;
  }

  /** Inquiry counts per calendar month for the trailing `monthsBack` months (oldest first, zero-filled). */
  async monthlyCounts(monthsBack: number): Promise<{ month: string; count: number }[]> {
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCMonth(start.getUTCMonth() - (monthsBack - 1));

    const rows = await this.db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${inquiries.createdAt}), 'YYYY-MM')`,
        count: sql<number>`count(*)::int`,
      })
      .from(inquiries)
      .where(gte(inquiries.createdAt, start))
      .groupBy(sql`date_trunc('month', ${inquiries.createdAt})`);

    const byMonth = new Map(rows.map((row) => [row.month, row.count]));
    const result: { month: string; count: number }[] = [];
    for (let i = 0; i < monthsBack; i++) {
      const d = new Date(start);
      d.setUTCMonth(start.getUTCMonth() + i);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      result.push({ month: key, count: byMonth.get(key) ?? 0 });
    }
    return result;
  }

  async updateStatus(
    id: string,
    status: InquiryRow["status"],
  ): Promise<InquiryRow | undefined> {
    const [row] = await this.db
      .update(inquiries)
      .set({ status, updatedAt: new Date() })
      .where(eq(inquiries.id, id))
      .returning();
    return row;
  }
}

export const inquiryRepository = new InquiryRepository();
