import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { requireAdmin } from "@/lib/auth/guards";
import { projectRepository } from "@/lib/repositories/project";
import { fileRepository } from "@/lib/repositories/file";
import { auditLogRepository } from "@/lib/repositories/audit-log";
import { storage, buildStorageKey, MAX_UPLOAD_BYTES } from "@/lib/storage";
import { email as mailer } from "@/lib/email";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

/**
 * Admin file upload (multipart). A route handler (not a server action) so the
 * client can report upload progress and stream larger deliverables.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ success: false, error: "Database not connected." }, { status: 503 });
  }

  const { id: projectId } = await params;

  try {
    const project = await projectRepository.findByIdWithDetails(projectId);
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: `File is too large (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB).` },
        { status: 413 },
      );
    }

    const fileName = file.name || "upload";
    const mimeType = file.type || "application/octet-stream";
    const key = buildStorageKey(projectId, fileName);
    const bytes = new Uint8Array(await file.arrayBuffer());

    await storage.put(key, bytes, mimeType);

    const created = await fileRepository.create({
      projectId,
      uploadedBy: auth.session.userId,
      fileName,
      mimeType,
      fileSize: file.size,
      originalKey: key,
      status: "preview",
    });

    await auditLogRepository.record({
      userId: auth.session.userId,
      action: "file.uploaded",
      entityType: "file",
      entityId: created.id,
      metadata: { fileName, projectId, fileSize: file.size },
    });

    // Best-effort notification to the client.
    await mailer.fileUploaded(project.clientEmail, project.clientName, project.title, fileName);

    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath(`/projects/${projectId}`);

    return NextResponse.json({ success: true, fileId: created.id });
  } catch (err) {
    console.error("Failed to upload file:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
