"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Home, FolderOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { NetworkStatus } from "@/components/shared/network-status";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/lib/auth/actions";
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
  unreadCount?: number;
};

export function PortalHeader({ userName, userInitials, unreadCount = 0 }: PortalHeaderProps) {
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
            <NetworkStatus />
            <LanguageSwitcher />
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="relative">
                  <Link
                    href="/notifications"
                    aria-label={
                      unreadCount > 0
                        ? `Notifications (${unreadCount} unread)`
                        : "Notifications"
                    }
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span
                        aria-hidden
                        className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-semibold leading-none text-[var(--primary-foreground,#fff)]"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2 border-l border-[var(--border)] pl-3 ml-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-[var(--foreground)] sm:block">
                {userName}
              </span>
              <form action={logout}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" type="submit" aria-label="Sign out">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign out</TooltipContent>
                </Tooltip>
              </form>
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
