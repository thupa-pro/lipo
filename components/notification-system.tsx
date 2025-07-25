"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  MessageSquare,
  DollarSign,
  Calendar,
  MapPin,
  X,
  Settings,
  Smartphone,
  Mail,
  Volume2,
  CheckCircle,
  Star
} from "lucide-react";

interface Notification {
  id: string
  type: "message" | "job_match" | "payment" | "review" | "booking" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
  jobMatches: boolean
  messages: boolean
  payments: boolean
  reviews: boolean
  marketing: boolean
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "job_match",
      title: "New Job Match Found!",
      message: "A house cleaning job in your area matches your skills perfectly.",
      timestamp: "2 minutes ago",
      read: false,
      priority: "high",
      actionUrl: "/jobs/123",
    },
    {
      id: "2",
      type: "message",
      title: "New Message from Sarah",
      message: "Hi! I'd like to discuss the cleaning job details with you.",
      timestamp: "15 minutes ago",
      read: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Received",
      message: "You've received $75.00 for the completed cleaning job.",
      timestamp: "1 hour ago",
      read: true,
      priority: "medium",
    },
    {
      id: "4",
      type: "review",
      title: "New 5-Star Review!",
      message: "John D. left you a great review: 'Excellent, work, very professional!'",
      timestamp: "3 hours ago",
      read: true,
      priority: "low",
    },
    {
      id: "5",
      type: "booking",
      title: "Job Confirmed",
      message: "Your cleaning appointment for tomorrow at 2 PM has been confirmed.",
      timestamp: "1 day ago",
      read: true,
      priority: "medium",
    },
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: true,
    push: true,
    inApp: true,
    jobMatches: true,
    messages: true,
    payments: true,
    reviews: true,
    marketing: false,
  })

  const [showSettings, setShowSettings] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />
      case "job_match":
        return <MapPin className="w-5 h-5 text-green-600" />
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-600" />
      case "review":
        return <Star className="w-5 h-5 text-yellow-600" />
      case "booking":
        return <Calendar className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-blue-500 bg-blue-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (for demo purposes)
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "message",
          title: "New Message",
          message: "You have a new message from a customer.",
          timestamp: "Just now",
          read: false,
          priority: "medium",
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (showSettings) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delivery Methods */}
          <div>
            <h3 className="font-semibold mb-4">Delivery Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label htmlFor="push">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Instant alerts on your device</p>
                  </div>
                </div>
                <Switch
                  id="push"
                  checked={settings.push}
                  onCheckedChange={(checked) => updateSetting("push", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <Label htmlFor="email">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Detailed updates via email</p>
                  </div>
                </div>
                <Switch
                  id="email"
                  checked={settings.email}
                  onCheckedChange={(checked) => updateSetting("email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label htmlFor="sms">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Text messages for urgent updates</p>
                  </div>
                </div>
                <Switch id="sms" checked={settings.sms} onCheckedChange={(checked) => updateSetting("sms", checked)} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notification Types */}
          <div>
            <h3 className="font-semibold mb-4">What to notify me about</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <Label htmlFor="jobMatches">Job Matches</Label>
                    <p className="text-sm text-gray-600">When new jobs match your skills</p>
                  </div>
                </div>
                <Switch
                  id="jobMatches"
                  checked={settings.jobMatches}
                  onCheckedChange={(checked) => updateSetting("jobMatches", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label htmlFor="messages">Messages</Label>
                    <p className="text-sm text-gray-600">New messages from customers</p>
                  </div>
                </div>
                <Switch
                  id="messages"
                  checked={settings.messages}
                  onCheckedChange={(checked) => updateSetting("messages", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <Label htmlFor="payments">Payments</Label>
                    <p className="text-sm text-gray-600">Payment confirmations and payouts</p>
                  </div>
                </div>
                <Switch
                  id="payments"
                  checked={settings.payments}
                  onCheckedChange={(checked) => updateSetting("payments", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <Label htmlFor="reviews">Reviews</Label>
                    <p className="text-sm text-gray-600">New reviews and ratings</p>
                  </div>
                </div>
                <Switch
                  id="reviews"
                  checked={settings.reviews}
                  onCheckedChange={(checked) => updateSetting("reviews", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <Label htmlFor="marketing">Marketing & Tips</Label>
                    <p className="text-sm text-gray-600">Platform updates and helpful tips</p>
                  </div>
                </div>
                <Switch
                  id="marketing"
                  checked={settings.marketing}
                  onCheckedChange={(checked) => updateSetting("marketing", checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowSettings(false)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with your Loconomy activity</CardDescription>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
              <p className="text-sm">We'll notify you when something important happens</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 rounded-lg transition-colors ${
                  notification.read ? "bg-gray-50" : getPriorityColor(notification.priority)
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      <p className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-700"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notification.actionUrl && (
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    )}
                    {!notification.read && (
                      <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
