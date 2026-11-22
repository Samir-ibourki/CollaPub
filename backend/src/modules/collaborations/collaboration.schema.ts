import { z } from "zod";

const collaborationStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "NEGOTIATING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);


export const createCollaborationSchema = z.object({
  creatorProfileId: z.string().min(1, "creator profile id is required"),
  title: z.string().min(3, "title must be at least 3 characters").max(200),
  description: z.string().min(10, "description must be at least 10 characters"),
  deliverables: z
    .array(z.string().min(1))
    .min(1, "at least one deliverable is required"),
  proposedBudget: z.number().positive("budget must be positive").optional(),
  deadline: z.string().datetime().optional(),
});

// schema to update collaboration status
export const updateCollaborationStatusSchema = z.object({
  status: collaborationStatusEnum,
});

// schema for updating proposal during negotiation
export const updateCollaborationProposalSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).optional(),
  deliverables: z.array(z.string().min(1)).min(1).optional(),
  proposedBudget: z.number().positive().optional(),
  deadline: z.string().datetime().optional(),
});

// query filters schema for listing user collaborations
export const collaborationQuerySchema = z.object({
  status: collaborationStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});


export type CreateCollaborationInput = z.infer<typeof createCollaborationSchema>;
export type UpdateCollaborationStatusInput = z.infer<
  typeof updateCollaborationStatusSchema
>;
export type UpdateCollaborationProposalInput = z.infer<
  typeof updateCollaborationProposalSchema
>;
export type CollaborationQueryParams = z.infer<typeof collaborationQuerySchema>;
