import { AdminShell } from "@/components/layout/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockAdmin = {
    name: "Admin",
    initials: "AD",
  };

  return (
    <AdminShell userName={mockAdmin.name} userInitials={mockAdmin.initials}>
      {children}
    </AdminShell>
  );
}
