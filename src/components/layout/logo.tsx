import Link from "next/link";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
        RA
      </span>
      {/* Full brand name; wraps to two tight lines where horizontal space is short. */}
      <span className="max-w-[11rem] text-sm leading-tight sm:max-w-none sm:text-base lg:text-lg">
        {brand.name}
      </span>
    </Link>
  );
}
