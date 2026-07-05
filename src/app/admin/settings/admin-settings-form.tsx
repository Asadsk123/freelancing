"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast, Toaster } from "@/components/ui/toast";

export function AdminSettingsForm() {
  function handleProfileSave() {
    toast.success("Admin profile updated.");
  }

  function handleAgencySave() {
    toast.success("Agency settings saved.");
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <Toaster />
      <PageHeader title="Settings" description="Manage admin account and agency settings." />

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
                  defaultValue="Admin"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@royalasad.com"
                  autoComplete="email"
                  disabled
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleProfileSave}>Save Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Agency Information</CardTitle>
            <CardDescription>Public-facing agency details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input
                  id="agency-name"
                  defaultValue="Royal Asad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency-email">Contact Email</Label>
                <Input
                  id="agency-email"
                  type="email"
                  defaultValue="hello@royalasad.com"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-tagline">Tagline</Label>
              <Input
                id="agency-tagline"
                defaultValue="Digital solutions that grow your business"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agency-description">Description</Label>
              <Textarea
                id="agency-description"
                defaultValue="Royal Asad is a premium international digital agency delivering web development, design, and digital marketing solutions for businesses worldwide."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAgencySave}>Save Agency Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
