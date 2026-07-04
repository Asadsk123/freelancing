import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Palette, BarChart3, Search, Smartphone, ShieldCheck } from "lucide-react";

const serviceHighlights = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technology for speed, security, and scalability.",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    description: "Brand identity, marketing materials, and visual design that communicates your brand's story.",
  },
  {
    icon: BarChart3,
    title: "Digital Marketing",
    description: "Data-driven strategies to reach your audience, grow your traffic, and convert visitors into customers.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Improve your search rankings and organic visibility with technical and content-driven SEO.",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description: "Cross-platform mobile applications that deliver a seamless experience on every device.",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & Support",
    description: "Ongoing updates, security patches, and technical support to keep your digital assets running.",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            What We Do
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            End-to-end digital services designed around your business goals.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceHighlights.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                  <service.icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
