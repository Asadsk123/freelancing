"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Users,
  Layers,
  FileText,
  Inbox,
  Star,
  Settings,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/lib/auth/actions";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  folder: FolderOpen,
  users: Users,
  layers: Layers,
  "file-text": FileText,
  inbox: Inbox,
  star: Star,
  settings: Settings,
};

const mobileNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout-dashboard" },
  { label: "Projects", href: "/admin/projects", icon: "folder" },
  { label: "Clients", href: "/admin/clients", icon: "users" },
  { label: "Services", href: "/admin/services", icon: "layers" },
  { label: "Blog", href: "/admin/blog", icon: "file-text" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "inbox" },
  { label: "Reviews", href: "/admin/reviews", icon: "star" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
] as const;

type AdminHeaderProps = {
  userName: string;
  userInitials: string;
};

export function AdminHeader({ userName, userInitials }: AdminHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[var(--background)]/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(!mobileOpen)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{mobileOpen ? "Close menu" : "Open menu"}</TooltipContent>
            </Tooltip>
            <Logo />
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Badge variant="default" className="text-xs">
              Admin
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
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

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-30 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <nav
            className="relative z-10 w-64 border-r border-[var(--border)] bg-[var(--background)] p-4"
            aria-label="Admin mobile navigation"
          >
            <div className="flex flex-col gap-1">
              {mobileNavItems.map((item) => {
                const Icon = iconMap[item.icon] ?? Home;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
