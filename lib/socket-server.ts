import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export interface ServerToClientEvents {
  notification: (data: NotificationData) => void;
  booking_update: (data: BookingUpdate) => void;
  message: (data: MessageData) => void;
}

export interface ClientToServerEvents {
  join_room: (userId: string) => void;
  leave_room: (userId: string) => void;
  mark_notification_read: (notificationId: string) => void;
}

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  createdAt: string;
}

export interface BookingUpdate {
  bookingId: string;
  status: string;
  message: string;
}

export interface MessageData {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: string;
}

export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer<ClientToServerEvents, ServerToClientEvents> | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(server: HTTPServer): void {
    this.io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log(`🔌 User connected: ${socket.id}`);

      socket.on("join_room", (userId: string) => {
        socket.join(`user:${userId}`);
        console.log(`👤 User ${userId} joined their room`);
      });

      socket.on("leave_room", (userId: string) => {
        socket.leave(`user:${userId}`);
        console.log(`👤 User ${userId} left their room`);
      });

      socket.on("mark_notification_read", async (notificationId: string) => {
        try {
          await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true, readAt: new Date() },
          });
          console.log(`📖 Notification ${notificationId} marked as read`);
        } catch (error) {
          console.error("Error marking notification as read:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
      });
    });
  }

  public async sendNotificationToUser(
    userId: string,
    notification: NotificationData
  ): Promise<void> {
    if (!this.io) {
      console.warn("Socket.IO not initialized");
      return;
    }

    this.io.to(`user:${userId}`).emit("notification", notification);
    console.log(`📱 Notification sent to user ${userId}: ${notification.title}`);
  }

  public async sendBookingUpdate(
    userId: string,
    update: BookingUpdate
  ): Promise<void> {
    if (!this.io) {
      console.warn("Socket.IO not initialized");
      return;
    }

    this.io.to(`user:${userId}`).emit("booking_update", update);
    console.log(`📅 Booking update sent to user ${userId}: ${update.status}`);
  }

  public async broadcastToRole(
    role: string,
    notification: NotificationData
  ): Promise<void> {
    if (!this.io) {
      console.warn("Socket.IO not initialized");
      return;
    }

    // Get all users with the specified role
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true },
    });

    // Send notification to each user
    users.forEach((user) => {
      this.io?.to(`user:${user.id}`).emit("notification", notification);
    });

    console.log(`📢 Broadcast sent to ${users.length} ${role} users`);
  }
}

export const socketService = SocketService.getInstance();