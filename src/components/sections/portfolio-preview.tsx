import Link from "next/link";
import { ArrowRight, Globe, Building2, Utensils, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";

function categoryIcon(title: string) {
  if (/realty|real estate|properties|land/i.test(title)) return Building2;
  if (/food|cafe|bakery|pizza|taco|burrito|ice cream|brewery|food truck/i.test(title)) return Utensils;
  if (/junk|handyman|auto|weld|woodwork/i.test(title)) return Wrench;
  return Globe;
}

export async function PortfolioPreview() {
  const projects = hasDatabase() ? await projectRepository.findCompleted() : [];
  if (projects.length === 0) return null;

  const preview = projects.slice(0, 6);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Recent Work
            </h2>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Demo websites built for real small businesses across the USA.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/portfolio">
              View All {projects.length} Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((project) => {
            const Icon = categoryIcon(project.title);
            const isBooking = /booking demo/i.test(project.title);
            return (
              <div
                key={project.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50 shrink-0">
                    <Icon className="h-4 w-4 text-violet-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {isBooking ? "Booking Demo" : "Business Website"}
                  </Badge>
                </div>
                <h3 className="font-medium text-[var(--foreground)] text-sm">{project.title}</h3>
                {project.description && (
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)] line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
