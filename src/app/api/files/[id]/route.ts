import { NextResponse } from "next/server";
import { hasDatabase } from "@/db";
import { getSession } from "@/lib/auth/session";
import { fileRepository } from "@/lib/repositories/file";
import { projectRepository } from "@/lib/repositories/project";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

const INLINE_TYPES = /^(image\/|video\/|audio\/|application\/pdf|text\/plain)/;

/**
 * Serves a stored file with an ownership check: admins can access everything,
 * clients only files on their own projects — and never internal drafts.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ error: "Database not connected." }, { status: 503 });
  }

  const { id } = await params;

  try {
    const file = await fileRepository.findById(id);
    if (!file) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    if (session.role !== "admin") {
      const project = await projectRepository.findByIdWithDetails(file.projectId);
      if (!project || project.clientId !== session.userId || file.status === "draft") {
        // 404 (not 403) so non-owners cannot probe for file existence.
        return NextResponse.json({ error: "File not found." }, { status: 404 });
      }
    }

    const object = await storage.get(file.originalKey);
    if (!object) {
      return NextResponse.json({ error: "File content is missing from storage." }, { status: 404 });
    }

    const disposition = INLINE_TYPES.test(file.mimeType) ? "inline" : "attachment";
    const safeName = file.fileName.replace(/["\\\r\n]/g, "_");

    return new NextResponse(Buffer.from(object.body), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Length": String(object.contentLength),
        "Content-Disposition": `${disposition}; filename="${safeName}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Failed to serve file:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
