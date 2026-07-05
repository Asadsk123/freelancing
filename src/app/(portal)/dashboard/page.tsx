import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrackingId } from "@/components/shared/tracking-id";
import { FolderOpen, MessageSquare, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your project dashboard.",
};

const mockProjects = [
  {
    id: "1",
    trackingId: "RA-2026-000034",
    title: "Brand Identity Design",
    status: "in_progress" as const,
    progress: 60,
    milestones: "3 of 5",
    lastUpdate: "New file uploaded by the team",
  },
  {
    id: "2",
    trackingId: "RA-2026-000035",
    title: "E-commerce Website",
    status: "pending" as const,
    progress: 0,
    milestones: "0 of 4",
    lastUpdate: "Project scope confirmed",
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
};

const mockActivity = [
  { id: "1", message: "New file uploaded: Logo_v3_Final.png", time: "2 hours ago", project: "Brand Identity Design" },
  { id: "2", message: "Milestone completed: Discovery Phase", time: "1 day ago", project: "Brand Identity Design" },
  { id: "3", message: "Project scope confirmed", time: "3 days ago", project: "E-commerce Website" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Dashboard" description="Welcome back. Here's an overview of your projects." />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <FolderOpen className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">2</p>
              <p className="text-sm text-[var(--muted-foreground)]">Active Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <MessageSquare className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">1</p>
              <p className="text-sm text-[var(--muted-foreground)]">Unread Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <Clock className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">2h ago</p>
              <p className="text-sm text-[var(--muted-foreground)]">Last Activity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Your Projects</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {mockProjects.map((project) => {
            const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
            return (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <CardDescription>
                        <TrackingId id={project.trackingId} />
                      </CardDescription>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={project.progress} />
                  <div className="mt-2 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                    <span>{project.milestones} milestones</span>
                    <span>{project.lastUpdate}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Activity</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {mockActivity.map((item) => (
                  <li key={item.id} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                    <p className="text-sm text-[var(--foreground)]">{item.message}</p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {item.project} &middot; {item.time}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
