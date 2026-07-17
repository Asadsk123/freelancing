import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { hasDatabase } from "@/db";
import { serviceRepository } from "@/lib/repositories/service";
import { Card, CardContent } from "@/components/ui/card";
import { brand } from "@/config/brand";
import { Mail, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Royal Asad — we'd love to hear about your project.",
};

export default async function ContactPage() {
  const services = hasDatabase() ? await serviceRepository.findActive() : [];

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Contact Us"
        description="Have a project in mind? Let's talk about how we can help."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm services={services.map((s) => ({ slug: s.slug, name: s.name }))} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-[var(--primary)]" />
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Email us directly</h3>
                  <a
                    href={`mailto:${brand.contact.email}`}
                    className="mt-1 block text-sm text-[var(--primary)] hover:underline"
                  >
                    {brand.contact.email}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-[var(--primary)]" />
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Hours &amp; response time</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {brand.contact.hours}. We respond to all inquiries within 24 business hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-[var(--primary)]" />
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Phone / WhatsApp</h3>
                  <a
                    href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
                    className="mt-1 block text-sm text-[var(--primary)] hover:underline"
                  >
                    {brand.contact.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-[var(--primary)]" />
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Office</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {brand.contact.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[var(--primary)]" />
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Confidentiality</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    NDA-friendly. Your idea and project details stay private — always.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
