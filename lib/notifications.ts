import { prisma } from "@/lib/prisma";
import { socketService, NotificationData } from "@/lib/socket-server";

export type NotificationType = 
  | 'BOOKING_RECEIVED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_COMPLETED'
  | 'BOOKING_CANCELLED'
  | 'REVIEW_RECEIVED'
  | 'PAYMENT_RECEIVED'
  | 'VERIFICATION_APPROVED'
  | 'SYSTEM_ALERT'
  | 'MESSAGE_RECEIVED';

export interface CreateNotificationData {
  userId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async createNotification(data: CreateNotificationData): Promise<void> {
    try {
      // Save notification to database
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          senderId: data.senderId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data ? JSON.stringify(data.data) : null,
        },
      });

      // Send real-time notification
      const notificationData: NotificationData = {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data ? JSON.parse(notification.data) : null,
        createdAt: notification.createdAt.toISOString(),
      };

      await socketService.sendNotificationToUser(data.userId, notificationData);
      
      console.log(`📱 Notification created and sent: ${notification.title} to user ${data.userId}`);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true, readAt: new Date() },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async getUserNotifications(userId: string, limit: number = 20): Promise<any[]> {
    try {
      return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Specific notification types
  async notifyBookingReceived(providerId: string, customerId: string, serviceTitle: string): Promise<void> {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { name: true },
    });

    await this.createNotification({
      userId: providerId,
      senderId: customerId,
      type: 'BOOKING_RECEIVED',
      title: 'New Booking Request',
      message: `${customer?.name || 'A customer'} has requested to book your service: ${serviceTitle}`,
      data: { customerId, serviceTitle },
    });
  }

  async notifyBookingConfirmed(customerId: string, providerId: string, serviceTitle: string): Promise<void> {
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
      select: { name: true },
    });

    await this.createNotification({
      userId: customerId,
      senderId: providerId,
      type: 'BOOKING_CONFIRMED',
      title: 'Booking Confirmed',
      message: `${provider?.name || 'Service provider'} has confirmed your booking for ${serviceTitle}`,
      data: { providerId, serviceTitle },
    });
  }

  async notifyBookingCompleted(customerId: string, providerId: string, serviceTitle: string): Promise<void> {
    await this.createNotification({
      userId: customerId,
      senderId: providerId,
      type: 'BOOKING_COMPLETED',
      title: 'Service Completed',
      message: `Your service "${serviceTitle}" has been completed. Please leave a review!`,
      data: { providerId, serviceTitle },
    });
  }

  async notifyReviewReceived(providerId: string, customerId: string, rating: number): Promise<void> {
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      select: { name: true },
    });

    await this.createNotification({
      userId: providerId,
      senderId: customerId,
      type: 'REVIEW_RECEIVED',
      title: 'New Review Received',
      message: `${customer?.name || 'A customer'} left you a ${rating}-star review`,
      data: { customerId, rating },
    });
  }

  async notifyVerificationApproved(userId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'VERIFICATION_APPROVED',
      title: 'Account Verified',
      message: 'Congratulations! Your account has been verified. You can now access all features.',
    });
  }

  async notifySystemAlert(userId: string, title: string, message: string, data?: any): Promise<void> {
    await this.createNotification({
      userId,
      type: 'SYSTEM_ALERT',
      title,
      message,
      data,
    });
  }

  async broadcastToRole(role: string, title: string, message: string, data?: any): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: { role },
        select: { id: true },
      });

      // Create notifications in database for all users
      const notifications = await Promise.all(
        users.map(user =>
          prisma.notification.create({
            data: {
              userId: user.id,
              type: 'SYSTEM_ALERT',
              title,
              message,
              data: data ? JSON.stringify(data) : null,
            },
          })
        )
      );

      // Send real-time notifications
      const notificationData: NotificationData = {
        id: notifications[0]?.id || '',
        type: 'SYSTEM_ALERT',
        title,
        message,
        data,
        createdAt: new Date().toISOString(),
      };

      await socketService.broadcastToRole(role, notificationData);

      console.log(`📢 Broadcast notification sent to ${users.length} ${role} users`);
    } catch (error) {
      console.error('Error broadcasting to role:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();