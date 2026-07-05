import { PortalShell } from "@/components/layout/portal-shell";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user data — will be replaced by real session lookup
  const mockUser = {
    name: "Demo User",
    initials: "DU",
  };

  return (
    <PortalShell userName={mockUser.name} userInitials={mockUser.initials}>
      {children}
    </PortalShell>
  );
}
