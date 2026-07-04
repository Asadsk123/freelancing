import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { projects } from "./projects";

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  clientId: text("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  rating: integer("rating").notNull(),
  testimonial: text("testimonial"),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  project: one(projects, {
    fields: [reviews.projectId],
    references: [projects.id],
  }),
  client: one(users, {
    fields: [reviews.clientId],
    references: [users.id],
  }),
}));
