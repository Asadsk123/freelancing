import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";
import { hasDatabase } from "@/db";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Manage Blog",
  description: "Create and manage blog posts.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  draft: { label: "Draft", variant: "warning" },
  published: { label: "Published", variant: "success" },
  archived: { label: "Archived", variant: "secondary" },
};

export default async function AdminBlogPage() {
  const dbAvailable = hasDatabase();
  const posts = dbAvailable ? await blogPostRepository.findAll() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Blog" description="Create and manage blog posts." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to manage blog posts.
          </p>
        </div>
      )}

      {dbAvailable && posts.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={FileText}
                title="No blog posts yet"
                description="Blog posts will appear here once created."
              />
            </CardContent>
          </Card>
        </div>
      ) : posts.length > 0 ? (
        <div className="mt-8">
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Author</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const badge = statusBadge[post.status] ?? { label: "Draft", variant: "warning" as const };
                  return (
                    <tr key={post.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--foreground)]">{post.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">/{post.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {post.categoryName ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {post.authorName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                        {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
