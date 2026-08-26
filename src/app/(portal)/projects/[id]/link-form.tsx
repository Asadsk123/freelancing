"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/shared/form-error";
import { submitProjectLink } from "./link-actions";

type State = { success: boolean; error?: string } | null;

export function LinkForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState<State, FormData>(
    submitProjectLink,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="link-label">Label</Label>
          <Input
            id="link-label"
            name="label"
            placeholder="e.g. Brand logo, Reference site, Brief PDF"
            maxLength={200}
            required
            disabled={isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="link-type">Type</Label>
          <Select id="link-type" name="linkType" defaultValue="other" disabled={isPending}>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="other">Other / Link</option>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link-url">URL</Label>
        <Input
          id="link-url"
          name="url"
          type="url"
          placeholder="https://"
          maxLength={2000}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link-note">Note (optional)</Label>
        <Textarea
          id="link-note"
          name="note"
          rows={2}
          maxLength={1000}
          placeholder="Any context or instructions..."
          disabled={isPending}
        />
      </div>

      {state && !state.success && state.error && <FormError message={state.error} />}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add Link"}
        </Button>
      </div>
    </form>
  );
}
