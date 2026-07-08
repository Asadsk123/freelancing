"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { toast, Toaster } from "@/components/ui/toast";
import { useUnsavedChangesWarning } from "@/lib/hooks/use-unsaved-changes-warning";
import { updateProfile, updateNotificationPreference } from "./actions";

type NotificationPref = "all" | "portal_only" | "critical_only";

type SettingsUser = {
  name: string;
  email: string;
  phone: string;
  company: string;
  notificationPreference: NotificationPref;
};

const prefOptions: { value: NotificationPref; label: string; description: string }[] = [
  { value: "all", label: "All notifications", description: "Email + portal notifications for everything" },
  { value: "portal_only", label: "Portal only", description: "Notifications in the portal only, no emails" },
  { value: "critical_only", label: "Critical only", description: "Only milestone completions and file deliveries" },
];

export function SettingsForm({ user, dbAvailable }: { user: SettingsUser; dbAvailable: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [company, setCompany] = useState(user.company);
  const [profileDirty, setProfileDirty] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [notificationPref, setNotificationPref] = useState<NotificationPref>(user.notificationPreference);

  useUnsavedChangesWarning(profileDirty && !isPending);

  function markProfile<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setProfileDirty(true);
      setProfileSaved(false);
    };
  }

  function saveProfile() {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("phone", phone);
    fd.set("company", company);
    startTransition(async () => {
      const res = await updateProfile(fd);
      if (res.success) {
        toast.success("Profile updated.");
        setProfileDirty(false);
        setProfileSaved(true);
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  function choosePref(next: NotificationPref) {
    const previous = notificationPref;
    setNotificationPref(next);
    const fd = new FormData();
    fd.set("preference", next);
    startTransition(async () => {
      const res = await updateNotificationPreference(fd);
      if (res.success) {
        toast.success("Notification preferences saved.");
        router.refresh();
      } else {
        setNotificationPref(previous); // revert on failure
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <Toaster />
      <PageHeader title="Settings" description="Manage your account and preferences." />

      {!dbAvailable && (
        <div className="mt-4 max-w-2xl rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">Database not connected — changes cannot be saved.</p>
        </div>
      )}

      <div className="mt-8 space-y-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Name</Label>
                <Input
                  id="settings-name"
                  value={name}
                  onChange={(e) => markProfile(setName)(e.target.value)}
                  autoComplete="name"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input id="settings-email" type="email" value={user.email} autoComplete="email" disabled />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-phone">Phone</Label>
                <Input
                  id="settings-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => markProfile(setPhone)(e.target.value)}
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-company">Company</Label>
                <Input
                  id="settings-company"
                  value={company}
                  onChange={(e) => markProfile(setCompany)(e.target.value)}
                  autoComplete="organization"
                  placeholder="Your company name"
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              {profileSaved && !profileDirty && (
                <span className="flex items-center gap-1 text-xs text-[var(--success,#16a34a)]">
                  <Check className="h-3.5 w-3.5" /> Saved
                </span>
              )}
              <Button onClick={saveProfile} disabled={isPending || !profileDirty || !dbAvailable}>
                {isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified. Saved instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prefOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)] has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--accent)]"
              >
                <input
                  type="radio"
                  name="notification-pref"
                  value={option.value}
                  checked={notificationPref === option.value}
                  onChange={() => choosePref(option.value)}
                  disabled={isPending || !dbAvailable}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{option.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{option.description}</p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>Manage your active sessions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] p-4">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Current session</p>
                <p className="text-sm text-[var(--muted-foreground)]">This device &middot; Active now</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
