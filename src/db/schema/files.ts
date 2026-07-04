import { pgTable, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects } from "./projects";
import { milestones } from "./projects";

export const fileStatusEnum = pgEnum("file_status", [
  "draft",
  "preview",
  "revision_requested",
  "approved",
  "final",
]);

export const files = pgTable("files", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  milestoneId: text("milestone_id")
    .references(() => milestones.id, { onDelete: "set null" }),
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  originalKey: text("original_key").notNull(),
  watermarkedKey: text("watermarked_key"),
  status: fileStatusEnum("status").notNull().default("draft"),
  revisionNote: text("revision_note"),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const filesRelations = relations(files, ({ one }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  milestone: one(milestones, {
    fields: [files.milestoneId],
    references: [milestones.id],
  }),
  uploader: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
}));
