import { ShieldCheck, GitBranch, MessageSquare, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Enterprise trust section. Capability statements only — no fabricated
 * statistics, client counts, or awards (project rule: real data only).
 */
const points = [
  {
    icon: ShieldCheck,
    title: "Enterprise-grade process",
    description:
      "NDA-friendly engagements, secure passwordless access, and audit-logged changes on every project.",
  },
  {
    icon: GitBranch,
    title: "Milestone-based delivery",
    description:
      "Work is broken into visible milestones with clear statuses — you always know what's done and what's next.",
  },
  {
    icon: MessageSquare,
    title: "One thread, zero chaos",
    description:
      "A dedicated client portal keeps every file, conversation, and revision request in one place.",
  },
  {
    icon: Layers,
    title: "Built to be maintained",
    description:
      "Modern stacks, strict typing, and accessibility baked in — your platform stays fast and extendable.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          Built for teams that can&apos;t afford surprises
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted-foreground)]">
          From first call to final delivery, everything is transparent, documented, and yours.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <Card key={point.title}>
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                  <point.icon className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <h3 className="mt-4 font-semibold text-[var(--foreground)]">{point.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
