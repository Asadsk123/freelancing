"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { brand } from "@/config/brand";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]">
        <AlertTriangle className="h-7 w-7 text-[var(--primary)]" aria-hidden="true" />
      </div>
      <h1 className="text-xl font-semibold text-[var(--foreground)]">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-[var(--muted-foreground)]">
        An unexpected error occurred. You can try again — if the problem
        persists, please let us know.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-[var(--muted-foreground)]">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
        >
          Go to homepage
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
