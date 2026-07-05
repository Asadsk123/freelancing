import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrackingId } from "@/components/shared/tracking-id";

export const metadata: Metadata = {
  title: "Manage Projects",
  description: "View and manage all client projects.",
};

const mockProjects = [
  {
    id: "1",
    trackingId: "RA-2026-000034",
    title: "Brand Identity Design",
    client: "Acme Corp",
    status: "in_progress",
    progress: 60,
    milestones: { completed: 3, total: 5 },
    startDate: "May 15, 2026",
  },
  {
    id: "2",
    trackingId: "RA-2026-000035",
    title: "E-commerce Website",
    client: "TechStart Inc",
    status: "pending",
    progress: 0,
    milestones: { completed: 0, total: 4 },
    startDate: "Jun 1, 2026",
  },
  {
    id: "3",
    trackingId: "RA-2026-000036",
    title: "Marketing Campaign",
    client: "Global Retail",
    status: "in_progress",
    progress: 35,
    milestones: { completed: 2, total: 6 },
    startDate: "Apr 20, 2026",
  },
  {
    id: "4",
    trackingId: "RA-2025-000012",
    title: "Company Website Redesign",
    client: "FinTech Solutions",
    status: "completed",
    progress: 100,
    milestones: { completed: 6, total: 6 },
    startDate: "Jan 10, 2025",
  },
  {
    id: "5",
    trackingId: "RA-2026-000037",
    title: "Mobile App UI Design",
    client: "HealthFirst",
    status: "on_hold",
    progress: 20,
    milestones: { completed: 1, total: 5 },
    startDate: "Mar 5, 2026",
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
  cancelled: { label: "Cancelled", variant: "default" },
};

export default function AdminProjectsPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Projects" description="Manage all client projects." />

      <div className="mt-8">
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Project</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Client</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Progress</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Started</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map((project) => {
                const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
                return (
                  <tr key={project.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--foreground)]">{project.title}</p>
                      <TrackingId id={project.trackingId} />
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{project.client}</td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="w-20" />
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {project.milestones.completed}/{project.milestones.total}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{project.startDate}</td>
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
