import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Enter all 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type OtpFormData = z.infer<typeof otpSchema>;
