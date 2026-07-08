import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { hasDatabase } from "@/db";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { blogCategoryRepository } from "@/lib/repositories/blog-category";
import { BlogPostForm } from "../blog-post-form";

export const metadata: Metadata = {
  title: "Edit Blog Post",
  description: "Edit an existing blog post.",
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!hasDatabase()) notFound();

  const [post, categories] = await Promise.all([
    blogPostRepository.findById(id),
    blogCategoryRepository.findAll(),
  ]);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-[1280px]">
      <Link
        href="/admin/blog"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      <PageHeader title="Edit Post" description={`Editing “${post.title}”`} />

      <div className="mt-8">
        <BlogPostForm
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            coverImageUrl: post.coverImageUrl ?? "",
            categoryId: post.categoryId ?? "",
            status: post.status,
          }}
          dbAvailable
        />
      </div>
    </div>
  );
}
