"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, Bell, Settings } from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  folder: FolderOpen,
  bell: Bell,
  settings: Settings,
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Projects", href: "/projects", icon: "folder" },
  { label: "Notifications", href: "/notifications", icon: "bell" },
  { label: "Settings", href: "/settings", icon: "settings" },
] as const;

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--card)] lg:block">
      <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1 p-4" aria-label="Portal navigation">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Home;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
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
      </nav>
    </aside>
  );
}
