"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Search,
  Filter,
  Settings,
  Check,
  CheckCircle,
  X,
  Trash2,
  Archive,
  Star,
  CreditCard,
  MessageSquare,
  Calendar,
  Mail,
  Smartphone,
  Volume2,
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

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
  archived?: boolean;
  starred?: boolean;
  metadata?: {
    userId?: string;
    bookingId?: string;
    amount?: number;
    rating?: number;
  };
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
  vibration: boolean;
  types: {
    jobMatches: boolean;
    messages: boolean;
    bookings: boolean;
    payments: boolean;
    reviews: boolean;
    system: boolean;
    marketing: boolean;
  };
  schedule: {
    quietHoursEnabled: boolean;
    quietStart: string;
    quietEnd: string;
    weekendsOnly: boolean;
  };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: true,
    inApp: true,
    sound: true,
    vibration: true,
    types: {
      jobMatches: true,
      messages: true,
      bookings: true,
      payments: true,
      reviews: true,
      system: true,
      marketing: false,
    },
    schedule: {
      quietHoursEnabled: false,
      quietStart: "22:00",
      quietEnd: "08:00",
      weekendsOnly: false,
    },
  });
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "payment",
        title: "Payment Received",
        message:
          "You received $125.00 for house cleaning service completed on Dec 15",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        read: false,
        priority: "high",
        metadata: { amount: 125 },
      },
      {
        id: "2",
        type: "booking",
        title: "New Booking Request",
        message:
          "Sarah Mitchell wants to book your cleaning service for tomorrow at 2 PM",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
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
          "John D. left a review: 'Excellent service! Very professional and thorough cleaning.'",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        priority: "medium",
        starred: true,
        metadata: { rating: 5 },
      },
      {
        id: "4",
        type: "message",
        title: "New Message from Client",
        message:
          "Maria: 'Could you also clean the windows during tomorrow's appointment?'",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
        priority: "medium",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "5",
        type: "job_match",
        title: "Job Match Alert",
        message:
          "3 new cleaning jobs in your area match your skills and availability",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        priority: "medium",
      },
      {
        id: "6",
        type: "system",
        title: "Security Update",
        message:
          "Your account security has been enhanced with two-factor authentication",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        priority: "low",
      },
      {
        id: "7",
        type: "booking",
        title: "Booking Confirmed",
        message:
          "Your appointment with Emma Wilson for Dec 20 at 10 AM has been confirmed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
        priority: "medium",
        archived: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "w-5 h-5";

    switch (type) {
      case "payment":
        return <CreditCard className={cn(iconClass, "text-emerald-600")} />;
      case "booking":
        return <Calendar className={cn(iconClass, "text-blue-600")} />;
      case "message":
        return <MessageSquare className={cn(iconClass, "text-purple-600")} />;
      case "review":
        return <Star className={cn(iconClass, "text-yellow-600")} />;
      case "job_match":
        return <CheckCircle className={cn(iconClass, "text-green-600")} />;
      default:
        return <Bell className={cn(iconClass, "text-gray-600")} />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query),
      );
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    // Apply status filter
    if (selectedStatus === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (selectedStatus === "read") {
      filtered = filtered.filter((n) => n.read);
    } else if (selectedStatus === "starred") {
      filtered = filtered.filter((n) => n.starred);
    } else if (selectedStatus === "archived") {
      filtered = filtered.filter((n) => n.archived);
    } else if (selectedStatus === "active") {
      filtered = filtered.filter((n) => !n.archived);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.timestamp.getTime() - a.timestamp.getTime();
        case "oldest":
          return a.timestamp.getTime() - b.timestamp.getTime();
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notifications, searchQuery, selectedType, selectedStatus, sortBy]);

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived,
  ).length;
  const starredCount = notifications.filter(
    (n) => n.starred && !n.archived,
  ).length;
  const archivedCount = notifications.filter((n) => n.archived).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      duration: 2000,
    });
  };

  const toggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n)),
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateTypeSetting = (
    key: keyof NotificationSettings["types"],
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      types: { ...prev.types, [key]: value },
    }));
  };

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="notifications">
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-6">
        {/* Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="booking">Bookings</SelectItem>
                    <SelectItem value="message">Messages</SelectItem>
                    <SelectItem value="review">Reviews</SelectItem>
                    <SelectItem value="job_match">Job Matches</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="starred">Starred</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>

                {unreadCount > 0 && (
                  <Button variant="outline" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-2" />
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Unread
                  </p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Starred
                  </p>
                  <p className="text-2xl font-bold">{starredCount}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Archived
                  </p>
                  <p className="text-2xl font-bold">{archivedCount}</p>
                </div>
                <Archive className="w-8 h-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Notifications</span>
              <Badge variant="outline">
                {filteredNotifications.length} of {notifications.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No notifications found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    selectedType !== "all" ||
                    selectedStatus !== "all"
                      ? "Try adjusting your filters"
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 transition-colors",
                        !notification.read &&
                          "bg-blue-50/50 dark:bg-blue-950/20",
                        notification.archived && "opacity-60",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar or Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {notification.avatar ? (
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={notification.avatar} />
                              <AvatarFallback>
                                {notification.title.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
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
                                    "font-medium",
                                    !notification.read && "font-semibold",
                                  )}
                                >
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                                {notification.starred && (
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                )}
                                {notification.archived && (
                                  <Archive className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span>
                                  {formatTimestamp(notification.timestamp)}
                                </span>

                                {notification.priority === "urgent" && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Urgent
                                  </Badge>
                                )}

                                {notification.priority === "high" && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-orange-100 text-orange-700"
                                  >
                                    High Priority
                                  </Badge>
                                )}

                                {notification.metadata?.amount && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-emerald-600 border-emerald-600"
                                  >
                                    ${notification.metadata.amount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleStar(notification.id)}
                                title={notification.starred ? "Unstar" : "Star"}
                              >
                                <Star
                                  className={cn(
                                    "w-4 h-4",
                                    notification.starred
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-muted-foreground",
                                  )}
                                />
                              </Button>

                              {!notification.archived && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    archiveNotification(notification.id)
                                  }
                                  title="Archive"
                                >
                                  <Archive className="w-4 h-4" />
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        {/* Analytics content would go here */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics dashboard showing notification patterns, response rates,
              and engagement metrics.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        {/* Settings content would go here */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Methods */}
            <div>
              <h3 className="font-semibold mb-4">Delivery Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Instant alerts on your device
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.push}
                    onCheckedChange={(checked) =>
                      updateSetting("push", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Detailed updates via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.email}
                    onCheckedChange={(checked) =>
                      updateSetting("email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <Label>Sound Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Audio notifications for important updates
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) =>
                      updateSetting("sound", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Notification Types */}
            <div>
              <h3 className="font-semibold mb-4">Notification Types</h3>
              <div className="space-y-4">
                {Object.entries(settings.types).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        updateTypeSetting(
                          key as keyof NotificationSettings["types"],
                          checked,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
