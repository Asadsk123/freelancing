import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TrackingId } from "@/components/shared/tracking-id";
import { FolderOpen } from "lucide-react";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Manage Projects",
  description: "View and manage all client projects.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" | "error" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
  cancelled: { label: "Cancelled", variant: "error" },
};

export default async function AdminProjectsPage() {
  const dbAvailable = hasDatabase();
  const projects = dbAvailable ? await projectRepository.findAll() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Projects" description="Manage all client projects." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to manage projects.
          </p>
        </div>
      )}

      {dbAvailable && projects.length === 0 && (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={FolderOpen}
                title="No projects yet"
                description="Projects will appear here once created."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mt-8">
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Project</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Started</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Target</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">Manage</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
                  return (
                    <tr key={project.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--foreground)]">{project.title}</p>
                        <TrackingId id={project.trackingId} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[var(--foreground)]">{project.clientName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{project.clientEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                        {project.startDate ? formatDate(project.startDate) : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                        {project.targetDate ? formatDate(project.targetDate) : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="text-sm font-medium text-[var(--primary)] hover:underline"
                        >
                          Milestones
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
