import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { notificationRepository } from "@/lib/repositories/notification";
import { userRepository } from "@/lib/repositories/user";
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

  // Fetch fresh alongside the unread count — the JWT name goes stale after a
  // profile rename (payload is fixed for the session's 30-day life).
  const [user, unreadCount] = hasDatabase()
    ? await Promise.all([
        userRepository.findById(session.userId),
        notificationRepository.countUnread(session.userId),
      ])
    : [undefined, 0];

  // A signed cookie is not enough: if the account was deleted or deactivated
  // since sign-in, the session must die now — not when the cookie expires.
  if (hasDatabase() && (!user || !user.isActive)) {
    redirect("/api/auth/invalid-session");
  }

  const displayName = user?.name ?? session.name;

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <PortalShell userName={displayName} userInitials={initials} unreadCount={unreadCount}>
      {children}
    </PortalShell>
  );
}
