import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Bot, ShoppingCart, Smartphone, Zap, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const services = [
  {
    icon: Globe,
    title: "Business Website",
    description: "Professional, fast-loading websites built with Next.js. Mobile-first, SEO-ready, with contact forms and WhatsApp integration.",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description: "Custom AI workflows that eliminate repetitive manual work — lead capture, email automation, chatbots, and document processing.",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-950/50",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Store",
    description: "Full online stores with product catalog, payment gateway, order management, and inventory tracking.",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    icon: Zap,
    title: "WhatsApp Automation",
    description: "Automated WhatsApp flows for lead follow-up, appointment reminders, support replies, and broadcast campaigns.",
    color: "text-green-600 bg-green-50 dark:bg-green-950/50",
  },
  {
    icon: LayoutDashboard,
    title: "Web Application",
    description: "Custom dashboards, client portals, CRMs, and internal business tools built to your exact requirements.",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-950/50",
  },
  {
    icon: Smartphone,
    title: "Landing Page",
    description: "High-converting campaign pages with lead forms and clear CTAs. Delivered in 3–5 business days.",
    color: "text-pink-600 bg-pink-50 dark:bg-pink-950/50",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-20 bg-[var(--muted)]/30">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            What We Build
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            From a simple business website to a full AI automation system — we build exactly what your business needs.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", service.color)}>
                <service.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/services">
              View All Services & Pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
