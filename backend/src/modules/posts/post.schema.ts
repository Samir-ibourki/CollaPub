import { z } from "zod";

const mediaTypeEnum = z.enum(["IMAGE", "VIDEO", "CAROUSEL"]);

// create a new commercial post
export const createPostSchema = z.object({
  title: z.string().max(200).optional(),
  caption: z.string().min(1, "caption is required").max(3000),
  mediaUrls: z
    .array(z.string().min(1))
    .min(1, "at least one media url is required"),
  mediaType: mediaTypeEnum.default("IMAGE"),
  category: z.string().min(2, "category must be at least 2 characters"),
  city: z.string().min(2).optional(),
  tags: z.array(z.string()).default([]),
});

// update an existing post
export const updatePostSchema = z.object({
  title: z.string().max(200).optional(),
  caption: z.string().min(1).max(3000).optional(),
  mediaUrls: z.array(z.string().min(1)).min(1).optional(),
  mediaType: mediaTypeEnum.optional(),
  category: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  tags: z.array(z.string()).optional(),
});

// query filters schema for the discovery feed
export const feedQuerySchema = z.object({
  role: z.enum(["CREATOR", "BRAND"]).optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type FeedQueryParams = z.infer<typeof feedQuerySchema>;
