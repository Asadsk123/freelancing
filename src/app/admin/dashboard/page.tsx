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
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { hasDatabase } from "@/db";
import { inquiryRepository } from "@/lib/repositories/inquiry";
import { userRepository } from "@/lib/repositories/user";
import { formatRelativeTime } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin overview and statistics.",
};

const recentProjects = [
  { id: "1", title: "Brand Identity Design", client: "Acme Corp", status: "in_progress" },
  { id: "2", title: "E-commerce Website", client: "TechStart Inc", status: "pending" },
  { id: "3", title: "Marketing Campaign", client: "Global Retail", status: "in_progress" },
];

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
};

export default async function AdminDashboardPage() {
  const dbAvailable = hasDatabase();
  const recentInquiries = dbAvailable
    ? (await inquiryRepository.findAll()).slice(0, 5)
    : [];
  const newInquiryCount = recentInquiries.filter((i) => i.status === "new").length;
  const clientCount = dbAvailable
    ? await userRepository.countByRole("client")
    : 0;

  const stats = [
    { label: "Active Projects", value: "—", icon: FolderOpen, change: "Connect database to track" },
    { label: "Total Clients", value: dbAvailable ? String(clientCount) : "—", icon: Users, change: dbAvailable ? "registered clients" : "Connect database to track" },
    { label: "New Inquiries", value: dbAvailable ? String(newInquiryCount) : "—", icon: Inbox, change: dbAvailable ? `${recentInquiries.length} total` : "Connect database to track" },
    { label: "Revenue (MTD)", value: "—", icon: DollarSign, change: "Coming soon" },
  ];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Admin Dashboard" description="Overview of your agency." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            {recentProjects.map((project) => {
              const badge = projectStatusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
              return (
                <Card key={project.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{project.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{project.client}</p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
