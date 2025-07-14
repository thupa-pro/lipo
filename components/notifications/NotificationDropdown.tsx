"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  CreditCard,
  MessageSquare,
  Calendar,
  Star,
  Settings,
  MoreHorizontal,
  Eye,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Notification {
  id: string;
  type: "message" | "booking" | "payment" | "review" | "system" | "job_match";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high" | "urgent";
  persistent?: boolean;
  metadata?: {
    userId?: string;
    bookingId?: string;
    amount?: number;
    rating?: number;
  };
}

interface NotificationDropdownProps {
  className?: string;
  maxItems?: number;
  enableSound?: boolean;
}

// Simulated real-time notification service
class NotificationService {
  private listeners: Set<(notification: Notification) => void> = new Set();
  private interval: NodeJS.Timeout | null = null;

  subscribe(callback: (notification: Notification) => void) {
    this.listeners.add(callback);

    // Start simulation if first subscriber
    if (this.listeners.size === 1) {
      this.startSimulation();
    }

    return () => {
      this.listeners.delete(callback);

      // Stop simulation if no subscribers
      if (this.listeners.size === 0) {
        this.stopSimulation();
      }
    };
  }

  private startSimulation() {
    this.interval = setInterval(() => {
      if (Math.random() > 0.85) {
        // 15% chance every 10 seconds
        const mockNotification = this.generateMockNotification();
        this.listeners.forEach((callback) => callback(mockNotification));
      }
    }, 10000);
  }

  private stopSimulation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private generateMockNotification(): Notification {
    const types: Notification["type"][] = [
      "message",
      "booking",
      "payment",
      "review",
      "job_match",
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    const notifications = {
      message: {
        title: "New Message",
        message: "Customer inquiry about your services",
        priority: "medium" as const,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      booking: {
        title: "Booking Confirmed",
        message: "Your appointment has been confirmed for tomorrow",
        priority: "high" as const,
      },
      payment: {
        title: "Payment Received",
        message: "You received $75.00 for completed service",
        priority: "high" as const,
        metadata: { amount: 75 },
      },
      review: {
        title: "New Review",
        message: "You received a 5-star review",
        priority: "medium" as const,
        metadata: { rating: 5 },
      },
      job_match: {
        title: "Job Match",
        message: "New job matches your skills in your area",
        priority: "medium" as const,
      },
    };

    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      ...notifications[type],
      timestamp: new Date(),
      read: false,
    };
  }
}

const notificationService = new NotificationService();

export function NotificationDropdown({
  className,
  maxItems = 5,
  enableSound = true,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: "1",
        type: "payment",
        title: "Payment Received",
        message: "You received $125.00 for house cleaning service",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: "high",
        metadata: { amount: 125 },
      },
      {
        id: "2",
        type: "booking",
        title: "New Booking Request",
        message: "Sarah M. wants to book your cleaning service for tomorrow",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        avatar: "/placeholder.svg?height=40&width=40",
        priority: "high",
        actionUrl: "/bookings/new",
      },
      {
        id: "3",
        type: "review",
        title: "New 5-Star Review",
        message:
          "Customer left: 'Excellent service! Very professional and thorough.'",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        priority: "medium",
        metadata: { rating: 5 },
      },
      {
        id: "4",
        type: "message",
        title: "New Message",
        message: "Customer inquiry about weekend availability",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: "medium",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ];

    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter((n) => !n.read).length);
  }, []);

  // Real-time notifications subscription
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((newNotification) => {
      setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]); // Keep latest 20
      setUnreadCount((prev) => prev + 1);
      setLastActivity(new Date());

      // Play notification sound
      if (soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      }

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        const browserNotification = new Notification(newNotification.title, {
          body: newNotification.message,
          icon: "/placeholder.svg?height=64&width=64",
          tag: newNotification.id,
          requireInteraction: newNotification.priority === "urgent",
        });

        // Auto close after 5 seconds
        setTimeout(() => browserNotification.close(), 5000);
      }

      // Haptic feedback on mobile
      if ("vibrate" in navigator && newNotification.priority === "high") {
        navigator.vibrate([200, 100, 200]);
      }
    });

    return unsubscribe;
  }, [soundEnabled]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Initialize audio
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJmrXZ2hrJedbZSsrJKlrJGarJOUrJKjrI+hr6COhbaFfQKAhU5+aJGhgF1xjoaFfQKAhU5+aJGhgF1x",
    ); // Simple notification beep
  }, []);

  const getNotificationIcon = (
    type: Notification["type"],
    priority: string,
  ) => {
    const baseClass = "w-4 h-4";
    const urgentClass = priority === "urgent" ? "animate-pulse" : "";

    switch (type) {
      case "payment":
        return (
          <CreditCard
            className={cn(baseClass, "text-emerald-600", urgentClass)}
          />
        );
      case "booking":
        return (
          <Calendar className={cn(baseClass, "text-blue-600", urgentClass)} />
        );
      case "message":
        return (
          <MessageSquare
            className={cn(baseClass, "text-purple-600", urgentClass)}
          />
        );
      case "review":
        return (
          <Star className={cn(baseClass, "text-yellow-600", urgentClass)} />
        );
      case "job_match":
        return (
          <CheckCircle
            className={cn(baseClass, "text-green-600", urgentClass)}
          />
        );
      default:
        return <Bell className={cn(baseClass, "text-gray-600", urgentClass)} />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  }, [toast]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notificationToDelete = prev.find((n) => n.id === id);
      const filtered = prev.filter((notif) => notif.id !== id);

      // Update unread count if deleting unread notification
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      }

      return filtered;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    toast({
      title: "All notifications cleared",
      duration: 2000,
    });
  }, [toast]);

  const displayNotifications = notifications.slice(0, maxItems);
  const hasMore = notifications.length > maxItems;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black",
              className,
            )}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            aria-expanded={isOpen}
          >
            <Bell
              className={cn(
                "w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform",
                unreadCount > 0 && "animate-pulse",
              )}
            />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-white dark:border-black animate-pulse shadow-lg"
                aria-label={`${unreadCount} unread notifications`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-96 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl border-slate-200/50 dark:border-white/20 shadow-2xl"
          align="end"
          sideOffset={8}
        >
          {/* Header */}
          <DropdownMenuLabel className="px-4 py-3 border-b border-slate-200/50 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="font-semibold">Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="h-8 w-8 p-0"
                  title={soundEnabled ? "Disable sound" : "Enable sound"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3 h-3" />
                  ) : (
                    <VolumeX className="w-3 h-3" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-8 px-2 text-xs"
                        onClick={markAllAsRead}
                      >
                        <Check className="w-3 h-3 mr-2" />
                        Mark all as read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-8 px-2 text-xs"
                      onClick={clearAllNotifications}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Clear all
                    </Button>
                    <DropdownMenuSeparator />
                    <Link href="/settings?tab=notifications">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-8 px-2 text-xs"
                      >
                        <Settings className="w-3 h-3 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </DropdownMenuLabel>

          {/* Notifications List */}
          <ScrollArea className="h-96">
            {displayNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mb-3" />
                <h3 className="font-medium text-sm mb-1">No notifications</h3>
                <p className="text-xs text-muted-foreground">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="py-2">
                {displayNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        "px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group",
                        !notification.read &&
                          "bg-blue-50/50 dark:bg-blue-950/20",
                      )}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {notification.avatar ? (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={notification.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                                {notification.title.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                              {getNotificationIcon(
                                notification.type,
                                notification.priority,
                              )}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4
                                  className={cn(
                                    "text-sm font-medium truncate",
                                    !notification.read && "font-semibold",
                                  )}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>

                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>

                                {notification.priority === "urgent" && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs px-1.5 py-0.5"
                                  >
                                    Urgent
                                  </Badge>
                                )}

                                {notification.priority === "high" && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                                  >
                                    High
                                  </Badge>
                                )}

                                {notification.metadata?.amount && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0.5 text-emerald-600 border-emerald-600"
                                  >
                                    ${notification.metadata.amount}
                                  </Badge>
                                )}

                                {notification.metadata?.rating && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0.5 text-yellow-600 border-yellow-600"
                                  >
                                    {notification.metadata.rating}★
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.persistent && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                                  title="Delete notification"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < displayNotifications.length - 1 && (
                      <Separator className="mx-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Real-time updates</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasMore && (
                      <span className="text-xs text-muted-foreground">
                        +{notifications.length - maxItems} more
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 px-3 text-xs"
                    >
                      <Link href="/notifications">View all</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden audio element for notification sounds */}
      <audio ref={audioRef} preload="auto" />
    </>
  );
}
