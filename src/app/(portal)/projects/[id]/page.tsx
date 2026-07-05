import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrackingId } from "@/components/shared/tracking-id";
import { EmptyState } from "@/components/shared/empty-state";
import { ArrowLeft, FileText, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Project Details",
  description: "View project details, files, and conversation.",
};

const mockProject = {
  id: "1",
  trackingId: "RA-2026-000034",
  title: "Brand Identity Design",
  service: "Graphic Design",
  status: "in_progress",
  progress: 60,
  description: "Complete brand identity package including logo, color palette, typography, and brand guidelines document.",
  startDate: "May 15, 2026",
  targetDate: "Aug 15, 2026",
  milestones: [
    { id: "1", title: "Discovery & Research", status: "completed" },
    { id: "2", title: "Concept Development", status: "completed" },
    { id: "3", title: "Logo Design", status: "completed" },
    { id: "4", title: "Brand Collateral", status: "in_progress" },
    { id: "5", title: "Final Delivery", status: "upcoming" },
  ],
};

const milestoneStatusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" }> = {
  completed: { label: "Completed", variant: "success" },
  in_progress: { label: "In Progress", variant: "warning" },
  upcoming: { label: "Upcoming", variant: "secondary" },
};

export default function ProjectDetailPage() {
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

      <PageHeader title={mockProject.title}>
        <Badge variant="warning">In Progress</Badge>
      </PageHeader>

      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
        <TrackingId id={mockProject.trackingId} />
        <span>{mockProject.service}</span>
        <span>Started {mockProject.startDate}</span>
        <span>Target {mockProject.targetDate}</span>
      </div>

      <div className="mt-6">
        <Progress value={mockProject.progress} />
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {mockProject.progress}% complete
        </p>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="milestones">
          <TabsList>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
          </TabsList>

          <TabsContent value="milestones" className="mt-4">
            <div className="space-y-3">
              {mockProject.milestones.map((milestone) => {
                const badge = milestoneStatusBadge[milestone.status] ?? { label: "Upcoming", variant: "secondary" as const };
                return (
                  <Card key={milestone.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <span className="text-sm font-medium text-[var(--foreground)]">
                        {milestone.title}
                      </span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={FileText}
                  title="No files yet"
                  description="Files shared by the team will appear here. You can preview watermarked versions and request revisions."
                />
              </CardContent>
            </Card>
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
