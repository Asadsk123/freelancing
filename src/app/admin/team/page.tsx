import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ShieldCheck } from "lucide-react";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { getSession } from "@/lib/auth/session";
import { TeamManager } from "./team-manager";

export const metadata: Metadata = {
  title: "Administrators",
  description: "Manage administrator accounts and access.",
};

export default async function AdminTeamPage() {
  const dbAvailable = hasDatabase();
  const session = await getSession();

  const admins = dbAvailable ? await userRepository.findAllAdmins() : [];
  const activeAdminCount = admins.filter((a) => a.isActive).length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Administrators"
        description="Manage who has administrator access to the platform."
      />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to manage administrators.
          </p>
        </div>
      )}

      {dbAvailable && admins.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={ShieldCheck}
                title="No administrators yet"
                description="Administrators will appear here."
              />
            </CardContent>
          </Card>
        </div>
      ) : dbAvailable ? (
        <div className="mt-8">
          <TeamManager
            admins={admins.map((a) => ({
              id: a.id,
              name: a.name,
              email: a.email,
              isActive: a.isActive,
              createdAt: a.createdAt,
            }))}
            currentUserId={session?.userId ?? ""}
            activeAdminCount={activeAdminCount}
          />
        </div>
      ) : null}
    </div>
  );
}
