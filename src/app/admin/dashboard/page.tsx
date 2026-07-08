import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import {
  FolderOpen,
  Users,
  Inbox,
  Star,
  FileText,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { hasDatabase } from "@/db";
import { inquiryRepository } from "@/lib/repositories/inquiry";
import { userRepository } from "@/lib/repositories/user";
import { projectRepository } from "@/lib/repositories/project";
import { reviewRepository } from "@/lib/repositories/review";
import { blogPostRepository } from "@/lib/repositories/blog-post";
import { serviceRepository } from "@/lib/repositories/service";
import { milestoneRepository } from "@/lib/repositories/milestone";
import { formatRelativeTime } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin overview and statistics.",
};

const inquiryStatusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  new: { label: "New", variant: "default" },
  responded: { label: "Responded", variant: "secondary" },
  in_discussion: { label: "In Discussion", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
};

const projectStatusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
};

function monthLabel(month: string): string {
  const [year = "2000", m = "1"] = month.split("-");
  return new Date(Number(year), Number(m) - 1, 1).toLocaleString("en", { month: "short" });
}

export default async function AdminDashboardPage() {
  const dbAvailable = hasDatabase();

  const allInquiries = dbAvailable
    ? await inquiryRepository.findAll()
    : [];
  const newInquiryCount = allInquiries.filter((i) => i.status === "new").length;
  const recentInquiries = allInquiries.slice(0, 5);

  const clientCount = dbAvailable
    ? await userRepository.countByRole("client")
    : 0;

  const recentProjects = dbAvailable
    ? (await projectRepository.findAll()).slice(0, 5)
    : [];
  const activeProjectCount = dbAvailable
    ? await projectRepository.countByStatus("in_progress")
    : 0;
  const pendingProjectCount = dbAvailable
    ? await projectRepository.countByStatus("pending")
    : 0;

  const publishedReviewCount = dbAvailable
    ? await reviewRepository.countPublished()
    : 0;
  const totalReviewCount = dbAvailable
    ? await reviewRepository.count()
    : 0;

  const blogPostCount = dbAvailable
    ? await blogPostRepository.count()
    : 0;
  const publishedPostCount = dbAvailable
    ? await blogPostRepository.countByStatus("published")
    : 0;

  const activeServiceCount = dbAvailable
    ? await serviceRepository.countActive()
    : 0;
  const totalServiceCount = dbAvailable
    ? await serviceRepository.count()
    : 0;

  const now = Date.now();
  const days30Ago = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const days60Ago = new Date(now - 60 * 24 * 60 * 60 * 1000);

  const [inquiries30, inquiries60, averageRating, milestoneStats, completedProjectCount, inquiryTrend] =
    dbAvailable
      ? await Promise.all([
          inquiryRepository.countSince(days30Ago),
          inquiryRepository.countSince(days60Ago),
          reviewRepository.averageRating(),
          milestoneRepository.completionStats(),
          projectRepository.countByStatus("completed"),
          inquiryRepository.monthlyCounts(6),
        ])
      : [0, 0, null, { total: 0, completed: 0 }, 0, []];
  const inquiriesPrevious30 = inquiries60 - inquiries30;
  const inquiryDelta = inquiries30 - inquiriesPrevious30;
  const milestoneRate =
    milestoneStats.total > 0
      ? Math.round((milestoneStats.completed / milestoneStats.total) * 100)
      : null;
  const trendMax = Math.max(1, ...inquiryTrend.map((point) => point.count));

  const noDb = "Connect database to track";

  const stats: { label: string; value: string; icon: LucideIcon; change: string }[] = [
    { label: "Active Projects", value: dbAvailable ? String(activeProjectCount + pendingProjectCount) : "—", icon: FolderOpen, change: dbAvailable ? `${activeProjectCount} in progress` : noDb },
    { label: "Total Clients", value: dbAvailable ? String(clientCount) : "—", icon: Users, change: dbAvailable ? "registered clients" : noDb },
    { label: "New Inquiries", value: dbAvailable ? String(newInquiryCount) : "—", icon: Inbox, change: dbAvailable ? `${allInquiries.length} total` : noDb },
    { label: "Published Reviews", value: dbAvailable ? String(publishedReviewCount) : "—", icon: Star, change: dbAvailable ? `${totalReviewCount} total` : noDb },
    { label: "Blog Posts", value: dbAvailable ? String(blogPostCount) : "—", icon: FileText, change: dbAvailable ? `${publishedPostCount} published` : noDb },
    { label: "Active Services", value: dbAvailable ? String(activeServiceCount) : "—", icon: Layers, change: dbAvailable ? `${totalServiceCount} total` : noDb },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Admin Dashboard" description="Overview of your agency." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                <stat.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
              </div>
            </CardContent>
            <div className="px-6 pb-4">
              <p className="text-xs text-[var(--muted-foreground)]">{stat.change}</p>
            </div>
          </Card>
        ))}
      </div>

      {dbAvailable && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Analytics</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Inquiries — last 30 days</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{inquiries30}</p>
                  <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    {inquiryDelta > 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-[var(--success,#16a34a)]" />
                    ) : inquiryDelta < 0 ? (
                      <TrendingDown className="h-3.5 w-3.5 text-[var(--destructive)]" />
                    ) : (
                      <Minus className="h-3.5 w-3.5" />
                    )}
                    {inquiryDelta > 0 ? `+${inquiryDelta}` : inquiryDelta} vs previous 30 days
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Average review rating</p>
                <div className="mt-1 flex items-baseline gap-2">
                  {averageRating === null ? (
                    <p className="text-2xl font-bold text-[var(--foreground)]">—</p>
                  ) : (
                    <>
                      <p className="flex items-center gap-1.5 text-2xl font-bold text-[var(--foreground)]">
                        {averageRating.toFixed(1)}
                        <Star className="h-5 w-5 fill-[var(--warning,#d97706)] text-[var(--warning,#d97706)]" />
                      </p>
                      <span className="text-xs text-[var(--muted-foreground)]">from {totalReviewCount} review{totalReviewCount === 1 ? "" : "s"}</span>
                    </>
                  )}
                </div>
                {averageRating === null && (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">No reviews yet</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Milestone completion</p>
                <div className="mt-1 flex items-baseline gap-2">
                  {milestoneRate === null ? (
                    <p className="text-2xl font-bold text-[var(--foreground)]">—</p>
                  ) : (
                    <>
                      <p className="flex items-center gap-1.5 text-2xl font-bold text-[var(--foreground)]">
                        {milestoneRate}%
                        <CheckCircle2 className="h-5 w-5 text-[var(--success,#16a34a)]" />
                      </p>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {milestoneStats.completed} of {milestoneStats.total} · {completedProjectCount} project{completedProjectCount === 1 ? "" : "s"} delivered
                      </span>
                    </>
                  )}
                </div>
                {milestoneRate === null && (
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">No milestones yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardContent className="pt-6">
              <p className="text-sm text-[var(--muted-foreground)]">Inquiries — last 6 months</p>
              <div className="mt-4 flex h-32 items-end gap-3">
                {inquiryTrend.map((point) => (
                  <div key={point.month} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs font-medium text-[var(--foreground)]">{point.count}</span>
                    <div
                      className="w-full max-w-12 rounded-t-[var(--radius-sm,4px)] bg-[var(--primary)]/80"
                      style={{ height: `${Math.max(4, Math.round((point.count / trendMax) * 88))}px` }}
                      aria-hidden
                    />
                    <span className="text-xs text-[var(--muted-foreground)]">{monthLabel(point.month)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Inquiries</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/inquiries">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {recentInquiries.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <EmptyState
                    icon={Inbox}
                    title={dbAvailable ? "No inquiries yet" : "Database not connected"}
                    description={dbAvailable ? "Inquiries from the contact form will appear here." : "Set DATABASE_URL to see real data."}
                  />
                </CardContent>
              </Card>
            ) : (
              recentInquiries.map((inquiry) => {
                const badge = inquiryStatusBadge[inquiry.status] ?? { label: "New", variant: "default" as const };
                return (
                  <Card key={inquiry.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{inquiry.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {inquiry.serviceInterest ?? "General"} &middot; {formatRelativeTime(inquiry.createdAt)}
                        </p>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Active Projects</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/projects">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {recentProjects.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <EmptyState
                    icon={FolderOpen}
                    title={dbAvailable ? "No projects yet" : "Database not connected"}
                    description={dbAvailable ? "Projects will appear here once created." : "Set DATABASE_URL to see real data."}
                  />
                </CardContent>
              </Card>
            ) : (
              recentProjects.map((project) => {
                const badge = projectStatusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
                return (
                  <Card key={project.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{project.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{project.clientName}</p>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
