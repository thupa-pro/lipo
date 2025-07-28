import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, X, Check, AlertCircle, CreditCard, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "payment"
    | "booking"
    | "message"
    | "review";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high" | "urgent";
  persistent?: boolean;
}

interface NotificationSystemProps {
  className?: string;
}

export function NotificationSystem({ className }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "payment",
        title: "Payment Received",
        message: "You received $125.00 for house cleaning service",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        priority: "high",
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
      },
      {
        id: "3",
        type: "review",
        title: "New 5-Star Review",
        message: '"Excellent service! Very professional and thorough."',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
        priority: "medium",
      },
      {
        id: "4",
        type: "message",
        title: "New Message",
        message: "Customer inquiry about weekend availability",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: "medium",
      },
      {
        id: "5",
        type: "info",
        title: "Security Update",
        message: "Your account security has been enhanced with new encryption",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: true,
        priority: "low",
        persistent: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);

    // Simulate new notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? "message" : "booking",
        title: Math.random() > 0.5 ? "New Message" : "Booking Update",
        message: "Real-time notification simulation",
        timestamp: new Date(),
        read: false,
        priority: "medium",
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
      setUnreadCount((prev) => prev + 1);

      // Browser notification with better options
      if (Notification.permission === "granted") {
        const browserNotification = new Notification(newNotification.title, {
          body: newNotification.message,
          icon: "/placeholder.svg?height=64&width=64",
          badge: "/placeholder.svg?height=32&width=32",
          tag: newNotification.id,
          requireInteraction: newNotification.priority === "urgent",
          silent: false,
          timestamp: Date.now(),
        });

        // Auto close after 5 seconds unless urgent
        if (newNotification.priority !== "urgent") {
          setTimeout(() => browserNotification.close(), 5000);
        }

        // Handle click events
        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
          if (newNotification.actionUrl) {
            window.location.href = newNotification.actionUrl;
          }
        };
      }

      // Enhanced haptic feedback based on priority
      if (navigator.vibrate) {
        switch (newNotification.priority) {
          case "urgent":
            navigator.vibrate([300, 100, 300, 100, 300]);
            break;
          case "high":
            navigator.vibrate([200, 100, 200]);
            break;
          default:
            navigator.vibrate([100]);
        }
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconProps = { className: "w-5 h-5" };

    switch (type) {
      case "payment":
        return (
          <CreditCard {...iconProps} className="w-5 h-5 text-emerald-600" />
        );
      case "booking":
        return <BusinessIcons.Calendar {...iconProps} className="w-5 h-5 text-blue-600" / />;
      case "message":
        return (
          <OptimizedIcon name="MessageSquare" {...iconProps} className="w-5 h-5 text-purple-600" />
        );
      case "review":
        return <OptimizedIcon name="Star" {...iconProps} className="w-5 h-5 text-yellow-600" />;
      case "success":
        return (
          <UIIcons.CheckCircle {...iconProps} className="w-5 h-5 text-emerald-600" / />
        );
      case "warning":
        return (
          <AlertCircle {...iconProps} className="w-5 h-5 text-yellow-600" />
        );
      case "error":
        return <AlertCircle {...iconProps} className="w-5 h-5 text-red-600" />;
      default:
        return <Info {...iconProps} className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "payment":
        return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/10";
      case "booking":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/10";
      case "message":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-950/10";
      case "review":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/10";
      case "success":
        return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/10";
      case "warning":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/10";
      case "error":
        return "border-l-red-500 bg-red-50 dark:bg-red-950/10";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/10";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const dismissNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      setUnreadCount((prev) => {
        const notification = notifications.find((n) => n.id === id);
        return notification && !notification.read
          ? Math.max(0, prev - 1)
          : prev;
      });
    },
    [notifications],
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const displayNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  return (
    <div className={cn("", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? "Show less" : "Show all"}
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {displayNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "border-0 border-l-4 transition-all duration-300 hover:shadow-md cursor-pointer",
              getNotificationColor(notification.type),
              !notification.read && "ring-2 ring-blue-200 dark:ring-blue-800",
            )}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon/Avatar */}
                <div className="flex-shrink-0 mt-1">
                  {notification.avatar ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                        {notification.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        className={cn(
                          "text-sm font-semibold",
                          !notification.read && "text-primary",
                        )}
                      >
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.priority === "urgent" && (
                          <Badge
                            variant="destructive"
                            className="text-xs px-1 py-0"
                          >
                            Urgent
                          </Badge>
                        )}
                        {notification.priority === "high" && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1 py-0 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                          >
                            High
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                      {!notification.persistent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                          className="w-6 h-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-sm text-muted-foreground">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      )}

      {/* Real-time Status */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span>Real-time updates enabled</span>
      </div>
    </div>
  );
}
