import { z } from "zod";

export const milestoneStatusValues = ["upcoming", "in_progress", "completed"] as const;

export const createMilestoneSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().trim().max(2000, "Description must be under 2000 characters").optional().or(z.literal("")),
  status: z.enum(milestoneStatusValues).default("upcoming"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  dueDate: z.string().optional().or(z.literal("")),
});

export type CreateMilestoneData = z.infer<typeof createMilestoneSchema>;

export const updateMilestoneSchema = z.object({
  milestoneId: z.string().min(1, "Milestone ID is required"),
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  description: z.string().trim().max(2000, "Description must be under 2000 characters").optional().or(z.literal("")),
  status: z.enum(milestoneStatusValues),
  sortOrder: z.coerce.number().int().min(0).default(0),
  dueDate: z.string().optional().or(z.literal("")),
});

export type UpdateMilestoneData = z.infer<typeof updateMilestoneSchema>;

export const updateMilestoneStatusSchema = z.object({
  milestoneId: z.string().min(1, "Milestone ID is required"),
  status: z.enum(milestoneStatusValues),
});
