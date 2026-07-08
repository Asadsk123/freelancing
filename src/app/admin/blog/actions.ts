"use server";

import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/validations/blog-post";
import { hasDatabase } from "@/db";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw = {
    title: field("title"),
    slug: field("slug"),
    excerpt: field("excerpt"),
    content: field("content"),
    coverImageUrl: field("coverImageUrl"),
    categoryId: field("categoryId"),
    status: field("status") || "draft",
  };

  const result = createBlogPostSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const post = await blogPostRepository.create({
      title: result.data.title,
      slug: result.data.slug,
      excerpt: result.data.excerpt || null,
      content: result.data.content,
      coverImageUrl: result.data.coverImageUrl || null,
      categoryId: result.data.categoryId || null,
      authorId: auth.session.userId,
      status: result.data.status,
    });
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "blog_post.created",
      entityType: "blog_post",
      entityId: post.id,
      metadata: { title: post.title, status: post.status },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (err) {
    console.error("Failed to create blog post:", err);
    const message = err instanceof Error && err.message.includes("unique")
      ? "A post with this slug already exists."
      : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}

export async function updateBlogPost(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const field = (name: string) => (formData.get(name) ?? "") as string;
  const raw: Record<string, string> = {
    postId: field("postId"),
  };

  if (formData.has("title")) raw.title = field("title");
  if (formData.has("slug")) raw.slug = field("slug");
  if (formData.has("excerpt")) raw.excerpt = field("excerpt");
  if (formData.has("content")) raw.content = field("content");
  if (formData.has("coverImageUrl")) raw.coverImageUrl = field("coverImageUrl");
  if (formData.has("categoryId")) raw.categoryId = field("categoryId");
  if (formData.has("status")) raw.status = field("status");

  const result = updateBlogPostSchema.safeParse(raw);
  if (!result.success) {
    const firstError = Object.values(result.error.flatten().fieldErrors)[0];
    return { success: false, error: firstError?.[0] ?? "Please check your input." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const { postId, ...updateData } = result.data;
    const payload: Record<string, unknown> = {};

    if (updateData.title !== undefined) payload.title = updateData.title;
    if (updateData.slug !== undefined) payload.slug = updateData.slug;
    if (updateData.excerpt !== undefined) payload.excerpt = updateData.excerpt || null;
    if (updateData.content !== undefined) payload.content = updateData.content;
    if (updateData.coverImageUrl !== undefined) payload.coverImageUrl = updateData.coverImageUrl || null;
    if (updateData.categoryId !== undefined) payload.categoryId = updateData.categoryId || null;
    if (updateData.status !== undefined) payload.status = updateData.status;

    const updated = await blogPostRepository.update(postId, payload);
    if (!updated) {
      return { success: false, error: "Post not found." };
    }
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "blog_post.updated",
      entityType: "blog_post",
      entityId: postId,
      metadata: { title: updated.title, status: updated.status },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (err) {
    console.error("Failed to update blog post:", err);
    const message = err instanceof Error && err.message.includes("unique")
      ? "A post with this slug already exists."
      : "Something went wrong. Please try again.";
    return { success: false, error: message };
  }
}

export async function deleteBlogPost(formData: FormData): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return { success: false, error: auth.error };

  const postId = (formData.get("postId") ?? "") as string;
  if (!postId) {
    return { success: false, error: "Post ID required." };
  }

  if (!hasDatabase()) {
    return { success: false, error: "Database not connected." };
  }

  try {
    const deleted = await blogPostRepository.delete(postId);
    if (!deleted) {
      return { success: false, error: "Post not found." };
    }
    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "blog_post.deleted",
      entityType: "blog_post",
      entityId: postId,
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete blog post:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
