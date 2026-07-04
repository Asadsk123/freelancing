import { brand } from "@/config/brand";
import { DesignSystemShowcase } from "./design-showcase";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
          {brand.name}
        </h1>
        <p className="mt-2 text-lg text-[var(--muted-foreground)]">
          {brand.tagline}
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Design System — Phase 1A Module 2
        </p>
      </div>
      <DesignSystemShowcase />
    </div>
  );
}
