import { z } from "zod";

export const setAdminActiveSchema = z.object({
  userId: z.string().min(1, "User is required"),
  active: z.enum(["true", "false"]),
});

export const adminUserIdSchema = z.object({
  userId: z.string().min(1, "User is required"),
});

export const promoteAdminSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
