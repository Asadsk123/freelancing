"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard } from "lucide-react";
import { publicNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { NetworkStatus } from "@/components/shared/network-status";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/lib/i18n/provider";
import { navKeyForHref } from "@/config/navigation";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";

type HeaderProps = {
  onMobileMenuOpen: () => void;
  dashboardHref?: string;
};

export function Header({ onMobileMenuOpen, dashboardHref = "/login" }: HeaderProps) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {publicNavigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
              )}
            >
              {t(navKeyForHref(item.href))}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NetworkStatus />
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href={dashboardHref}>
              <LayoutDashboard className="h-4 w-4" />
              {dashboardHref === "/login" ? "Client Portal" : "Dashboard"}
            </Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={publicNavigation.cta.href}>
              {t("nav.getQuote")}
            </Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onMobileMenuOpen}
                aria-label={t("common.openMenu")}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("common.openMenu")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
