import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { serviceRepository } from "@/lib/repositories/service";
import { ProjectForm } from "./project-form";

export const metadata: Metadata = {
  title: "New Project",
  description: "Create a new client project.",
};

export default async function NewProjectPage() {
  const dbAvailable = hasDatabase();
  const [clients, services] = dbAvailable
    ? await Promise.all([userRepository.findAllClients(), serviceRepository.findAll()])
    : [[], []];

  return (
    <div className="mx-auto max-w-[1280px]">
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>
      <PageHeader title="New Project" description="Create a project for a client. Completed projects appear on the public portfolio." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">Database not connected — projects cannot be created.</p>
        </div>
      )}

      <div className="mt-8">
        <ProjectForm
          clients={clients.map((c) => ({ id: c.id, name: `${c.name} (${c.email})` }))}
          services={services.map((s) => ({ id: s.id, name: s.name }))}
        />
      </div>
    </div>
  );
}
