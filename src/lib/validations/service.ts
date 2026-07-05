import { z } from "zod";

export const createServiceSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required").max(200, "Name must be under 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  shortDescription: z
    .string()
    .min(1, "Short description is required")
    .max(500, "Short description must be under 500 characters"),
  fullDescription: z.string().max(10000).optional().or(z.literal("")),
  icon: z.string().max(100).optional().or(z.literal("")),
  features: z.string().max(5000).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type CreateServiceData = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial().extend({
  serviceId: z.string().min(1),
});

export type UpdateServiceData = z.infer<typeof updateServiceSchema>;
