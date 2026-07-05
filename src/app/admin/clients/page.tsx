import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Manage Clients",
  description: "View and manage client accounts.",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function AdminClientsPage() {
  const dbAvailable = hasDatabase();
  const clients = dbAvailable ? await userRepository.findAllClients() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Clients" description="Manage client accounts." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to manage clients.
          </p>
        </div>
      )}

      {dbAvailable && clients.length === 0 && (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={Users}
                title="No clients yet"
                description="Clients will appear here once they sign in for the first time."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {clients.length > 0 && (
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
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{client.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{client.company ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{client.projectCount}</td>
                    <td className="px-4 py-3">
                      <Badge variant={client.isActive ? "success" : "secondary"}>
                        {client.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                      {formatDate(client.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
