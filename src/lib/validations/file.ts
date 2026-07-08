import { z } from "zod";

export const fileStatusSchema = z.enum(["draft", "preview", "revision_requested", "approved", "final"]);

export const updateFileStatusSchema = z.object({
  fileId: z.string().min(1),
  status: fileStatusSchema,
});

export const requestRevisionSchema = z.object({
  fileId: z.string().min(1),
  note: z
    .string()
    .min(1, "Please describe what you would like changed.")
    .max(2000, "Revision note must be under 2000 characters"),
});

export type UpdateFileStatusData = z.infer<typeof updateFileStatusSchema>;
export type RequestRevisionData = z.infer<typeof requestRevisionSchema>;
