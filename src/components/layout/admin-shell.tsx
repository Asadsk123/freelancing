"use client";

import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

type AdminShellProps = {
  children: React.ReactNode;
  userName: string;
  userInitials: string;
};

export function AdminShell({ children, userName, userInitials }: AdminShellProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader userName={userName} userInitials={userInitials} />
        <main className="flex-1 px-4 py-6 sm:px-6" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
