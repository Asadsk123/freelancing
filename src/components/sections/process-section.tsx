const steps = [
  { num: "01", title: "Discovery Call", description: "We learn your business, goals, and current challenges. No jargon — just clear questions." },
  { num: "02", title: "Proposal & Plan", description: "You get a custom plan with clear scope, timeline, and pricing. No hidden costs." },
  { num: "03", title: "Design & Build", description: "We build your solution in milestones, sharing progress at every stage." },
  { num: "04", title: "Test & Refine", description: "Full testing across devices and browsers. You review and request changes." },
  { num: "05", title: "Launch", description: "We handle deployment, domain setup, and go-live. Your site is live and working." },
  { num: "06", title: "Support", description: "Post-launch support, training, and ongoing improvements as your business grows." },
];

export function ProcessSection() {
  return (
    <section className="py-20 bg-[var(--muted)]/20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            How We Work
          </h2>
          <p className="mt-4 text-lg text-[var(--muted-foreground)]">
            A clear, professional process — so you always know what&apos;s happening and what comes next.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="relative rounded-xl border border-[var(--border)] bg-[var(--background)] p-6">
              <span className="text-4xl font-black text-[var(--border)] select-none">{step.num}</span>
              <h3 className="mt-3 font-semibold text-[var(--foreground)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
