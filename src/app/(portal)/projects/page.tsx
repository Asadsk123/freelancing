import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrackingId } from "@/components/shared/tracking-id";

export const metadata: Metadata = {
  title: "Projects",
  description: "View and manage your projects.",
};

const mockProjects = [
  {
    id: "1",
    trackingId: "RA-2026-000034",
    title: "Brand Identity Design",
    service: "Graphic Design",
    status: "in_progress" as const,
    progress: 60,
    milestones: { completed: 3, total: 5 },
    startDate: "May 15, 2026",
    targetDate: "Aug 15, 2026",
  },
  {
    id: "2",
    trackingId: "RA-2026-000035",
    title: "E-commerce Website",
    service: "Web Development",
    status: "pending" as const,
    progress: 0,
    milestones: { completed: 0, total: 4 },
    startDate: "Jun 1, 2026",
    targetDate: "Nov 1, 2026",
  },
  {
    id: "3",
    trackingId: "RA-2025-000012",
    title: "Company Website Redesign",
    service: "Web Development",
    status: "completed" as const,
    progress: 100,
    milestones: { completed: 6, total: 6 },
    startDate: "Jan 10, 2025",
    targetDate: "Apr 10, 2025",
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Projects" description="All your projects in one place." />

      <div className="mt-8 space-y-4">
        {mockProjects.map((project) => {
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
                        <span className="text-[var(--muted-foreground)]">&middot;</span>
                        <span>{project.service}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={project.progress} />
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--muted-foreground)]">
                    <span>
                      {project.milestones.completed} of {project.milestones.total} milestones
                    </span>
                    <span>Started {project.startDate}</span>
                    <span>Target {project.targetDate}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
