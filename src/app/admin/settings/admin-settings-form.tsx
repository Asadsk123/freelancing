"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { toast, Toaster } from "@/components/ui/toast";
import { useUnsavedChangesWarning } from "@/lib/hooks/use-unsaved-changes-warning";
import { brand } from "@/config/brand";
import { updateProfile } from "@/app/(portal)/settings/actions";

type AdminUser = {
  name: string;
  email: string;
  phone: string;
  /** Preserved as-is on save — the admin form doesn't edit it. */
  company: string;
};

export function AdminSettingsForm({ user, dbAvailable }: { user: AdminUser; dbAvailable: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  useUnsavedChangesWarning(dirty && !isPending);

  function markDirty<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
      setSaved(false);
    };
  }

  function handleSave() {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("phone", phone);
    fd.set("company", user.company);
    startTransition(async () => {
      const res = await updateProfile(fd);
      if (res.success) {
        toast.success("Admin profile updated.");
        setDirty(false);
        setSaved(true);
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <Toaster />
      <PageHeader title="Settings" description="Manage admin account and agency settings." />

      {!dbAvailable && (
        <div className="mt-4 max-w-2xl rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">Database not connected — changes cannot be saved.</p>
        </div>
      )}

      <div className="mt-8 space-y-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>Your admin account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={name}
                  onChange={(e) => markDirty(setName)(e.target.value)}
                  autoComplete="name"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input id="admin-email" type="email" value={user.email} autoComplete="email" disabled />
              </div>
            </div>
            <div className="space-y-2 sm:max-w-[calc(50%-0.5rem)]">
              <Label htmlFor="admin-phone">Phone</Label>
              <Input
                id="admin-phone"
                type="tel"
                value={phone}
                onChange={(e) => markDirty(setPhone)(e.target.value)}
                autoComplete="tel"
                placeholder="+91 00000 00000"
                disabled={isPending}
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              {saved && !dirty && (
                <span className="flex items-center gap-1 text-xs text-[var(--success,#16a34a)]">
                  <Check className="h-3.5 w-3.5" /> Saved
                </span>
              )}
              <Button onClick={handleSave} disabled={isPending || !dirty || !dbAvailable}>
                {isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Agency Information</CardTitle>
            <CardDescription>
              Public-facing agency details. These are configured in code
              (<code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">src/config/brand.ts</code>)
              so they stay consistent across the site, emails, and SEO.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-[var(--muted-foreground)]">Agency name</dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{brand.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--muted-foreground)]">Contact email</dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{brand.contact.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--muted-foreground)]">Phone</dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{brand.contact.phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-[var(--muted-foreground)]">Office</dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{brand.contact.address}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium text-[var(--muted-foreground)]">Tagline</dt>
                <dd className="mt-0.5 text-[var(--foreground)]">{brand.tagline}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
