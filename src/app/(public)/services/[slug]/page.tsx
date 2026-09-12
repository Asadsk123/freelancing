import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hasDatabase } from "@/db";
import { serviceRepository } from "@/lib/repositories/service";
import { brand } from "@/config/brand";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = hasDatabase() ? await serviceRepository.findBySlug(slug) : undefined;
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} | ROYAL-ASAD`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = hasDatabase() ? await serviceRepository.findBySlug(slug) : undefined;
  if (!service) notFound();

  const features = (service.features as string[] | null) ?? [];
  const phone = brand.contact.phone.replace(/[\s+]/g, "");
  const waMsg = encodeURIComponent(`Hi! I'd like to learn more about your ${service.name} service.`);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Badge variant="secondary" className="mb-4">{service.categoryName}</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {service.name}
          </h1>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            {service.shortDescription}
          </p>

          {service.fullDescription && service.fullDescription !== service.shortDescription && (
            <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
              {service.fullDescription}
            </p>
          )}

          {features.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-5">
                What&apos;s Included
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Process */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-5">How It Works</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Discovery Call", desc: "We discuss your business goals, requirements, and timeline. Free and no-obligation." },
                { step: "2", title: "Proposal & Quote", desc: "You receive a clear scope of work, timeline, and fixed price — no surprises." },
                { step: "3", title: "Build & Review", desc: "We build in milestones and share progress. You review and request changes." },
                { step: "4", title: "Launch & Support", desc: "We deploy, test, and train you. Post-launch support is included." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                  <span className="text-2xl font-black text-[var(--border)] shrink-0 w-8">{s.step}</span>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{s.title}</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar CTA */}
        <div className="space-y-4">
          <div className="sticky top-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
            <h3 className="font-semibold text-[var(--foreground)] text-lg">Get a Free Quote</h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Tell us about your project. We reply within 24 hours — no commitment required.
            </p>
            <Button asChild className="w-full mt-5">
              <Link href={`/contact?form=quote&service=${service.slug}`}>
                Request a Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <a
              href={`https://wa.me/${phone}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />
              Chat on WhatsApp
            </a>
            <div className="mt-5 border-t border-[var(--border)] pt-5 space-y-2 text-xs text-[var(--muted-foreground)]">
              <p>✓ Fixed price, no hidden fees</p>
              <p>✓ Free revision rounds included</p>
              <p>✓ NDA-friendly engagement</p>
              <p>✓ Response within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
