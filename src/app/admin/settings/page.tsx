import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { AdminSettingsForm } from "./admin-settings-form";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Manage admin account and agency settings.",
};

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbAvailable = hasDatabase();
  const user = dbAvailable ? await userRepository.findById(session.userId) : undefined;

  return (
    <AdminSettingsForm
      user={{
        name: user?.name ?? session.name,
        email: user?.email ?? session.email,
        phone: user?.phone ?? "",
        company: user?.company ?? "",
      }}
      dbAvailable={dbAvailable}
    />
  );
}
