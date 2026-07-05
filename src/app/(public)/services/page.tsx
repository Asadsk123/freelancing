import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Layers, ArrowRight } from "lucide-react";
import { hasDatabase } from "@/db";
import { serviceRepository } from "@/lib/repositories/service";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our digital services — web development, design, marketing, and more.",
};

export default async function ServicesPage() {
  const dbAvailable = hasDatabase();
  const services = dbAvailable ? await serviceRepository.findActive() : [];

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Services"
          description="End-to-end digital services designed around your business goals. Each engagement is tailored to your needs — no templates, no shortcuts."
        />

        <div className="mt-12 space-y-8">
          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={Layers}
                  title="Coming soon"
                  description="Our service offerings are being finalized. Contact us to discuss your project."
                />
              </CardContent>
            </Card>
          ) : (
            services.map((service) => {
              const features = (service.features as string[] | null) ?? [];
              return (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                        <Layers className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>{service.shortDescription}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {features.length > 0 && (
                    <CardContent>
                      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[var(--muted-foreground)]">
            Don&apos;t see what you need? We build custom solutions too.
          </p>
          <Button asChild className="mt-4">
            <Link href="/contact">
              Discuss Your Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
