import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Layers } from "lucide-react";
import { hasDatabase } from "@/db";
import { serviceRepository } from "@/lib/repositories/service";

export const metadata: Metadata = {
  title: "Manage Services",
  description: "View and manage service offerings.",
};

export default async function AdminServicesPage() {
  const dbAvailable = hasDatabase();
  const services = dbAvailable ? await serviceRepository.findAll() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Services" description="Manage your service offerings." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to manage services.
          </p>
        </div>
      )}

      {dbAvailable && services.length === 0 && (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={Layers}
                title="No services yet"
                description="Services will appear here once created."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {services.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                    <Layers className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <Badge variant={service.isActive ? "success" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardTitle className="text-base">{service.name}</CardTitle>
                <CardDescription>{service.categoryName}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">{service.shortDescription}</p>
                {service.features && (service.features as string[]).length > 0 && (
                  <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                    {(service.features as string[]).length} {(service.features as string[]).length === 1 ? "feature" : "features"} listed
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
