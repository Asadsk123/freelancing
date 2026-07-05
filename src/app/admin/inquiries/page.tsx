import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Manage Inquiries",
  description: "View and respond to client inquiries.",
};

const mockInquiries = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "Acme Corp",
    service: "Web Development",
    status: "new",
    date: "Jul 5, 2026",
    message: "We need a new e-commerce platform for our retail business...",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    company: "TechStart Inc",
    service: "Mobile App Development",
    status: "new",
    date: "Jul 4, 2026",
    message: "Looking for a team to build our iOS and Android app...",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@example.com",
    company: "Global Retail",
    service: "Digital Marketing",
    status: "responded",
    date: "Jul 2, 2026",
    message: "We want to improve our online presence and SEO rankings...",
  },
  {
    id: "4",
    name: "James Taylor",
    email: "james@example.com",
    company: "",
    service: "Graphic Design",
    status: "in_discussion",
    date: "Jun 28, 2026",
    message: "Need a complete rebrand including logo, business cards...",
  },
  {
    id: "5",
    name: "Linda Garcia",
    email: "linda@example.com",
    company: "HealthPlus",
    service: "Web Development",
    status: "accepted",
    date: "Jun 20, 2026",
    message: "We need a patient portal integrated with our existing system...",
  },
  {
    id: "6",
    name: "Robert Kim",
    email: "robert@example.com",
    company: "Kim & Associates",
    service: "E-commerce Solutions",
    status: "declined",
    date: "Jun 15, 2026",
    message: "Looking for a simple Shopify setup...",
  },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "secondary" | "default" | "error" }> = {
  new: { label: "New", variant: "default" },
  responded: { label: "Responded", variant: "secondary" },
  in_discussion: { label: "In Discussion", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "error" },
  project_created: { label: "Project Created", variant: "success" },
};

export default function AdminInquiriesPage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader title="Inquiries" description="View and respond to client inquiries." />

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
              {mockInquiries.map((inquiry) => {
                const badge = statusBadge[inquiry.status] ?? { label: "New", variant: "default" as const };
                return (
                  <tr key={inquiry.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--foreground)]">{inquiry.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {inquiry.company ? `${inquiry.company} · ` : ""}{inquiry.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted-foreground)]">{inquiry.service}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-[var(--muted-foreground)]">
                      {inquiry.message}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">{inquiry.date}</td>
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
