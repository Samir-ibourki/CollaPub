import { z } from "zod";

export const notificationQuerySchema = z.object({
  isRead: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// inferred typescript types
export type NotificationQueryParams = z.infer<typeof notificationQuerySchema>;
