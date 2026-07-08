import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120, "Name must be under 120 characters"),
  phone: z.string().trim().max(40, "Phone must be under 40 characters").optional().or(z.literal("")),
  company: z.string().trim().max(120, "Company must be under 120 characters").optional().or(z.literal("")),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

export const notificationPreferenceSchema = z.object({
  preference: z.enum(["all", "portal_only", "critical_only"]),
});
