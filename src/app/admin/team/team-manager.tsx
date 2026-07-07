"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast, Toaster } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus, ShieldOff, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";
import { setAdminActive, promoteToAdmin, demoteToClient } from "./actions";

type Admin = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamManager({
  admins,
  currentUserId,
  activeAdminCount,
}: {
  admins: Admin[];
  currentUserId: string;
  activeAdminCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  function run(
    fn: (fd: FormData) => Promise<{ success: boolean; error?: string }>,
    fd: FormData,
    successMsg: string,
    onSuccess?: () => void,
  ) {
    startTransition(async () => {
      const res = await fn(fd);
      if (res.success) {
        toast.success(successMsg);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  function handlePromote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("email", email);
    run(promoteToAdmin, fd, "Administrator added.", () => setEmail(""));
  }

  function handleSetActive(admin: Admin, nextActive: boolean) {
    if (!nextActive && !confirm(`Deactivate ${admin.name}'s administrator access?`)) return;
    const fd = new FormData();
    fd.set("userId", admin.id);
    fd.set("active", nextActive ? "true" : "false");
    run(setAdminActive, fd, nextActive ? "Administrator activated." : "Administrator deactivated.");
  }

  function handleDemote(admin: Admin) {
    if (!confirm(`Remove administrator access for ${admin.name}? They become a client account.`)) return;
    const fd = new FormData();
    fd.set("userId", admin.id);
    run(demoteToClient, fd, "Administrator removed.");
  }

  return (
    <div className="space-y-6">
      <Toaster />

      {/* Promote an existing user */}
      <Card>
        <CardContent className="py-5">
          <form onSubmit={handlePromote} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="promote-email">Add an administrator</Label>
              <Input
                id="promote-email"
                type="email"
                inputMode="email"
                autoComplete="off"
                placeholder="existing-user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <Button type="submit" disabled={isPending || !email}>
              <UserPlus className="mr-1.5 h-4 w-4" />
              {isPending ? "Working..." : "Promote to admin"}
            </Button>
          </form>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            The person must have signed in at least once so an account exists.
          </p>
        </CardContent>
      </Card>

      {/* Administrator list */}
      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Administrator</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Status</th>
              <th className="px-4 py-3 text-left font-medium text-[var(--muted-foreground)]">Since</th>
              <th className="px-4 py-3 text-right font-medium text-[var(--muted-foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const isSelf = admin.id === currentUserId;
              const isLastActive = admin.isActive && activeAdminCount <= 1;
              const deactivateBlocked = isSelf || isLastActive;
              const demoteBlocked = isSelf || isLastActive;
              const blockReason = isSelf
                ? "You can't change your own access."
                : "At least one active administrator must remain.";

              return (
                <tr key={admin.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{getInitials(admin.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                          {admin.name}
                          {isSelf && <Badge variant="secondary">You</Badge>}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={admin.isActive ? "success" : "secondary"}>
                      {admin.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--muted-foreground)]">
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {admin.isActive ? (
                        deactivateBlocked ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span tabIndex={0}>
                                <Button variant="ghost" size="sm" disabled aria-label="Deactivate">
                                  <ShieldOff className="mr-1.5 h-4 w-4" />
                                  Deactivate
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{blockReason}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleSetActive(admin, false)} disabled={isPending}>
                            <ShieldOff className="mr-1.5 h-4 w-4" />
                            Deactivate
                          </Button>
                        )
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleSetActive(admin, true)} disabled={isPending}>
                          <ShieldCheck className="mr-1.5 h-4 w-4" />
                          Activate
                        </Button>
                      )}

                      {demoteBlocked ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span tabIndex={0}>
                              <Button variant="ghost" size="sm" disabled aria-label="Remove admin">
                                Remove admin
                              </Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{blockReason}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleDemote(admin)} disabled={isPending}>
                          Remove admin
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
