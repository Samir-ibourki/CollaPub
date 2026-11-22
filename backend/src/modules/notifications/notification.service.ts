import prisma from "../../prisma/client.js";
import type { NotificationQueryParams } from "./notification.schema.js";

export const notificationService = {
  // get user notifications with unread counter
  async getUserNotifications(userId: string, query: NotificationQueryParams) {
    const { isRead, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    // filter by read status if provided
    if (isRead !== undefined) {
      where.isRead = isRead === "true";
    }

    const [total, unreadCount, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  // mark a single notification as read
  async markAsRead(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("unauthorized to access this notification");
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },

  // mark all notifications as read
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  },

  // delete a notification
  async deleteNotification(userId: string, notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new Error("notification not found");
    }

    if (notification.userId !== userId) {
      throw new Error("unauthorized to delete this notification");
    }

    return prisma.notification.delete({
      where: { id: notificationId },
    });
  },
};
