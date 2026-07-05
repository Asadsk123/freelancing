import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { TrackingId } from "@/components/shared/tracking-id";
import { Inbox } from "lucide-react";
import { hasDatabase } from "@/db";
import { inquiryRepository } from "@/lib/repositories/inquiry";
import { formatDate } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Manage Inquiries",
  description: "View and respond to client inquiries.",
};

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" | "error" }> = {
  new: { label: "New", variant: "default" },
  responded: { label: "Responded", variant: "secondary" },
  in_discussion: { label: "In Discussion", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "error" },
  project_created: { label: "Project Created", variant: "success" },
};

export default async function AdminInquiriesPage() {
  const dbAvailable = hasDatabase();
  const inquiries = dbAvailable ? await inquiryRepository.findAll() : [];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Inquiries" description="View and respond to client inquiries." />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to view inquiries.
          </p>
        </div>
      )}

      {dbAvailable && inquiries.length === 0 && (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={Inbox}
                title="No inquiries yet"
                description="Inquiries from the contact form will appear here."
              />
            </CardContent>
          </Card>
        </div>
      )}

      {inquiries.length > 0 && (
        <div className="mt-8">
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Service</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Message</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => {
                  const badge = statusBadge[inquiry.status] ?? { label: "New", variant: "default" as const };
                  return (
                    <tr key={inquiry.id} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-[var(--foreground)]">{inquiry.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {inquiry.company ? `${inquiry.company} · ` : ""}{inquiry.email}
                        </p>
                        <div className="mt-0.5">
                          <TrackingId id={inquiry.trackingId} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {inquiry.serviceInterest ?? "—"}
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-[var(--muted-foreground)]">
                        {inquiry.message}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                        {formatDate(inquiry.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
