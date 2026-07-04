import Link from "next/link";
import { brand } from "@/config/brand";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-bold text-[var(--foreground)]">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
        Page not found
      </h2>
      <p className="mt-2 max-w-md text-[var(--muted-foreground)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:opacity-90"
        >
          Go to homepage
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
        >
          Contact us
        </Link>
      </div>
      <p className="mt-12 text-sm text-[var(--muted-foreground)]">
        Need help? Email us at{" "}
        <a
          href={`mailto:${brand.contact.email}`}
          className="text-[var(--primary)] underline"
        >
          {brand.contact.email}
        </a>
      </p>
    </main>
  );
}
