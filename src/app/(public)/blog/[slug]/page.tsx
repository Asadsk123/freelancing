import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { hasDatabase } from "@/db";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { formatDate } from "@/lib/utils/formatting";
import { brand } from "@/config/brand";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getPublishedPost(slug: string) {
  if (!hasDatabase()) return undefined;
  const post = await blogPostRepository.findBySlug(slug);
  return post && post.status === "published" ? post : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      ...(post.coverImageUrl ? { images: [post.coverImageUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: brand.name, url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      {post.categoryName && <Badge variant="secondary" className="mb-3">{post.categoryName}</Badge>}
      <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <span>{post.authorName}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
      </div>

      {post.excerpt && (
        <p className="mt-6 text-lg text-[var(--muted-foreground)]">{post.excerpt}</p>
      )}

      <div className="mt-8 whitespace-pre-wrap text-base leading-7 text-[var(--foreground)]">
        {post.content}
      </div>
    </article>
  );
}
