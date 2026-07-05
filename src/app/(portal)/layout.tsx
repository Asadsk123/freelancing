import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const initials = session.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <PortalShell userName={session.name} userInitials={initials}>
      {children}
    </PortalShell>
  );
}
