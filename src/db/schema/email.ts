import { pgTable, text, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const emailStatusEnum = pgEnum("email_status", [
  "queued",
  "sending",
  "sent",
  "failed",
]);

export const emailQueue = pgTable("email_queue", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  to: text("to").notNull(),
  from: text("from").notNull(),
  subject: text("subject").notNull(),
  htmlBody: text("html_body").notNull(),
  textBody: text("text_body"),
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  status: emailStatusEnum("status").notNull().default("queued"),
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
