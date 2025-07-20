"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Calendar,
  MessageCircle,
  Star,
  DollarSign,
  AlertCircle,
  Info,
  Users,
  Clock,
  Settings,
  Trash2,
  Archive,
  Filter,
  MoreHorizontal,
  Bookmark,
  Shield,
  Zap,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: "booking" | "message" | "review" | "payment" | "system" | "promotion" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "high" | "medium" | "low";
  category: string;
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
  avatar?: string;
  groupKey?: string;
}

interface NotificationGroup {
  key: string;
  type: string;
  count: number;
  latest: Date;
  notifications: Notification[];
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    [key: string]: boolean;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
}

export default function NotificationCenter({ isOpen, onClose, unreadCount }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groupedNotifications, setGroupedNotifications] = useState<NotificationGroup[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    categories: {
      booking: true,
      message: true,
      review: true,
      payment: true,
      system: false,
      promotion: true,
      reminder: true,
    },
  });

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "booking",
      title: "Booking Confirmed",
      message: "Your cleaning service with Sarah Johnson has been confirmed for Jan 16, 2024 at 10:00 AM",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: "high",
      category: "booking",
      actionUrl: "/bookings/1",
      actionLabel: "View Details",
      avatar: "/api/placeholder/40/40",
      data: { bookingId: "1", providerId: "provider-1" },
    },
    {
      id: "2",
      type: "message",
      title: "New Message",
      message: "Jessica Thompson sent you a message about the upcoming cleaning appointment",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      priority: "medium",
      category: "message",
      actionUrl: "/messages/1",
      actionLabel: "Reply",
      avatar: "/api/placeholder/40/40",
      data: { conversationId: "1", senderId: "customer-1" },
    },
    {
      id: "3",
      type: "review",
      title: "New 5-Star Review",
      message: "Michael Rodriguez left you a 5-star review: 'Outstanding work! Very reliable and trustworthy.'",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      priority: "medium",
      category: "review",
      actionUrl: "/reviews/3",
      actionLabel: "View Review",
      avatar: "/api/placeholder/40/40",
      data: { reviewId: "3", rating: 5, customerId: "customer-2" },
    },
    {
      id: "4",
      type: "payment",
      title: "Payment Received",
      message: "You received $75.00 for Professional House Cleaning service",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: true,
      priority: "high",
      category: "payment",
      actionUrl: "/earnings",
      actionLabel: "View Earnings",
      data: { amount: 75, currency: "USD", bookingId: "1" },
    },
    {
      id: "5",
      type: "system",
      title: "Platform Update",
      message: "New features available: Enhanced messaging and improved search filters",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: "low",
      category: "system",
      actionUrl: "/updates",
      actionLabel: "Learn More",
    },
    {
      id: "6",
      type: "promotion",
      title: "Limited Time Offer",
      message: "Boost your visibility! Get 50% off Premium listing for the next 7 days",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      priority: "medium",
      category: "promotion",
      actionUrl: "/premium",
      actionLabel: "Upgrade Now",
      data: { discount: 50, validUntil: "2024-01-23" },
    },
    {
      id: "7",
      type: "reminder",
      title: "Booking Reminder",
      message: "You have a cleaning appointment tomorrow at 10:00 AM with Jessica Thompson",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      priority: "high",
      category: "reminder",
      actionUrl: "/bookings/1",
      actionLabel: "View Details",
      avatar: "/api/placeholder/40/40",
      data: { bookingId: "1", customerId: "customer-1" },
    },
    {
      id: "8",
      type: "message",
      title: "New Message",
      message: "Tech Startup Inc. is asking about your availability for next week",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
      priority: "medium",
      category: "message",
      actionUrl: "/messages/3",
      actionLabel: "Reply",
      avatar: "/api/placeholder/40/40",
      groupKey: "messages_today",
    },
    {
      id: "9",
      type: "message",
      title: "New Message",
      message: "Emily Chen sent a follow-up message about the service quality",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      priority: "medium",
      category: "message",
      actionUrl: "/messages/4",
      actionLabel: "Reply",
      avatar: "/api/placeholder/40/40",
      groupKey: "messages_today",
    },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    groupNotifications(mockNotifications);
  }, []);

  const groupNotifications = (notifs: Notification[]) => {
    const groups: { [key: string]: NotificationGroup } = {};
    
    notifs.forEach(notif => {
      if (notif.groupKey) {
        if (!groups[notif.groupKey]) {
          groups[notif.groupKey] = {
            key: notif.groupKey,
            type: notif.type,
            count: 0,
            latest: notif.timestamp,
            notifications: [],
          };
        }
        groups[notif.groupKey].notifications.push(notif);
        groups[notif.groupKey].count++;
        if (notif.timestamp > groups[notif.groupKey].latest) {
          groups[notif.groupKey].latest = notif.timestamp;
        }
      }
    });

    setGroupedNotifications(Object.values(groups));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-4 h-4" />;
      case "message":
        return <MessageCircle className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      case "system":
        return <Info className="w-4 h-4" />;
      case "promotion":
        return <Zap className="w-4 h-4" />;
      case "reminder":
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case "unread":
        return !notif.read;
      case "important":
        return notif.priority === "high";
      default:
        return true;
    }
  });

  // Group non-grouped notifications
  const individualNotifications = filteredNotifications.filter(notif => !notif.groupKey);
  const groupedItems = groupedNotifications.filter(group => 
    group.notifications.some(notif => filteredNotifications.includes(notif))
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-16 bottom-0 w-96 bg-background border-l border-border shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Unread
              </Button>
              <Button
                variant={filter === "important" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("important")}
              >
                Important
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1">
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive all
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-border overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <h3 className="font-medium">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <Switch
                        checked={settings.email}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, email: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push notifications</span>
                      <Switch
                        checked={settings.push}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, push: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS notifications</span>
                      <Switch
                        checked={settings.sms}
                        onCheckedChange={(checked) =>
                          setSettings(prev => ({ ...prev, sms: checked }))
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Categories</h4>
                    {Object.entries(settings.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{category}</span>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({
                              ...prev,
                              categories: { ...prev.categories, [category]: checked }
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {/* Grouped Notifications */}
              {groupedItems.map((group) => (
                <Card key={group.key} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor("medium")}`}>
                          {getNotificationIcon(group.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            {group.count} new {group.type}s
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Latest: {formatTimestamp(group.latest)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {group.notifications.slice(0, 2).map((notif) => (
                        <div key={notif.id} className="text-xs text-muted-foreground border-l-2 border-muted pl-3">
                          <p className="font-medium">{notif.title}</p>
                          <p className="truncate">{notif.message}</p>
                        </div>
                      ))}
                      {group.notifications.length > 2 && (
                        <p className="text-xs text-muted-foreground pl-3">
                          +{group.notifications.length - 2} more
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Individual Notifications */}
              {individualNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? "bg-primary/5 border-primary/20" : "bg-background"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>
                            {getNotificationIcon(notification.type)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Bookmark className="w-4 h-4 mr-2" />
                                Save
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {notification.actionLabel && (
                          <Button variant="outline" size="sm" className="text-xs">
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! New notifications will appear here.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
