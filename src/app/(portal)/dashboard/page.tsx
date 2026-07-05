import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { TrackingId } from "@/components/shared/tracking-id";
import { FolderOpen, Clock, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { formatRelativeTime } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your project dashboard.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbAvailable = hasDatabase();

  const projects = dbAvailable
    ? await projectRepository.findByClientId(session.userId)
    : [];

  const activeCount = projects.filter(
    (p) => p.status === "in_progress" || p.status === "pending" || p.status === "on_hold",
  ).length;

  const lastActivity = projects.length > 0
    ? formatRelativeTime(projects[0]!.updatedAt)
    : "—";

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Dashboard" description={`Welcome back, ${session.name}. Here's an overview of your projects.`} />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <FolderOpen className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{activeCount}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Active Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <FolderOpen className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{projects.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total Projects</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <Clock className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{lastActivity}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Last Activity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Your Projects</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          {recentProjects.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={FolderOpen}
                  title={dbAvailable ? "No projects yet" : "Database not connected"}
                  description={dbAvailable ? "Your projects will appear here once they are created." : "Set DATABASE_URL to see real data."}
                />
              </CardContent>
            </Card>
          ) : (
            recentProjects.map((project) => {
              const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
              return (
                <Link key={project.id} href={`/projects/${project.id}`} className="block">
                  <Card className="transition-shadow hover:shadow-md">
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
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Updated {formatRelativeTime(project.updatedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
