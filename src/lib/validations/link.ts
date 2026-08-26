import { z } from "zod";

const ALLOWED_PROTOCOLS = /^https?:\/\//i;

export const submitLinkSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .max(2000, "URL is too long")
    .refine((v) => ALLOWED_PROTOCOLS.test(v), "URL must start with http:// or https://"),
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(200, "Label must be under 200 characters"),
  linkType: z.enum(["image", "video", "document", "other"]).default("other"),
  note: z.string().trim().max(1000, "Note must be under 1000 characters").optional().or(z.literal("")),
});

export type SubmitLinkData = z.infer<typeof submitLinkSchema>;
