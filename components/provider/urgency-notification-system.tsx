"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Bell,
  Zap,
  DollarSign,
  MapPin,
  Star,
  Settings,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast"

interface UrgentJob {
  id: string
  title: string
  category: string
  budget: number
  distance: number
  urgency: "high" | "medium" | "low"
  postedAt: Date
  estimatedDuration: string
  customerRating: number
  isNew: boolean
}

interface NotificationSettings {
  enabled: boolean
  maxDistance: number
  minBudget: number
  categories: string[]
  urgencyLevels: string[]
  soundEnabled: boolean
  pushEnabled: boolean
}

export default function UrgencyNotificationSystem() {
  const [notifications, setNotifications] = useState<UrgentJob[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    maxDistance: 10,
    minBudget: 50,
    categories: ["House Cleaning", "Handyman Services"],
    urgencyLevels: ["high", "medium"],
    soundEnabled: true,
    pushEnabled: true,
  })
  const [stats, setStats] = useState({
    totalNotifications: 47,
    responseRate: 89,
    avgResponseTime: "4.2min",
    earnings: 1250,
  })

  const { toast } = useToast()

  // Simulate real-time job notifications
  useEffect(() => {
    const mockJobs: UrgentJob[] = [
      {
        id: "1",
        title: "URGENT: Kitchen Sink Leak Repair",
        category: "Handyman Services",
        budget: 120,
        distance: 0.8,
        urgency: "high",
        postedAt: new Date(Date.now() - 2 * 60 * 1000),
        estimatedDuration: "2-3 hours",
        customerRating: 4.8,
        isNew: true,
      },
      {
        id: "2",
        title: "Same-Day House Cleaning Needed",
        category: "House Cleaning",
        budget: 85,
        distance: 1.2,
        urgency: "high",
        postedAt: new Date(Date.now() - 5 * 60 * 1000),
        estimatedDuration: "3-4 hours",
        customerRating: 4.9,
        isNew: true,
      },
      {
        id: "3",
        title: "Pet Sitting This Weekend",
        category: "Pet Care",
        budget: 60,
        distance: 2.1,
        urgency: "medium",
        postedAt: new Date(Date.now() - 15 * 60 * 1000),
        estimatedDuration: "2 days",
        customerRating: 4.7,
        isNew: false,
      },
    ]
    setNotifications(mockJobs)
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

  const handleAcceptJob = (jobId: string, jobTitle: string) => {
    setNotifications((prev) => prev.filter((job) => job.id !== jobId))
    toast({
      title: "Job Accepted!",
      description: `You have accepted the job: "${jobTitle}".`,
      variant: "default",
    })
    // Simulate accepting the job
  }

  const handleViewDetails = (jobTitle: string) => {
    toast({
      title: "Viewing Job Details",
      description: `Opening details for "${jobTitle}".`,
      variant: "default",
    })
    // Simulate navigation to job details page
  }

  const updateSettings = (key: keyof NotificationSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    toast({
      title: "Settings Updated",
      description: `Notification setting for ${key} changed.`,
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold">{stats.totalNotifications}</p>
              </div>
              <Bell className="w-8 h-8 text-ai-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-success-500" />
              <span className="text-success-600 dark:text-success-400">+12 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{stats.responseRate}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-success-500" />
              <span className="text-success-600 dark:text-success-400">+5% vs avg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-success-500" />
              <span className="text-success-600 dark:text-success-400">2x faster</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <p className="text-2xl font-bold">${stats.earnings}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-success-500" />
              <span className="text-success-600 dark:text-success-400">+$320 this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Urgent Job Alerts
          </CardTitle>
          <CardDescription>High-priority jobs matching your preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((job) => (
            <Card
              key={job.id}
              className={`border-l-4 ${job.isNew ? "border-l-red-500 bg-red-50/50 dark:bg-red-950/20" : "border-l-yellow-500"}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      {job.isNew && <Badge className="bg-red-500 text-white animate-pulse">NEW</Badge>}
                      <Badge className={`${getUrgencyColor(job.urgency)} text-white`}>
                        {job.urgency.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />${job.budget}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.distance} mi
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.estimatedDuration}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {job.customerRating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Posted {getTimeAgo(job.postedAt)}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(job.title)}>
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptJob(job.id, job.title)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Accept Job
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Notification Settings
          </CardTitle>
          <CardDescription>Customize your alert preferences for better matches</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for urgent jobs</p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSettings("enabled", checked)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label>Maximum Distance: {settings.maxDistance} miles</Label>
              <Slider
                value={[settings.maxDistance]}
                onValueChange={(value) => updateSettings("maxDistance", value[0])}
                max={25}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Minimum Budget: ${settings.minBudget}</Label>
              <Slider
                value={[settings.minBudget]}
                onValueChange={(value) => updateSettings("minBudget", value[0])}
                max={500}
                min={25}
                step={25}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Sound Alerts</Label>
              <Switch
                id="sound-enabled"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings("soundEnabled", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-enabled">Push Notifications</Label>
              <Switch
                id="push-enabled"
                checked={settings.pushEnabled}
                onCheckedChange={(checked) => updateSettings("pushEnabled", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
