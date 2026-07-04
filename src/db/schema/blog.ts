import { pgTable, text, timestamp, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "archived",
]);

export const blogCategories = pgTable("blog_categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogTags = pgTable("blog_tags", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url"),
  categoryId: text("category_id")
    .references(() => blogCategories.id, { onDelete: "set null" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  status: blogStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: text("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  postTags: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  postTags: many(blogPostTags),
}));
