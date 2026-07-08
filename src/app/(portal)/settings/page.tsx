import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { userRepository } from "@/lib/repositories/user";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = hasDatabase() ? await userRepository.findById(session.userId) : undefined;

  return (
    <SettingsForm
      user={{
        name: user?.name ?? session.name,
        email: user?.email ?? session.email,
        phone: user?.phone ?? "",
        company: user?.company ?? "",
        notificationPreference: user?.notificationPreference ?? "all",
      }}
      dbAvailable={hasDatabase()}
    />
  );
}
