import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { hasDatabase } from "@/db";
import { blogCategoryRepository } from "@/lib/repositories/blog-category";
import { BlogPostForm } from "../blog-post-form";

export const metadata: Metadata = {
  title: "New Blog Post",
  description: "Write and publish a new blog post.",
};

export default async function NewBlogPostPage() {
  const dbAvailable = hasDatabase();
  const categories = dbAvailable ? await blogCategoryRepository.findAll() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      <PageHeader title="New Post" description="Write and publish a new blog post." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">Database not connected — posts cannot be saved.</p>
        </div>
      )}

      <div className="mt-8">
        <BlogPostForm
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
          dbAvailable={dbAvailable}
        />
      </div>
    </div>
  );
}
