"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { publicNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
        triggerRef.current?.focus();
      };
    }
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-[var(--background)] shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
          <Logo />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {publicNavigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                pathname === item.href
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <Button asChild className="w-full">
            <Link href={publicNavigation.cta.href}>
              {publicNavigation.cta.label}
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
