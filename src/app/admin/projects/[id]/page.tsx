import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrackingId } from "@/components/shared/tracking-id";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, FolderOpen, MessageSquare, Link2, ExternalLink } from "lucide-react";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { fileRepository } from "@/lib/repositories/file";
import { conversationRepository } from "@/lib/repositories/conversation";
import { linkRepository } from "@/lib/repositories/link";
import { formatDate, formatRelativeTime } from "@/lib/utils/formatting";
import { MilestonesManager } from "./milestones-manager";
import { FilesManager } from "./files-manager";
import { AdminMessageForm } from "./admin-message-form";

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

  const [projectFiles, messages, projectLinks] = await Promise.all([
    fileRepository.findByProjectId(id),
    conversationRepository.findMessagesByProjectId(id),
    linkRepository.findByProjectId(id),
  ]);

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

      <div className="mt-8">
        <FilesManager
          projectId={project.id}
          files={projectFiles.map((file) => ({
            id: file.id,
            fileName: file.fileName,
            fileSize: file.fileSize,
            version: file.version,
            status: file.status,
            revisionNote: file.revisionNote,
            uploaderName: file.uploaderName,
            createdAt: file.createdAt,
          }))}
        />
      </div>

      {/* Client-submitted links */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Client Links &amp; References{projectLinks.length > 0 ? ` (${projectLinks.length})` : ""}
        </h2>
        {projectLinks.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <EmptyState icon={Link2} title="No links yet" description="Links and references submitted by the client will appear here." />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {projectLinks.map((link) => (
              <Card key={link.id}>
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[var(--foreground)]">{link.label}</span>
                        <Badge variant="secondary">{link.linkType}</Badge>
                        <span className="text-xs text-[var(--muted-foreground)]">by {link.submitterName}</span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-xs text-[var(--primary)] hover:underline break-all"
                      >
                        {link.url} <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                      {link.note && (
                        <p className="mt-2 text-xs text-[var(--muted-foreground)] whitespace-pre-wrap">{link.note}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-[var(--muted-foreground)]">{formatDate(link.createdAt)}</span>
                  </div>

                  {/* Safe image preview */}
                  {link.linkType === "image" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={link.url}
                      alt={link.label}
                      className="mt-2 max-h-48 max-w-full rounded-[var(--radius-md)] object-contain border border-[var(--border)]"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}

                  {/* Safe YouTube/Vimeo embed */}
                  {link.linkType === "video" && (() => {
                    const yt = link.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
                    const vm = link.url.match(/vimeo\.com\/(\d+)/);
                    if (yt) {
                      return (
                        <div className="aspect-video w-full max-w-md overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${yt[1]}`}
                            className="h-full w-full"
                            allow="encrypted-media"
                            allowFullScreen
                            title={link.label}
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                          />
                        </div>
                      );
                    }
                    if (vm) {
                      return (
                        <div className="aspect-video w-full max-w-md overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)]">
                          <iframe
                            src={`https://player.vimeo.com/video/${vm[1]}`}
                            className="h-full w-full"
                            allow="encrypted-media"
                            allowFullScreen
                            title={link.label}
                            sandbox="allow-scripts allow-same-origin allow-presentation"
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Conversation{messages.length > 0 ? ` (${messages.length})` : ""}
        </h2>
        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <EmptyState icon={MessageSquare} title="No messages yet" description="Messages between you and the client appear here." />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <Card key={message.id} className={message.senderRole === "admin" ? "border-[var(--primary)]/30" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--foreground)]">{message.senderName}</span>
                      <Badge variant={message.senderRole === "admin" ? "secondary" : "default"}>
                        {message.senderRole === "admin" ? "Team" : "Client"}
                      </Badge>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(message.createdAt)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted-foreground)]">{message.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardContent className="py-5">
            <AdminMessageForm projectId={project.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
