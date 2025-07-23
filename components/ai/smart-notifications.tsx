"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  X,
  AlertCircle,
  Info, Calendar,
  DollarSign
  Brain,
  Sparkles
  MapPin,
  Users,
  TrendingUp,
  Heart
  ArrowRight,
  MessageCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SmartNotification {
  id: string;
  type:
    | "ai_insight"
    | "booking_update"
    | "price_alert"
    | "provider_match"
    | "system"
    | "promotion";
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high" | "urgent";
  aiGenerated: boolean;
  agentId?: string;
  actionable: boolean;
  actions?: {
    label: string;
    action: string;
    variant?: "default" | "outline" | "ghost";
  }[];
  metadata?: any;
  read: boolean;
  persistent?: boolean;
}

interface SmartNotificationsProps {
  userId?: string;
  context?: any;
  maxVisible?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  enableAI?: boolean;
  className?: string;
}

export default function SmartNotifications({
  userId,
  context = {},
  maxVisible = 3,
  position = "top-right",
  enableAI = true,
  className = "",
}: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  // Mock AI-generated notifications
  const generateAINotifications = () => {
    const mockNotifications: SmartNotification[] = [
      {
        id: "ai-1",
        type: "ai_insight",
        title: "💡 Smart Savings Found",
        message:
          "I found a way to save 25% on your upcoming cleaning service by booking on Tuesday instead of weekend!",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: "medium",
        aiGenerated: true,
        agentId: "maya",
        actionable: true,
        actions: [
          { label: "View Details", action: "view_savings", variant: "default" },
          { label: "Book Now", action: "book_optimized", variant: "outline" },
        ],
        read: false,
        persistent: true,
      },
      {
        id: "ai-2",
        type: "provider_match",
        title: "🎯 Perfect Match Found",
        message:
          "Maya found 3 highly-rated providers that specialize in your exact needs and are available today!",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        priority: "high",
        aiGenerated: true,
        agentId: "maya",
        actionable: true,
        actions: [
          { label: "See Matches", action: "view_matches", variant: "default" },
          { label: "Chat with Maya", action: "open_chat", variant: "ghost" },
        ],
        read: false,
      },
      {
        id: "booking-1",
        type: "booking_update",
        title: "📅 Booking Confirmed",
        message:
          "Your home cleaning service with Sarah Chen is confirmed for tomorrow at 10:00 AM.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        priority: "medium",
        aiGenerated: false,
        actionable: true,
        actions: [
          { label: "View Details", action: "view_booking", variant: "outline" },
          {
            label: "Message Provider",
            action: "message_provider",
            variant: "ghost",
          },
        ],
        read: false,
      },
      {
        id: "ai-3",
        type: "price_alert",
        title: "💰 Price Drop Alert",
        message:
          "Great news! The plumbing service you were interested in just reduced their rates by 15%.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: "medium",
        aiGenerated: true,
        agentId: "echo",
        actionable: true,
        actions: [
          { label: "Book Now", action: "book_discounted", variant: "default" },
          { label: "Save for Later", action: "save_offer", variant: "outline" },
        ],
        read: false,
      },
      {
        id: "system-1",
        type: "system",
        title: "🚀 New AI Features",
        message:
          "Voice search and image-based service discovery are now available! Try asking Maya to find services using natural language.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: "low",
        aiGenerated: false,
        actionable: true,
        actions: [
          {
            label: "Try Voice Search",
            action: "try_voice",
            variant: "default",
          },
          { label: "Learn More", action: "feature_tour", variant: "outline" },
        ],
        read: false,
      },
    ];

    setNotifications(mockNotifications);
  };

  useEffect(() => {
    setMounted(true);
    generateAINotifications();

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (enableAI && Math.random() > 0.7) {
        generateSmartNotification();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [enableAI]);

  const generateSmartNotification = () => {
    const aiInsights = [
      {
        title: "🔮 Trend Alert",
        message:
          "Demand for cleaning services is 40% lower this week. Perfect time to book at reduced rates!",
        type: "ai_insight" as const,
        agentId: "echo",
      },
      {
        title: "⭐ Quality Recommendation",
        message:
          "Based on your, preferences, I recommend booking with providers who have 4.8+ ratings in your area.",
        type: "ai_insight" as const,
        agentId: "maya",
      },
      {
        title: "📍 Location Insight",
        message:
          "Providers in the nearby Greenwood area typically respond 50% faster than your current selection.",
        type: "provider_match" as const,
        agentId: "echo",
      },
    ];

    const insight = aiInsights[Math.floor(Math.random() * aiInsights.length)];

    const newNotification: SmartNotification = {
      id: `ai-${Date.now()}`,
      type: insight.type,
      title: insight.title,
      message: insight.message,
      timestamp: new Date(),
      priority: "medium",
      aiGenerated: true,
      agentId: insight.agentId,
      actionable: true,
      actions: [
        { label: "Tell Me More", action: "ai_explain", variant: "default" },
        { label: "Dismiss", action: "dismiss", variant: "ghost" },
      ],
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
  };

  const handleAction = (notificationId: string, action: string) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification) return;

    switch (action) {
      case "dismiss":
        handleDismiss(notificationId);
        break;
      case "view_savings":
        toast({
          title: "💰 Savings Details",
          description: "Tuesday bookings are 25% cheaper due to lower demand",
        });
        break;
      case "book_optimized":
        toast({
          title: "🚀 Booking Optimized",
          description: "Redirecting to book at the best price...",
        });
        break;
      case "view_matches":
        toast({
          title: "🎯 Perfect Matches",
          description: "Opening provider matches...",
        });
        break;
      case "open_chat":
        toast({
          title: "💬 AI Assistant",
          description: "Opening chat with Maya...",
        });
        break;
      case "ai_explain":
        toast({
          title: "🧠 AI Insight",
          description: "Let me explain this recommendation in detail...",
        });
        break;
      default:
        toast({
          title: "Action Triggered",
          description: `Executing: ${action}`,
        });
    }

    // Mark as read
    markAsRead(notificationId);
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (notification: SmartNotification) => {
    switch (notification.type) {
      case "ai_insight":
        return Brain;
      case "booking_update":
        return Calendar;
      case "price_alert":
        return DollarSign;
      case "provider_match":
        return Users;
      case "promotion":
        return Star;
      case "system":
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (notification: SmartNotification) => {
    switch (notification.priority) {
      case "urgent":
        return "from-red-500 to-pink-500";
      case "high":
        return "from-orange-500 to-red-500";
      case "medium":
        return "from-blue-500 to-purple-500";
      case "low":
        return "from-gray-400 to-gray-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "fixed top-4 right-4 z-50";
      case "top-left":
        return "fixed top-4 left-4 z-50";
      case "bottom-right":
        return "fixed bottom-4 right-4 z-50";
      case "bottom-left":
        return "fixed bottom-4 left-4 z-50";
      default:
        return "fixed top-4 right-4 z-50";
    }
  };

  if (!mounted) return null;

  const visibleNotifications = showAll
    ? notifications
    : notifications.slice(0, maxVisible);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      {visibleNotifications.map((notification, index) => {
        const Icon = getNotificationIcon(notification);

        return (
          <div
            key={notification.id}
            className="mb-3 w-80 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card
              className={`shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl hover:shadow-3xl transition-all duration-300 ${
                !notification.read
                  ? "ring-2 ring-blue-200 dark:ring-blue-800"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${getNotificationColor(notification)} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {notification.aiGenerated && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-700"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            notification.priority === "urgent"
                              ? "border-red-500 text-red-700"
                              : notification.priority === "high"
                                ? "border-orange-500 text-orange-700"
                                : notification.priority === "medium"
                                  ? "border-blue-500 text-blue-700"
                                  : "border-gray-500 text-gray-700"
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notification.timestamp.toLocaleTimeString()}
                  </div>
                  {notification.agentId && (
                    <div className="flex items-center gap-1">
                      <Brain className="w-3 h-3" />
                      {notification.agentId}
                    </div>
                  )}
                </div>

                {notification.actionable && notification.actions && (
                  <div className="flex gap-2">
                    {notification.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        size="sm"
                        variant={action.variant || "default"}
                        onClick={() =>
                          handleAction(notification.id, action.action)
                        }
                        className="text-xs"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}

      {/* Notification Center Button */}
      {notifications.length > maxVisible && (
        <div className="mt-3 animate-fade-in">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            size="sm"
            className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200 dark:border-gray-700"
          >
            {showAll ? "Show Less" : `View All (${notifications.length})`}
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      )}

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="mt-2 animate-fade-in">
          <Button
            onClick={markAllAsRead}
            variant="ghost"
            size="sm"
            className="w-full text-xs text-gray-500 hover:text-gray-700"
          >
            Mark all as read
          </Button>
        </div>
      )}
    </div>
  );
}
