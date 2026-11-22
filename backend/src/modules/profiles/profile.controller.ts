import type { Request, Response, NextFunction } from "express";
import { profileService } from "./profile.service.js";
import type {
  UpdateCreatorProfileInput,
  UpdateBrandProfileInput,
  SocialAccountInput,
  PortfolioItemInput,
} from "./profile.schema.js";

export const profileController = {

    async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const role = req.user!.role;

      if (role === "CREATOR") {
        const profile = await profileService.getCreatorProfileByUserId(userId);
        res.status(200).json({ success: true, data: profile });
      } else {
        const profile = await profileService.getBrandProfileByUserId(userId);
        res.status(200).json({ success: true, data: profile });
      }
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Profile not found",
      });
    }
  },

  // update creator profile
  async updateCreatorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const input: UpdateCreatorProfileInput = req.body;
      const updated = await profileService.updateCreatorProfile(userId, input);

      res.status(200).json({
        success: true,
        message: "Creator profile updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update profile",
      });
    }
  },

  // add / update Social Account
  async upsertSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const input: SocialAccountInput = req.body;
      const account = await profileService.upsertSocialAccount(userId, input);

      res.status(200).json({
        success: true,
        message: "Social account saved successfully",
        data: account,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to save social account",
      });
    }
  },

  // delete social account
  async deleteSocialAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accountId = req.params.id as string;
      await profileService.deleteSocialAccount(userId, accountId);

      res.status(200).json({
        success: true,
        message: "Social account deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete social account",
      });
    }
  },

  // add portfolio item
  async addPortfolioItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const input: PortfolioItemInput = req.body;
      const item = await profileService.addPortfolioItem(userId, input);

      res.status(201).json({
        success: true,
        message: "Portfolio item added successfully",
        data: item,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to add portfolio item",
      });
    }
  },

  // delete portfolio item
  async deletePortfolioItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const itemId = req.params.id as string;
      await profileService.deletePortfolioItem(userId, itemId);

      res.status(200).json({
        success: true,
        message: "Portfolio item deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to delete portfolio item",
      });
    }
  },

  // update brand profile
  async updateBrandProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const input: UpdateBrandProfileInput = req.body;
      const updated = await profileService.updateBrandProfile(userId, input);

      res.status(200).json({
        success: true,
        message: "Brand profile updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update brand profile",
      });
    }
  },

  // Public Profile: Creator
  async getPublicCreator(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const creatorId = req.params.id as string;
      const profile = await profileService.getPublicCreatorById(creatorId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Creator not found",
      });
    }
  },

  // public profile: brand
  async getPublicBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brandId = req.params.id as string;
      const profile = await profileService.getPublicBrandById(brandId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Brand not found",
      });
    }
  },
};
