"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/shared/form-error";
import { toast, Toaster } from "@/components/ui/toast";
import { useUnsavedChangesWarning } from "@/lib/hooks/use-unsaved-changes-warning";
import { createProject } from "../actions";

type Option = { id: string; name: string };

export function ProjectForm({ clients, services }: { clients: Option[]; services: Option[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useUnsavedChangesWarning(dirty && !isPending);

  function markDirty<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
    };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("title", title);
    fd.set("clientId", clientId);
    fd.set("serviceId", serviceId);
    fd.set("description", description);
    fd.set("startDate", startDate);
    fd.set("targetDate", targetDate);
    startTransition(async () => {
      const res = await createProject(fd);
      if (res.success) {
        setDirty(false);
        toast.success("Project created.");
        router.push("/admin/projects");
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
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={title}
                onChange={(e) => markDirty(setTitle)(e.target.value)}
                placeholder="Project title"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-client">Client</Label>
              <Select
                id="project-client"
                value={clientId}
                onChange={(e) => markDirty(setClientId)(e.target.value)}
                disabled={isPending}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              rows={3}
              autoResize
              value={description}
              onChange={(e) => markDirty(setDescription)(e.target.value)}
              placeholder="What will be delivered..."
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="project-service">Service</Label>
              <Select
                id="project-service"
                value={serviceId}
                onChange={(e) => markDirty(setServiceId)(e.target.value)}
                disabled={isPending}
              >
                <option value="">No service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-start">Start date</Label>
              <Input
                id="project-start"
                type="date"
                value={startDate}
                onChange={(e) => markDirty(setStartDate)(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-target">Target date</Label>
              <Input
                id="project-target"
                type="date"
                value={targetDate}
                onChange={(e) => markDirty(setTargetDate)(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
