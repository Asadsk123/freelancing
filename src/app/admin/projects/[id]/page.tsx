import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackingId } from "@/components/shared/tracking-id";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { formatDate } from "@/lib/utils/formatting";
import { MilestonesManager } from "./milestones-manager";

export const metadata: Metadata = {
  title: "Project Details",
  description: "Manage project milestones and details.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" | "error" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
  cancelled: { label: "Cancelled", variant: "error" },
};

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!hasDatabase()) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={FolderOpen}
              title="Database not connected"
              description="Set DATABASE_URL to manage project milestones."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = await projectRepository.findByIdWithDetails(id);
  if (!project) notFound();

  const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
      </div>

      <PageHeader title={project.title}>
        <Badge variant={badge.variant}>{badge.label}</Badge>
      </PageHeader>

      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
        <TrackingId id={project.trackingId} />
        <span>{project.clientName} &middot; {project.clientEmail}</span>
        {project.startDate && <span>Started {formatDate(project.startDate)}</span>}
        {project.targetDate && <span>Target {formatDate(project.targetDate)}</span>}
      </div>

      {project.description && (
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">{project.description}</p>
      )}

      <div className="mt-8">
        <MilestonesManager projectId={project.id} milestones={project.milestones} />
      </div>
    </div>
  );
}
