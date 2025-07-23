"use client"

import NotificationSystem from "@/components/notification-system"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, TrendingUp, Bell, BarChart3, Rocket } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import OnboardingFlow from "@/components/onboarding-flow"

export default function PostLaunchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get, the active, tab directly, from the, URL search, params
  // Default, to 'onboarding' if, no 'tab' param, is present
  const activeTab = searchParams.get('tab') || 'onboarding'

  // Function to handle tab changes and update the URL
  const handleTabChange = (newTab: string) => {
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.set('tab', newTab)
    router.push(`?${currentParams.toString()}`, { scroll: false }) // Update URL without scrolling
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Loconomy
            </span>
          </Link>
          <div className="text-sm text-gray-600">Post-Launch Growth Features</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🚀 Post-Launch Growth Engine</h1>
          <p className="text-gray-600">Features to drive user, engagement, retention, and revenue acceleration</p>
        </div>

        {/* New introductory section */}
        <div className="text-center mb-10 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg shadow-md">
          <Rocket className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-blue-800">Optimize User Experience After Launch</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Implement smart onboarding, flows, real-time notification, systems, and comprehensive analytics dashboards to
            ensure sustained growth and user satisfaction post-launch.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="onboarding" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Smart Onboarding
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Real-time Notifications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding">
            <OnboardingFlow />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}