import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { hasDatabase } from "@/db";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, guides, and updates from the Royal Asad team.",
};

export default async function BlogPage() {
  const dbAvailable = hasDatabase();
  const posts = dbAvailable ? await blogPostRepository.findPublished() : [];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Blog"
        description="Insights, guides, and updates from our team."
      />

      {posts.length === 0 ? (
        <div className="mt-12">
          <Card>
            <CardContent className="py-16">
              <EmptyState
                icon={FileText}
                title="Articles coming soon"
                description="We're preparing our first articles. Subscribe to be notified when we publish."
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="py-6">
                {post.categoryName && (
                  <Badge variant="secondary" className="mb-3">{post.categoryName}</Badge>
                )}
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-[var(--primary)]"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                  <span>{post.authorName}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
