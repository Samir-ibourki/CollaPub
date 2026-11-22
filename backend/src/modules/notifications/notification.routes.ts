import { Router } from "express";
import { notificationController } from "./notification.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const notificationRouter: Router = Router();

// all notification routes require authentication
notificationRouter.use(authenticate);

// list notifications
notificationRouter.get("/", notificationController.getNotifications);

// mark all notifications as read
notificationRouter.patch("/read-all", notificationController.markAllAsRead);

// mark single notification as read
notificationRouter.patch("/:id/read", notificationController.markAsRead);

// delete notification
notificationRouter.delete("/:id", notificationController.deleteNotification);

export default notificationRouter;
