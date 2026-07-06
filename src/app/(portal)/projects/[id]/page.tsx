import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrackingId } from "@/components/shared/tracking-id";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, FileText, MessageSquare, FolderOpen } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { fileRepository } from "@/lib/repositories/file";
import { formatDate, formatFileSize } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Project Details",
  description: "View project details, files, and conversation.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  pending: { label: "Pending", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  on_hold: { label: "On Hold", variant: "default" },
  cancelled: { label: "Cancelled", variant: "default" },
};

const milestoneStatusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  completed: { label: "Completed", variant: "success" },
  in_progress: { label: "In Progress", variant: "warning" },
  upcoming: { label: "Upcoming", variant: "secondary" },
};

const fileStatusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  draft: { label: "Draft", variant: "secondary" },
  preview: { label: "Preview", variant: "default" },
  revision_requested: { label: "Revision Requested", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  final: { label: "Final", variant: "success" },
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  if (!hasDatabase()) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={FolderOpen}
              title="Database not connected"
              description="Set DATABASE_URL to view project details."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const project = await projectRepository.findByIdWithDetails(id);
  if (!project) notFound();

  if (session.role === "client" && project.clientId !== session.userId) {
    notFound();
  }

  const projectFiles = await fileRepository.findByProjectId(id);

  const badge = statusBadge[project.status] ?? { label: "Pending", variant: "secondary" as const };
  const completedMilestones = project.milestones.filter((m) => m.status === "completed").length;
  const totalMilestones = project.milestones.length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects">
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
        {project.startDate && <span>Started {formatDate(project.startDate)}</span>}
        {project.targetDate && <span>Target {formatDate(project.targetDate)}</span>}
      </div>

      {project.description && (
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">{project.description}</p>
      )}

      <div className="mt-8">
        <Tabs defaultValue="milestones">
          <TabsList>
            <TabsTrigger value="milestones">
              Milestones{totalMilestones > 0 ? ` (${completedMilestones}/${totalMilestones})` : ""}
            </TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="mt-4">
            {project.milestones.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <EmptyState
                    icon={FolderOpen}
                    title="No milestones yet"
                    description="Milestones will appear here once added to the project."
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((milestone) => {
                  const mBadge = milestoneStatusBadge[milestone.status] ?? { label: "Upcoming", variant: "secondary" as const };
                  return (
                    <Card key={milestone.id}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {milestone.title}
                          </span>
                          {milestone.dueDate && (
                            <p className="text-xs text-[var(--muted-foreground)]">
                              Due {formatDate(milestone.dueDate)}
                            </p>
                          )}
                        </div>
                        <Badge variant={mBadge.variant}>{mBadge.label}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            {projectFiles.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <EmptyState
                    icon={FileText}
                    title="No files yet"
                    description="Files shared by the team will appear here. You can preview watermarked versions and request revisions."
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {projectFiles.map((file) => {
                  const fBadge = fileStatusBadge[file.status] ?? { label: "Draft", variant: "secondary" as const };
                  return (
                    <Card key={file.id}>
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]">
                            <FileText className="h-4 w-4 text-[var(--primary)]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[var(--foreground)] truncate">
                              {file.fileName}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {formatFileSize(file.fileSize)} · v{file.version} · {file.uploaderName} · {formatDate(file.createdAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={fBadge.variant} className="shrink-0 ml-2">{fBadge.label}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="conversation" className="mt-4">
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={MessageSquare}
                  title="Start a conversation"
                  description="All messages for this project live in one thread. Ask questions, share feedback, or request updates."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
