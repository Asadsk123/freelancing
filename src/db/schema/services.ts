import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const serviceCategories = pgTable("service_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  categoryId: text("category_id")
    .notNull()
    .references(() => serviceCategories.id, { onDelete: "restrict" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  icon: text("icon"),
  features: jsonb("features").$type<string[]>().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
}));
