import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { CtaBanner } from "@/components/sections/cta-banner";
import { hasDatabase } from "@/db";
import { projectRepository } from "@/lib/repositories/project";
import Link from "next/link";
import { ArrowRight, Globe, Building2, Utensils, Wrench, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Portfolio — Our Work | ROYAL-ASAD",
  description:
    "See the business websites, booking demos, and digital solutions we have built. Real demo projects built for US small businesses.",
};

function categoryIcon(title: string) {
  if (/realty|real estate|properties|land/i.test(title)) return Building2;
  if (/food|cafe|bakery|pizza|taco|burrito|ice cream|brewery|food truck/i.test(title)) return Utensils;
  if (/junk|handyman|auto|weld|woodwork/i.test(title)) return Wrench;
  if (/shop|leatherwork|upholstery/i.test(title)) return ShoppingBag;
  return Globe;
}

function projectType(title: string): string {
  if (/booking demo/i.test(title)) return "Booking Demo";
  return "Business Website";
}

export default async function PortfolioPage() {
  const dbAvailable = hasDatabase();
  const completedProjects = dbAvailable ? await projectRepository.findCompleted() : [];

  // Deduplicate by title on the render side as safety net
  const seen = new Set<string>();
  const projects = completedProjects.filter((p) => {
    if (seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Portfolio"
          description={`${projects.length} demo projects — real business websites built as free portfolio pieces for US small businesses. Every one is a real site concept with full functionality.`}
        />

        {projects.length === 0 ? (
          <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--background)] p-16 text-center text-[var(--muted-foreground)]">
            Portfolio is being updated. Check back soon.
          </div>
        ) : (
          <>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const Icon = categoryIcon(project.title);
                const type = projectType(project.title);
                return (
                  <div
                    key={project.id}
                    className="group rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50 shrink-0">
                        <Icon className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        <Badge variant="secondary" className="text-xs">Demo Project</Badge>
                        <Badge variant="outline" className="text-xs">{type}</Badge>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="font-semibold text-[var(--foreground)] leading-tight">
                      {project.title}
                    </h2>

                    {/* Description */}
                    {project.description && (
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
                        {project.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between">
                      {project.serviceName && (
                        <span className="text-xs text-[var(--muted-foreground)]">{project.serviceName}</span>
                      )}
                      <span className="text-xs text-violet-600 font-medium ml-auto">
                        Free demo ✓
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Portfolio note */}
            <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                All projects above are free demo builds. Client projects are under NDA and shown on request.
              </p>
              <Button asChild className="mt-4">
                <Link href="/contact?form=quote">
                  Start Your Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      <CtaBanner />
    </>
  );
}
