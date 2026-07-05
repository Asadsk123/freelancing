"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "@/components/ui/toast";

export function SettingsForm() {
  const [notificationPref, setNotificationPref] = useState<string>("all");

  function handleProfileSave() {
    toast.success("Profile updated successfully.");
  }

  function handleNotificationSave() {
    toast.success("Notification preferences saved.");
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <Toaster />
      <PageHeader title="Settings" description="Manage your account and preferences." />

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
                  defaultValue="Demo User"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input
                  id="settings-email"
                  type="email"
                  defaultValue="demo@royalasad.com"
                  autoComplete="email"
                  disabled
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="settings-phone">Phone</Label>
                <Input
                  id="settings-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-company">Company</Label>
                <Input
                  id="settings-company"
                  autoComplete="organization"
                  placeholder="Your company name"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProfileSave}>Save Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { value: "all", label: "All notifications", description: "Email + portal notifications for everything" },
              { value: "portal_only", label: "Portal only", description: "Notifications in the portal only, no emails" },
              { value: "critical_only", label: "Critical only", description: "Only milestone completions and file deliveries" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)] has-[:checked]:border-[var(--primary)] has-[:checked]:bg-[var(--accent)]"
              >
                <input
                  type="radio"
                  name="notification-pref"
                  value={option.value}
                  checked={notificationPref === option.value}
                  onChange={() => setNotificationPref(option.value)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{option.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{option.description}</p>
                </div>
              </label>
            ))}
            <div className="flex justify-end">
              <Button onClick={handleNotificationSave}>Save Preferences</Button>
            </div>
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

