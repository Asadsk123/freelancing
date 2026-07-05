import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TrackingId } from "@/components/shared/tracking-id";
import { FolderOpen } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Projects",
  description: "View and manage your projects.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
};

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbAvailable = hasDatabase();
  const projects = dbAvailable
    ? await projectRepository.findByClientId(session.userId)
    : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Projects" description="All your projects in one place." />

      <div className="mt-8 space-y-4">
        {projects.length === 0 ? (
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
          projects.map((project) => {
            const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className="block">
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{project.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <TrackingId id={project.trackingId} />
                        </CardDescription>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--muted-foreground)]">
                      {project.startDate && <span>Started {formatDate(project.startDate)}</span>}
                      {project.targetDate && <span>Target {formatDate(project.targetDate)}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
