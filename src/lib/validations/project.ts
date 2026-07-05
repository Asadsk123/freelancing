import { z } from "zod";

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  clientId: z.string().min(1, "Client is required"),
  serviceId: z.string().optional().or(z.literal("")),
  description: z
    .string()
    .max(5000, "Description must be under 5,000 characters")
    .optional()
    .or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  targetDate: z.string().optional().or(z.literal("")),
});

export type CreateProjectData = z.infer<typeof createProjectSchema>;

export const updateProjectStatusSchema = z.object({
  projectId: z.string().min(1),
  status: z.enum(["pending", "in_progress", "on_hold", "completed", "cancelled"]),
});

export type UpdateProjectStatusData = z.infer<typeof updateProjectStatusSchema>;
