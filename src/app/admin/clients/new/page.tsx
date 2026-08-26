import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { hasDatabase } from "@/db";
import { ClientForm } from "./client-form";

export const metadata: Metadata = {
  title: "New Client",
  description: "Create a new client account.",
};

export default function NewClientPage() {
  const dbAvailable = hasDatabase();
  return (
    <div className="mx-auto max-w-[1280px]">
      <Link
        href="/admin/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>
      <PageHeader
        title="New Client"
        description="Create a client account so you can assign projects to them."
      />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">Database not connected — clients cannot be created.</p>
        </div>
      )}

      <div className="mt-8">
        <ClientForm />
      </div>
    </div>
  );
}
