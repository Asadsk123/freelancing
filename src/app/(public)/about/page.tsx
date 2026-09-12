import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Button } from "@/components/ui/button";
import { Target, Users, Zap, Globe, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ROYAL-ASAD AI & Digital Solutions — a remote-first digital agency building websites, AI automation, and business systems for clients worldwide.",
};

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "We don't build for the sake of building. Every decision is measured by impact on your business — leads, time saved, revenue generated.",
  },
  {
    icon: Users,
    title: "Client-First",
    description:
      "Your convenience matters more than our process. Clear communication, on-time delivery, and full visibility into every project.",
  },
  {
    icon: Zap,
    title: "Quality Without Compromise",
    description:
      "Modern tech stacks, strict standards, production-grade code. No shortcuts on security, performance, or accessibility.",
  },
  {
    icon: Globe,
    title: "Remote-First, Worldwide",
    description:
      "We work with clients across the USA, UK, UAE, Canada, and beyond. Location never limits what we can build for you.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent & Honest",
    description:
      "We quote fairly, deliver what we promise, and tell you when something isn't possible. No false promises, no inflated claims.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "We set realistic timelines and stick to them. Milestone-based delivery means you always know what's done and what's next.",
  },
];

const stack = [
  "Next.js 15", "React 19", "TypeScript", "Tailwind CSS 4",
  "PostgreSQL", "Drizzle ORM", "Node.js", "OpenAI API",
  "WhatsApp Business API", "Vercel", "Resend", "Stripe",
];

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
        <PageHeader
          title="About ROYAL-ASAD"
          description="We build the websites, tools, and automation systems that help real businesses grow."
        />

        {/* Mission */}
        <div className="mt-12 mx-auto max-w-3xl space-y-5 text-[var(--muted-foreground)] text-lg leading-relaxed">
          <p>
            ROYAL-ASAD AI &amp; Digital Solutions is a remote-first digital agency. We
            partner with businesses across the USA, UK, UAE, Canada, Pakistan, and worldwide
            to build professional websites, AI automation workflows, and custom business tools.
          </p>
          <p>
            We started because most agencies either charge too much, deliver too little, or make
            the process unnecessarily complicated. We do the opposite — clear pricing, honest
            timelines, and a simple client portal that keeps you updated without the email chaos.
          </p>
          <p>
            Our specialty is building things that actually work in production — not demos that
            look good in a pitch deck but break in real use. We use modern technology, write
            clean code, and make sure every project is maintainable long after launch.
          </p>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            What We Stand For
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50">
                  <value.icon className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="font-semibold text-[var(--foreground)]">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Technologies We Use
          </h2>
          <p className="mt-3 text-center text-[var(--muted-foreground)]">
            Production-grade tools — no experimental frameworks, no vendor lock-in.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-10 text-center">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Ready to work together?</h2>
          <p className="mt-3 text-[var(--muted-foreground)] max-w-lg mx-auto">
            Tell us about your project. We&apos;ll get back to you within 24 hours with a clear plan and honest pricing.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact?form=quote">
                Get a Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </div>

      <CtaBanner />
    </>
  );
}
