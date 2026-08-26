"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/shared/form-error";
import { toast, Toaster } from "@/components/ui/toast";
import { createClient } from "../actions";

export function ClientForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("company", company);
    fd.set("phone", phone);
    startTransition(async () => {
      const res = await createClient(fd);
      if (res.success) {
        toast.success("Client created.");
        router.push("/admin/clients");
      } else {
        setError(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <Card>
        <CardContent className="space-y-4 pt-6">
          {error && <FormError message={error} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-name">Full name</Label>
              <Input
                id="client-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                disabled={isPending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email address</Label>
              <Input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                disabled={isPending}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-company">Company (optional)</Label>
              <Input
                id="client-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Phone (optional)</Label>
              <Input
                id="client-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                disabled={isPending}
              />
            </div>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            The client can log in using this email address via the OTP flow. If the email already exists in the system the existing account will be returned unchanged.
          </p>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create client"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
