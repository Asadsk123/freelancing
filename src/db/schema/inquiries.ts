import { pgTable, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "responded",
  "in_discussion",
  "accepted",
  "declined",
  "project_created",
]);

export const inquiries = pgTable("inquiries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  trackingId: text("tracking_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  serviceInterest: text("service_interest"),
  message: text("message").notNull(),
  budget: text("budget"),
  status: inquiryStatusEnum("status").notNull().default("new"),
  assignedTo: text("assigned_to")
    .references(() => users.id, { onDelete: "set null" }),
  internalNotes: text("internal_notes"),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  assignee: one(users, {
    fields: [inquiries.assignedTo],
    references: [users.id],
  }),
}));
