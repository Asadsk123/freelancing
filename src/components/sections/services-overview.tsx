import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Bot } from "lucide-react";

const serviceHighlights = [
  {
    icon: Globe,
    title: "Web Design & Development",
    description: "Premium business websites and custom web applications — built with Next.js, designed for performance, accessibility, and production-grade security.",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description: "AI-powered workflows, intelligent agents, and process automation that reduce manual work and scale your operations — custom-built for your business.",
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
            Focused, high-impact digital services for businesses that want results.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
