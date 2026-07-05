import { eq, desc } from "drizzle-orm";
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
