import { z } from "zod";

export const inquiryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be under 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .max(30, "Phone must be under 30 characters")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company name must be under 100 characters")
    .optional()
    .or(z.literal("")),
  service: z.string().optional().or(z.literal("")),
  budget: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be under 5,000 characters"),
});

export type InquiryFormData = z.infer<typeof inquiryFormSchema>;
