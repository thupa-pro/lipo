import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
import MonetizationEngine from "@/components/monetization-engine"
import ABTestingFramework from "@/components/ab-testing-framework"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, FlaskConical, Sparkles } from "lucide-react";
import Link from "next/link"

export default function GrowthEnginePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <BusinessIcons.MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Loconomy
            </span>
          </Link>
          <div className="text-sm text-gray-600">Growth & Optimization Suite</div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🚀 Growth Engine</h1>
          <p className="text-gray-600">Revenue optimization and data-driven experimentation platform</p>
        </div>

        {/* New introductory section */}
        <div className="text-center mb-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md">
          <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-purple-800">Accelerate Your Platform's Growth</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Leverage powerful tools for A/B testing and monetization strategies to maximize user engagement and revenue.
            Make data-driven decisions to continuously improve your platform's performance.
          </p>
        </div>

        <Tabs defaultValue="monetization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monetization" className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              Monetization Engine
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center">
              <FlaskConical className="w-4 h-4 mr-2" />
              A/B Testing Framework
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monetization">
            <MonetizationEngine />
          </TabsContent>

          <TabsContent value="testing">
            <ABTestingFramework />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}