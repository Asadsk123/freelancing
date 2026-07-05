import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Manage Clients",
  description: "View and manage client accounts.",
};

const mockClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@acmecorp.com",
    company: "Acme Corp",
    initials: "SJ",
    projects: 2,
    status: "active",
    joinedDate: "Jan 2026",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@techstart.com",
    company: "TechStart Inc",
    initials: "MC",
    projects: 1,
    status: "active",
    joinedDate: "Mar 2026",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@globalretail.com",
    company: "Global Retail",
    initials: "EW",
    projects: 1,
    status: "active",
    joinedDate: "Apr 2026",
  },
  {
    id: "4",
    name: "David Park",
    email: "david@fintech.com",
    company: "FinTech Solutions",
    initials: "DP",
    projects: 1,
    status: "inactive",
    joinedDate: "Nov 2024",
  },
  {
    id: "5",
    name: "Lisa Martinez",
    email: "lisa@healthfirst.com",
    company: "HealthFirst",
    initials: "LM",
    projects: 1,
    status: "active",
    joinedDate: "Feb 2026",
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "secondary" }> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "secondary" },
};

export default function AdminClientsPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Clients" description="Manage client accounts." />

      <div className="mt-8">
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Client</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Company</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Projects</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Joined</th>
              </tr>
            </thead>
            <tbody>
              {mockClients.map((client) => {
                const badge = statusBadge[client.status] ?? { label: "Active", variant: "success" as const };
                return (
                  <tr key={client.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{client.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{client.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{client.company}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{client.projects}</td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{client.joinedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
