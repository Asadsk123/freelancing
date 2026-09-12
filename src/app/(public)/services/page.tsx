import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ArrowRight, CheckCircle2, Globe, Bot, ShoppingCart, Smartphone, Zap, LayoutDashboard } from "lucide-react";
import { hasDatabase } from "@/db";
import { serviceRepository } from "@/lib/repositories/service";

export const metadata: Metadata = {
  title: "Our Services | ROYAL-ASAD AI & Digital Solutions",
  description:
    "Professional websites, AI automation, e-commerce stores, WhatsApp automation and web applications. Custom digital solutions for businesses worldwide.",
};

const iconMap: Record<string, React.ElementType> = {
  "business-website": Globe,
  "ai-automation": Bot,
  "e-commerce-store": ShoppingCart,
  "landing-page": Smartphone,
  "whatsapp-automation": Zap,
  "web-application": LayoutDashboard,
};

export default async function ServicesPage() {
  const services = hasDatabase() ? await serviceRepository.findActive() : [];

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Services"
          description="Custom digital solutions built for your business goals — not off-the-shelf templates."
        />

        {services.length === 0 ? (
          <div className="mt-12 rounded-xl border border-[var(--border)] p-12 text-center text-[var(--muted-foreground)]">
            Services are being updated. Contact us to discuss your project.
          </div>
        ) : (
          <div className="mt-12 space-y-6">
            {services.map((service) => {
              const Icon = iconMap[service.slug] ?? Globe;
              const features = (service.features as string[] | null) ?? [];
              return (
                <div key={service.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/50">
                      <Icon className="h-6 w-6 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">{service.name}</h2>
                        <Badge variant="outline" className="text-xs">{service.categoryName}</Badge>
                      </div>
                      <p className="text-[var(--muted-foreground)]">{service.shortDescription}</p>
                      {features.length > 0 && (
                        <ul className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
                          {features.slice(0, 8).map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-violet-600" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-5">
                        <Button asChild size="sm">
                          <Link href={`/services/${service.slug}`}>
                            Learn More
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-8 text-center">
          <p className="font-medium text-[var(--foreground)]">Don&apos;t see exactly what you need?</p>
          <p className="mt-1 text-[var(--muted-foreground)]">
            We build custom solutions. Tell us your problem and we&apos;ll figure out the right approach.
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
