import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { AdminShell } from "@/components/layout/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  // Fresh name from the DB — the JWT payload goes stale after a profile rename.
  const user = hasDatabase() ? await userRepository.findById(session.userId) : undefined;

  // Revalidate the actor against the database so demotion, deactivation, or
  // deletion takes effect immediately instead of at cookie expiry.
  if (hasDatabase() && (!user || !user.isActive || user.role !== "admin")) {
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
    <AdminShell userName={displayName} userInitials={initials}>
      {children}
    </AdminShell>
  );
}
