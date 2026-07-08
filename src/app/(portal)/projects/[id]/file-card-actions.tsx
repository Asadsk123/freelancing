"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/shared/form-error";
import { toast } from "@/components/ui/toast";
import { requestFileRevision } from "./file-actions";

/** Download + request-revision controls on a portal file card. */
export function FileCardActions({
  fileId,
  status,
}: {
  fileId: string;
  status: "draft" | "preview" | "revision_requested" | "approved" | "final";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const canRequestRevision = status === "preview" || status === "approved";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData();
    fd.set("fileId", fileId);
    fd.set("note", note);
    startTransition(async () => {
      const res = await requestFileRevision(fd);
      if (res.success) {
        toast.success("Revision requested — the team has been notified.");
        setOpen(false);
        setNote("");
        router.refresh();
      } else {
        setError(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={`/api/files/${fileId}`} target="_blank" rel="noopener noreferrer">
            <Download className="h-3.5 w-3.5" /> Download
          </a>
        </Button>
        {canRequestRevision && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            disabled={isPending}
          >
            <PenLine className="h-3.5 w-3.5" /> Request revision
          </Button>
        )}
      </div>

      {open && canRequestRevision && (
        <form onSubmit={handleSubmit} className="space-y-2">
          {error && <FormError message={error} />}
          <Textarea
            rows={2}
            maxLength={2000}
            autoResize
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tell us what you'd like changed..."
            disabled={isPending}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Sending..." : "Send request"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
