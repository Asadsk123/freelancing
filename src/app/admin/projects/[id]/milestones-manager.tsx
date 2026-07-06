"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/shared/empty-state";
import { toast, Toaster } from "@/components/ui/toast";
import { Flag, Plus, Pencil, Trash2 } from "lucide-react";
import {
  createMilestone,
  updateMilestone,
  updateMilestoneStatus,
  deleteMilestone,
} from "./actions";

type Milestone = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: "upcoming" | "in_progress" | "completed";
  sortOrder: number;
  dueDate: Date | null;
  completedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

const statusBadge: Record<Milestone["status"], { label: string; variant: "success" | "warning" | "secondary" }> = {
  upcoming: { label: "Upcoming", variant: "secondary" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function MilestonesManager({
  projectId,
  milestones,
}: {
  projectId: string;
  milestones: Milestone[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  function runAction(
    fn: (fd: FormData) => Promise<{ success: boolean; error?: string }>,
    formData: FormData,
    successMsg: string,
    onSuccess?: () => void,
  ) {
    startTransition(async () => {
      const res = await fn(formData);
      if (res.success) {
        toast.success(successMsg);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    runAction(createMilestone, fd, "Milestone added.", () => {
      form.reset();
      setShowAddForm(false);
    });
  }

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    runAction(updateMilestone, fd, "Milestone updated.", () => setEditingId(null));
  }

  function handleStatusChange(milestoneId: string, status: string) {
    const fd = new FormData();
    fd.set("milestoneId", milestoneId);
    fd.set("status", status);
    runAction(updateMilestoneStatus, fd, "Status updated.");
  }

  function handleDelete(milestoneId: string) {
    if (!confirm("Delete this milestone? This cannot be undone.")) return;
    const fd = new FormData();
    fd.set("milestoneId", milestoneId);
    runAction(deleteMilestone, fd, "Milestone deleted.");
  }

  return (
    <div className="space-y-4">
      <Toaster />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Milestones{milestones.length > 0 ? ` (${milestones.length})` : ""}
        </h2>
        <Button
          size="sm"
          variant={showAddForm ? "outline" : "default"}
          onClick={() => setShowAddForm((v) => !v)}
        >
          <Plus className="mr-1 h-4 w-4" />
          {showAddForm ? "Cancel" : "Add Milestone"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardContent className="py-5">
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="hidden" name="projectId" value={projectId} />
              <div className="space-y-2">
                <Label htmlFor="add-title">Title</Label>
                <Input id="add-title" name="title" required maxLength={200} placeholder="e.g. Design approval" disabled={isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description</Label>
                <Textarea id="add-description" name="description" rows={2} maxLength={2000} placeholder="Optional details" disabled={isPending} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="add-status">Status</Label>
                  <Select id="add-status" name="status" defaultValue="upcoming" disabled={isPending}>
                    <option value="upcoming">Upcoming</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-dueDate">Due date</Label>
                  <Input id="add-dueDate" name="dueDate" type="date" disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-sortOrder">Order</Label>
                  <Input id="add-sortOrder" name="sortOrder" type="number" min={0} defaultValue={milestones.length} disabled={isPending} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Add Milestone"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {milestones.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Flag}
              title="No milestones yet"
              description="Add milestones to track this project's progress. Clients see them in their portal."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone) => {
            const badge = statusBadge[milestone.status];
            const isEditing = editingId === milestone.id;

            if (isEditing) {
              return (
                <Card key={milestone.id}>
                  <CardContent className="py-5">
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <input type="hidden" name="milestoneId" value={milestone.id} />
                      <div className="space-y-2">
                        <Label htmlFor={`edit-title-${milestone.id}`}>Title</Label>
                        <Input id={`edit-title-${milestone.id}`} name="title" required maxLength={200} defaultValue={milestone.title} disabled={isPending} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`edit-description-${milestone.id}`}>Description</Label>
                        <Textarea id={`edit-description-${milestone.id}`} name="description" rows={2} maxLength={2000} defaultValue={milestone.description ?? ""} disabled={isPending} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`edit-status-${milestone.id}`}>Status</Label>
                          <Select id={`edit-status-${milestone.id}`} name="status" defaultValue={milestone.status} disabled={isPending}>
                            <option value="upcoming">Upcoming</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-dueDate-${milestone.id}`}>Due date</Label>
                          <Input id={`edit-dueDate-${milestone.id}`} name="dueDate" type="date" defaultValue={toDateInputValue(milestone.dueDate)} disabled={isPending} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-sortOrder-${milestone.id}`}>Order</Label>
                          <Input id={`edit-sortOrder-${milestone.id}`} name="sortOrder" type="number" min={0} defaultValue={milestone.sortOrder} disabled={isPending} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setEditingId(null)} disabled={isPending}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                          {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={milestone.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">{milestone.title}</span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      {milestone.description && (
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{milestone.description}</p>
                      )}
                      {milestone.dueDate && (
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          Due {new Date(milestone.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Select
                        aria-label="Change status"
                        value={milestone.status}
                        onChange={(e) => handleStatusChange(milestone.id, e.target.value)}
                        disabled={isPending}
                        className="h-9 w-auto text-xs"
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </Select>
                      <Button variant="ghost" size="sm" aria-label="Edit milestone" onClick={() => setEditingId(milestone.id)} disabled={isPending}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Delete milestone" onClick={() => handleDelete(milestone.id)} disabled={isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
