import { brand } from "@/config/brand";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
        {brand.name}
      </h1>
      <p className="mt-4 text-lg text-[var(--muted-foreground)]">
        {brand.tagline}
      </p>
      <div className="mt-8 flex gap-4">
        <span className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]">
          Platform v2.0
        </span>
        <span className="rounded-md bg-[var(--secondary)] px-4 py-2 text-sm font-medium text-[var(--secondary-foreground)]">
          Phase 1A
        </span>
      </div>
    </main>
  );
}
