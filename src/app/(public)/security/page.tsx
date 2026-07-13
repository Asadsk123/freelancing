import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { ShieldCheck, KeyRound, FileLock2, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Security",
  description: "How we protect your account, projects, and files.",
};

const practices = [
  {
    icon: KeyRound,
    title: "Passwordless sign-in",
    description:
      "No passwords to steal or reuse — access is granted through one-time email codes and short-lived, httpOnly sessions.",
  },
  {
    icon: FileLock2,
    title: "Private project files",
    description:
      "Every file download is ownership-checked on the server. Clients can only ever access files on their own projects.",
  },
  {
    icon: History,
    title: "Audit logging",
    description:
      "Sensitive actions — team changes, publishing, file and project mutations — are recorded in an internal audit trail.",
  },
  {
    icon: ShieldCheck,
    title: "Defense in depth",
    description:
      "Role checks run on every admin action server-side, all traffic is encrypted in transit, and secrets live only in environment configuration.",
  },
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        title="Security"
        description="How we protect your account, projects, and files."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {practices.map((p) => (
          <Card key={p.title}>
            <CardContent className="pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                <p.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <h2 className="mt-4 font-semibold text-[var(--foreground)]">{p.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-xs text-[var(--muted-foreground)]">
        Found a vulnerability? Please report it responsibly — we take every report seriously.
      </p>
    </div>
  );
}
