import { PublicShell } from "@/components/layout/public-shell";
import { Footer } from "@/components/layout/footer";
import { getSession } from "@/lib/auth/session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const dashboardHref = session
    ? session.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard"
    : "/login";

  return (
    <>
      <PublicShell dashboardHref={dashboardHref}>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </PublicShell>
      <Footer />
    </>
  );
}
