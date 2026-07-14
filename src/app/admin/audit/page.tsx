import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { History } from "lucide-react";
import { hasDatabase } from "@/db";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { formatRelativeTime } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Audit Log",
  description: "Recent sensitive actions across the platform.",
};

/** action prefix → badge variant, so related events share a color. */
const actionVariant = (action: string): "success" | "warning" | "secondary" | "default" => {
  if (action.endsWith(".deleted") || action.endsWith(".deactivated") || action.endsWith(".demoted")) return "warning";
  if (action.endsWith(".created") || action.endsWith(".promoted") || action.endsWith(".published") || action.endsWith(".activated")) return "success";
  if (action.endsWith(".submitted") || action.endsWith(".uploaded")) return "default";
  return "secondary";
};

/** Renders small, non-sensitive metadata values inline (title, status, email...). */
function metadataSummary(metadata: Record<string, unknown> | null): string {
  if (!metadata) return "";
  return Object.entries(metadata)
    .filter(([, v]) => typeof v === "string" || typeof v === "number")
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(" · ");
}

export default async function AdminAuditPage() {
  const dbAvailable = hasDatabase();
  const entries = dbAvailable ? await auditLogRepository.findRecent(100) : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Audit Log" description="Recent sensitive actions across the platform." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> to view the audit log.
          </p>
        </div>
      )}

      {dbAvailable && entries.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={History}
                title="No audit entries yet"
                description="Sensitive actions — team changes, publishing, project and file mutations — are recorded here automatically."
              />
            </CardContent>
          </Card>
        </div>
      ) : entries.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Action</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Actor</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Details</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">When</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={actionVariant(entry.action)}>{entry.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground)]">
                    {entry.actorName ?? <span className="text-[var(--muted-foreground)]">System / removed user</span>}
                  </td>
                  <td className="max-w-md px-4 py-3 text-[var(--muted-foreground)]">
                    <p className="truncate" title={metadataSummary(entry.metadata)}>
                      {metadataSummary(entry.metadata) || `${entry.entityType} ${entry.entityId.slice(0, 8)}…`}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                    {formatRelativeTime(entry.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
