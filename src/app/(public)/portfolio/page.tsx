import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CtaBanner } from "@/components/sections/cta-banner";
import { FolderOpen } from "lucide-react";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "See our latest work and client success stories.",
};

export default async function PortfolioPage() {
  const dbAvailable = hasDatabase();
  const completedProjects = dbAvailable
    ? await projectRepository.findCompleted()
    : [];

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="Portfolio"
          description="A selection of our recent projects and client success stories."
        />

        {completedProjects.length === 0 ? (
          <div className="mt-12">
            <Card>
              <CardContent className="py-16">
                <EmptyState
                  icon={FolderOpen}
                  title="Portfolio coming soon"
                  description="We're putting the finishing touches on our project showcase. Check back soon to see our latest work."
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map((project) => (
              <Card key={project.id}>
                <CardContent className="py-6">
                  {project.serviceName && (
                    <Badge variant="secondary" className="mb-3">{project.serviceName}</Badge>
                  )}
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    {project.title}
                  </h2>
                  {project.description && (
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] line-clamp-3">
                      {project.description}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-[var(--muted-foreground)]">
                    {project.completedDate
                      ? `Completed ${formatDate(project.completedDate)}`
                      : `Delivered ${formatDate(project.updatedAt)}`}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CtaBanner />
    </>
  );
}
