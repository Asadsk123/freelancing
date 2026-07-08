import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { notificationRepository } from "@/lib/repositories/notification";
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

  const unreadCount = hasDatabase()
    ? await notificationRepository.countUnread(session.userId)
    : 0;

  return (
    <PortalShell userName={session.name} userInitials={initials} unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
