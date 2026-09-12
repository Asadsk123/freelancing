import { AlertCircle, Clock, TrendingDown, Puzzle } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Manual work eating your time?",
    description: "Repetitive tasks like follow-up emails, data entry, appointment booking, and customer replies take hours every day — time that should go to growing your business.",
  },
  {
    icon: TrendingDown,
    title: "Website not bringing clients?",
    description: "An outdated or generic website with no clear CTA sends potential clients straight to your competitors. First impressions decide everything.",
  },
  {
    icon: Puzzle,
    title: "Tools that don't connect?",
    description: "Your CRM, WhatsApp, email, and website all operate in silos. Data gets lost, leads go cold, and nothing works together automatically.",
  },
  {
    icon: AlertCircle,
    title: "No system, just chaos?",
    description: "Without a proper lead management and project tracking system, you're running your business on WhatsApp messages and memory — and that doesn't scale.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Sound familiar?
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            These are the real problems we solve for businesses every day.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {problems.map((p) => (
            <div key={p.title} className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/30">
                <p.icon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
