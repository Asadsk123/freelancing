"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Home, FolderOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Projects", href: "/projects", icon: FolderOpen },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
] satisfies { label: string; href: string; icon: LucideIcon }[];

type PortalHeaderProps = {
  userName: string;
  userInitials: string;
};

export function PortalHeader({ userName, userInitials }: PortalHeaderProps) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--background)]/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo />
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/notifications" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3 ml-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-[var(--foreground)] sm:block">
                {userName}
              </span>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--background)] lg:hidden"
        aria-label="Mobile portal navigation"
      >
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)]",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
