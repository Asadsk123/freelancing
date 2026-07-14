"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Layers,
  FileText,
  Inbox,
  Star,
  Settings,
  ShieldCheck,
  History,
  Home,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils/cn";
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
  "shield-check": ShieldCheck,
  history: History,
};

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layout-dashboard" },
  { label: "Projects", href: "/admin/projects", icon: "folder" },
  { label: "Clients", href: "/admin/clients", icon: "users" },
  { label: "Services", href: "/admin/services", icon: "layers" },
  { label: "Blog", href: "/admin/blog", icon: "file-text" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "inbox" },
  { label: "Reviews", href: "/admin/reviews", icon: "star" },
  { label: "Team", href: "/admin/team", icon: "shield-check" },
  { label: "Audit Log", href: "/admin/audit", icon: "history" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--card)] lg:block">
      <div className="flex h-16 items-center border-b border-[var(--border)] px-6">
        <Logo />
      </div>
      <nav className="flex flex-col gap-1 p-4" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] ?? Home;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
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
