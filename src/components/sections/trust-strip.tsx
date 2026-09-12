import { ShieldCheck, GitBranch, MessageSquare, Layers, Globe, Clock } from "lucide-react";

const points = [
  {
    icon: Globe,
    title: "Works worldwide",
    description: "We serve clients across the USA, UK, UAE, Canada, Pakistan, and more. Remote-first with fluent English communication.",
  },
  {
    icon: ShieldCheck,
    title: "NDA-friendly",
    description: "Your project idea stays private. We sign NDAs and never share client work without permission.",
  },
  {
    icon: GitBranch,
    title: "Milestone delivery",
    description: "Work is broken into clear milestones. You see progress and can give feedback at every stage.",
  },
  {
    icon: Clock,
    title: "Fast response",
    description: "We respond within a few hours via email or WhatsApp — no week-long waits for a simple answer.",
  },
  {
    icon: MessageSquare,
    title: "One point of contact",
    description: "A dedicated project manager handles everything — no bouncing between departments.",
  },
  {
    icon: Layers,
    title: "Built to last",
    description: "We use modern tech stacks and production-grade code. Your website stays fast and easy to update.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--muted)]/40 py-16">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
          Why clients choose us
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted-foreground)]">
          Professional, honest, and reliable — every project, every time.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                <point.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <h3 className="mt-4 font-semibold text-[var(--foreground)]">{point.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
