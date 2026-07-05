import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Manage Blog",
  description: "Create and manage blog posts.",
};

const mockPosts = [
  {
    id: "1",
    title: "Why Your Business Needs a Professional Website in 2026",
    slug: "professional-website-2026",
    category: "Web Development",
    status: "published",
    publishedAt: "Jun 28, 2026",
    views: 342,
  },
  {
    id: "2",
    title: "The Complete Guide to Brand Identity Design",
    slug: "brand-identity-guide",
    category: "Design",
    status: "published",
    publishedAt: "Jun 15, 2026",
    views: 218,
  },
  {
    id: "3",
    title: "5 E-commerce Trends That Will Shape 2027",
    slug: "ecommerce-trends-2027",
    category: "E-commerce",
    status: "draft",
    publishedAt: null,
    views: 0,
  },
  {
    id: "4",
    title: "How to Choose the Right Digital Marketing Strategy",
    slug: "digital-marketing-strategy",
    category: "Marketing",
    status: "published",
    publishedAt: "May 30, 2026",
    views: 156,
  },
  {
    id: "5",
    title: "Mobile-First Design: Best Practices and Examples",
    slug: "mobile-first-design",
    category: "Design",
    status: "archived",
    publishedAt: "Apr 10, 2026",
    views: 89,
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  draft: { label: "Draft", variant: "warning" },
  published: { label: "Published", variant: "success" },
  archived: { label: "Archived", variant: "secondary" },
};

export default function AdminBlogPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Blog" description="Create and manage blog posts." />

      <div className="mt-8">
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Title</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Category</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Published</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Views</th>
              </tr>
            </thead>
            <tbody>
              {mockPosts.map((post) => {
                const badge = statusBadge[post.status] ?? { label: "Draft", variant: "warning" as const };
                return (
                  <tr key={post.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--foreground)]">{post.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{post.category}</td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {post.publishedAt ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">
                      {post.views > 0 ? post.views.toLocaleString() : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
