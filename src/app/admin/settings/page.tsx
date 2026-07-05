import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminSettingsForm } from "./admin-settings-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Manage admin account and agency settings.",
};

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl" />}>
      <AdminSettingsForm />
    </Suspense>
  );
}
