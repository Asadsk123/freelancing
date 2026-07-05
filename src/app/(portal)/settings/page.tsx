import type { Metadata } from "next";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return <SettingsForm />;
}
