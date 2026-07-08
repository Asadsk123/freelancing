"use client";

import { PortalSidebar } from "./portal-sidebar";
import { PortalHeader } from "./portal-header";

type PortalShellProps = {
  children: React.ReactNode;
  userName: string;
  userInitials: string;
  unreadCount?: number;
};

export function PortalShell({ children, userName, userInitials, unreadCount = 0 }: PortalShellProps) {
  return (
    <div className="flex min-h-screen">
      <PortalSidebar />
      <div className="flex flex-1 flex-col">
        <PortalHeader userName={userName} userInitials={userInitials} unreadCount={unreadCount} />
        <main className="flex-1 px-4 py-6 pb-20 sm:px-6 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
