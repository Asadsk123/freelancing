const stack = [
  "Next.js", "React", "TypeScript", "PostgreSQL", "Tailwind CSS",
  "OpenAI API", "WhatsApp Business API", "Vercel", "Drizzle ORM", "Node.js",
];

export function TechStrip() {
  return (
    <section className="border-y border-[var(--border)] py-10 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-6">
          Technologies We Use
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-1.5 text-sm font-medium text-[var(--foreground)] shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
