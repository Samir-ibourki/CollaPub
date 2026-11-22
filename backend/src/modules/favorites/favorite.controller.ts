import type { Request, Response, NextFunction } from "express";
import { favoriteService } from "./favorite.service.js";
import { favoriteQuerySchema } from "./favorite.schema.js";

export const favoriteController = {
  // toggle creator favorite
  async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const creatorProfileId = req.params.creatorProfileId as string;

      const result = await favoriteService.toggleFavorite(userId, creatorProfileId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          isFavorited: result.isFavorited,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to update favorites",
      });
    }
  },

  // list brand favorites
  async getMyFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const query = favoriteQuerySchema.parse(req.query);

      const result = await favoriteService.getMyFavorites(userId, query);

      res.status(200).json({
        success: true,
        data: result.favorites,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to fetch favorites",
      });
    }
  },

  // check if creator is in favorites
  async checkIsFavorited(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const creatorProfileId = req.params.creatorProfileId as string;

      const result = await favoriteService.checkIsFavorited(userId, creatorProfileId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to check favorite status",
      });
    }
  },
};
