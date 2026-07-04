import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/sections/cta-banner";
import {
  Globe,
  Palette,
  BarChart3,
  Search,
  Smartphone,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our digital services — web development, design, marketing, and more.",
};

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technology.",
    details: [
      "Responsive, mobile-first design",
      "Content management systems",
      "E-commerce platforms",
      "Custom web applications",
      "API development and integration",
    ],
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Visual identity and marketing materials that tell your brand's story.",
    details: [
      "Logo and brand identity",
      "Marketing collateral",
      "Social media graphics",
      "Packaging design",
      "Presentation design",
    ],
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description: "Data-driven strategies to reach and convert your target audience.",
    details: [
      "Social media management",
      "Email marketing campaigns",
      "Pay-per-click advertising",
      "Content marketing strategy",
      "Analytics and reporting",
    ],
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Improve your search rankings and organic visibility.",
    details: [
      "Technical SEO audits",
      "Keyword research and strategy",
      "On-page optimization",
      "Link building",
      "Performance monitoring",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Cross-platform mobile applications for iOS and Android.",
    details: [
      "Native and hybrid development",
      "UI/UX design for mobile",
      "App store optimization",
      "Push notifications",
      "Offline functionality",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & Support",
    description: "Keep your digital assets secure, updated, and running smoothly.",
    details: [
      "Security updates and patches",
      "Performance optimization",
      "Uptime monitoring",
      "Content updates",
      "Technical support",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="Our Services"
          description="End-to-end digital services designed around your business goals. Each engagement is tailored to your needs — no templates, no shortcuts."
        />

        <div className="mt-12 space-y-8">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                    <service.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
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
