import type { Request, Response, NextFunction } from "express";
import { notificationService } from "./notification.service.js";
import { notificationQuerySchema } from "./notification.schema.js";

export const notificationController = {
  // get all notifications for authenticated user
  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const query = notificationQuerySchema.parse(req.query);

      const result = await notificationService.getUserNotifications(userId, query);

      res.status(200).json({
        success: true,
        data: result.notifications,
        unreadCount: result.unreadCount,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to fetch notifications",
      });
    }
  },

  // mark single notification as read
  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const notificationId = req.params.id as string;

      const updated = await notificationService.markAsRead(userId, notificationId);

      res.status(200).json({
        success: true,
        message: "notification marked as read",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to update notification",
      });
    }
  },

  // mark all notifications as read
  async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;

      await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: "all notifications marked as read",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to mark all notifications as read",
      });
    }
  },

  // delete notification
  async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const notificationId = req.params.id as string;

      await notificationService.deleteNotification(userId, notificationId);

      res.status(200).json({
        success: true,
        message: "notification deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "failed to delete notification",
      });
    }
  },
};
