import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title must be under 300 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().max(1000, "Excerpt must be under 1000 characters").optional().or(z.literal("")),
  content: z.string().min(1, "Content is required").max(100000),
  coverImageUrl: z.string().max(2000).optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type CreateBlogPostData = z.infer<typeof createBlogPostSchema>;

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  postId: z.string().min(1),
});

export type UpdateBlogPostData = z.infer<typeof updateBlogPostSchema>;
