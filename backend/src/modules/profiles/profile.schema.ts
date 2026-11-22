import { z } from "zod";

const socialPlatformEnum = z.enum([
  "INSTAGRAM",
  "TIKTOK",
  "YOUTUBE",
  "FACEBOOK",
  "SNAPCHAT",
  "OTHER",
]);

// update Creator Profile
export const updateCreatorProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  avatarUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  city: z.string().min(2).optional(),
  country: z.string().default("Morocco").optional(),
  categories: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  collaborationTypes: z.array(z.string()).optional(),
});

// update Brand Profile
export const updateBrandProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  industry: z.string().optional(),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  city: z.string().min(2).optional(),
  country: z.string().default("Morocco").optional(),
  description: z.string().max(2000).optional(),
});

// add or update Social Account
export const socialAccountSchema = z.object({
  platform: socialPlatformEnum,
  handle: z.string().min(1, "Social handle is required"),
  profileUrl: z.string().url().optional(),
  followersCount: z.number().int().min(0, "Followers count must be positive"),
  engagementRate: z.number().min(0).max(100).optional(),
});

// add portfolio item
export const portfolioItemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  brandName: z.string().optional(),
  description: z.string().max(1000).optional(),
  mediaUrl: z.string().min(1, "Media URL is required"),
  thumbnailUrl: z.string().url().optional(),
  campaignUrl: z.string().url().optional(),
  platform: socialPlatformEnum.default("INSTAGRAM"),
});

export type UpdateCreatorProfileInput = z.infer<typeof updateCreatorProfileSchema>;
export type UpdateBrandProfileInput = z.infer<typeof updateBrandProfileSchema>;
export type SocialAccountInput = z.infer<typeof socialAccountSchema>;
export type PortfolioItemInput = z.infer<typeof portfolioItemSchema>;
