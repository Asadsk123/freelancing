import { z } from "zod";

export const sendMessageSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(5000, "Message must be under 5000 characters"),
});

export type SendMessageData = z.infer<typeof sendMessageSchema>;
