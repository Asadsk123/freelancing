import { z } from "zod";

export const submitReviewSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  rating: z.coerce.number().int().min(1, "Please choose a rating").max(5),
  testimonial: z
    .string()
    .trim()
    .max(2000, "Testimonial must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});

export type SubmitReviewData = z.infer<typeof submitReviewSchema>;
