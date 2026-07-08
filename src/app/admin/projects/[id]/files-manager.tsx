"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Trash2, UploadCloud } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast, Toaster } from "@/components/ui/toast";
import { formatDate, formatFileSize } from "@/lib/utils/formatting";
import { updateFileStatus, deleteFile } from "./actions";

type FileStatus = "draft" | "preview" | "revision_requested" | "approved" | "final";

type ProjectFile = {
  id: string;
  fileName: string;
  fileSize: number;
  version: number;
  status: FileStatus;
  revisionNote: string | null;
  uploaderName: string;
  createdAt: Date;
};

const statusBadge: Record<FileStatus, { label: string; variant: "success" | "warning" | "secondary" | "default" }> = {
  draft: { label: "Draft", variant: "secondary" },
  preview: { label: "Preview", variant: "default" },
  revision_requested: { label: "Revision Requested", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  final: { label: "Final", variant: "success" },
};

const statusOptions: { value: FileStatus; label: string }[] = [
  { value: "draft", label: "Draft (internal)" },
  { value: "preview", label: "Preview" },
  { value: "revision_requested", label: "Revision Requested" },
  { value: "approved", label: "Approved" },
  { value: "final", label: "Final" },
];

export function FilesManager({ projectId, files }: { projectId: string; files: ProjectFile[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectFile | null>(null);

  function upload(file: File) {
    if (uploadProgress !== null) return;
    setUploadProgress(0);

    const fd = new FormData();
    fd.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/projects/${projectId}/files`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setUploadProgress(null);
      try {
        const res = JSON.parse(xhr.responseText) as { success: boolean; error?: string };
        if (xhr.status < 400 && res.success) {
          toast.success(`Uploaded ${file.name}.`);
          router.refresh();
        } else {
          toast.error(res.error ?? "Upload failed. Please try again.");
        }
      } catch {
        toast.error("Upload failed. Please try again.");
      }
    };
    xhr.onerror = () => {
      setUploadProgress(null);
      toast.error("Upload failed. Check your connection and try again.");
    };
    xhr.send(fd);
  }

  function handleFiles(list: FileList | null) {
    const file = list?.[0];
    if (file) upload(file);
  }

  function handleStatusChange(file: ProjectFile, status: FileStatus) {
    const fd = new FormData();
    fd.set("fileId", file.id);
    fd.set("status", status);
    startTransition(async () => {
      const res = await updateFileStatus(fd);
      if (res.success) {
        toast.success("File status updated.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const fd = new FormData();
    fd.set("fileId", deleteTarget.id);
    startTransition(async () => {
      const res = await deleteFile(fd);
      if (res.success) {
        toast.success("File deleted.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Card>
      <Toaster />
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          Deliverables shared with the client. New uploads start in Preview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a file"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
            dragOver
              ? "border-[var(--primary)] bg-[var(--accent)]"
              : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]"
          }`}
        >
          <UploadCloud className="h-6 w-6 text-[var(--primary)]" />
          <p className="text-sm font-medium text-[var(--foreground)]">
            Drag &amp; drop a file, or click to browse
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">Up to 50 MB per file</p>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {uploadProgress !== null && (
          <div className="space-y-1.5">
            <Progress value={uploadProgress} aria-label="Upload progress" />
            <p className="text-xs text-[var(--muted-foreground)]">Uploading... {uploadProgress}%</p>
          </div>
        )}

        {files.length === 0 ? (
          <div className="py-6">
            <EmptyState
              icon={FileText}
              title="No files yet"
              description="Upload deliverables above to share them with the client."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => {
              const badge = statusBadge[file.status];
              return (
                <div
                  key={file.id}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]">
                        <FileText className="h-4 w-4 text-[var(--primary)]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">{file.fileName}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {formatFileSize(file.fileSize)} · v{file.version} · {file.uploaderName} · {formatDate(file.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <Select
                        value={file.status}
                        onChange={(e) => handleStatusChange(file, e.target.value as FileStatus)}
                        disabled={isPending}
                        aria-label={`Status for ${file.fileName}`}
                        className="h-8 w-auto py-1 text-xs"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button asChild variant="ghost" size="icon" aria-label={`Download ${file.fileName}`}>
                            <a href={`/api/files/${file.id}`} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${file.fileName}`}
                            onClick={() => setDeleteTarget(file)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  {file.status === "revision_requested" && file.revisionNote && (
                    <p className="mt-3 rounded-[var(--radius-md)] bg-[var(--muted)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
                      Client note: {file.revisionNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete this file?"
        description={`“${deleteTarget?.fileName ?? ""}” will be permanently removed for you and the client. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}
