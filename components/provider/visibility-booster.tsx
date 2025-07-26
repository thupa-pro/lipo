"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Eye,
  Crown,
  Star,
  Target,
  Zap
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast"

interface VisibilityBoosterProps {
  providerId: string
}

interface PerformanceMetrics {
  currentViews: number
  currentMatches: number
  averageRating: number
  responseRate: number
  lastWeekJobs: number
  competitorAverage: number
}

interface BoostOption {
  id: string
  name: string
  description: string
  price: number
  duration: string
  multiplier: number
  features: string[]
  roi: string
  popular?: boolean
}

export default function VisibilityBooster({ providerId }: VisibilityBoosterProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    currentViews: 45,
    currentMatches: 3,
    averageRating: 4.6,
    responseRate: 85,
    lastWeekJobs: 2,
    competitorAverage: 7,
  })

  const [selectedBoost, setSelectedBoost] = useState<string>("")
  const [showROI, setShowROI] = useState(false)

  const { toast } = useToast()

  const boostOptions: BoostOption[] = [
    {
      id: "featured",
      name: "Featured Badge",
      description: "Stand out with a premium badge and higher search ranking",
      price: 15,
      duration: "7 days",
      multiplier: 2.5,
      features: ["Premium badge", "Top 3 search results", "2.5x more views"],
      roi: "Expected 6-8 additional jobs",
    },
    {
      id: "spotlight",
      name: "Spotlight Boost",
      description: "Maximum visibility with highlighted profile and priority matching",
      price: 35,
      duration: "14 days",
      multiplier: 4,
      features: ["Spotlight badge", "Priority matching", "Profile highlighting", "4x visibility boost"],
      roi: "Expected 12-15 additional jobs",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Plus",
      description: "Ultimate visibility package with all premium features",
      price: 60,
      duration: "30 days",
      multiplier: 6,
      features: ["All premium badges", "Top search placement", "Priority support", "6x visibility"],
      roi: "Expected 20-25 additional jobs",
    },
  ]

  const calculateROI = (option: BoostOption) => {
    const averageJobValue = 75 // Average job value
    const expectedJobs = Math.floor(metrics.lastWeekJobs * option.multiplier * 2) // Estimate based on multiplier
    const grossRevenue = expectedJobs * averageJobValue
    const netRevenue = grossRevenue - option.price
    const roiPercentage = ((netRevenue / option.price) * 100).toFixed(0)

    return {
      expectedJobs,
      grossRevenue,
      netRevenue,
      roiPercentage,
    }
  }

  const getPerformanceLevel = () => {
    if (metrics.lastWeekJobs >= metrics.competitorAverage) return "good"
    if (metrics.lastWeekJobs >= metrics.competitorAverage * 0.7) return "average"
    return "low"
  }

  const performanceLevel = getPerformanceLevel()

  const handleActivateBoost = (boostName: string, price: number) => {
    toast({
      title: "Boost Activated!",
      description: `You have activated the "${boostName}" for $${price}. Get ready for more visibility!`,
      variant: "default",
    })
    // In a real, app, this would trigger a payment flow and backend update
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card
        className={`border-l-4 ${
          performanceLevel === "good"
            ? "border-l-green-500 bg-green-50"
            : performanceLevel === "average"
              ? "border-l-yellow-500 bg-yellow-50"
              : "border-l-red-500 bg-red-50"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Your Performance This Week
          </CardTitle>
          <CardDescription>
            {performanceLevel === "good" && "Great job! You're performing above average."}
            {performanceLevel === "average" && "You're doing, okay, but there's room for improvement."}
            {performanceLevel === "low" && "Your visibility could use a boost to get more jobs."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-ai-600">{metrics.currentViews}</div>
              <div className="text-xs text-muted-foreground">Profile Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{metrics.lastWeekJobs}</div>
              <div className="text-xs text-muted-foreground">Jobs This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{metrics.averageRating}</div>
              <div className="text-xs text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-premium-600">{metrics.responseRate}%</div>
              <div className="text-xs text-muted-foreground">Response Rate</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-card rounded-card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">vs. Competitor Average</span>
              <span className="text-sm font-medium">{metrics.competitorAverage} jobs/week</span>
            </div>
            <Progress value={(metrics.lastWeekJobs / metrics.competitorAverage) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Boost Options */}
      <Tabs defaultValue="options" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="options">Boost Options</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-4">
          <div className="grid gap-4">
            {boostOptions.map((option) => (
              <Card
                key={option.id}
                className={`cursor-pointer interactive-hover ${
                  selectedBoost === option.id ? "ring-2 ring-blue-500" : ""
                } ${option.popular ? "border-yellow-400" : ""}`}
                onClick={() => setSelectedBoost(option.id)}
              >
                {option.popular && (
                  <div className="bg-yellow-400 text-yellow-900 text-xs font-medium px-3 py-1 rounded-t-lg text-center">
                    Most Popular - Best ROI
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {option.id === "featured" && <Star className="w-5 h-5 mr-2 text-ai-600" />}
                        {option.id === "spotlight" && <Eye className="w-5 h-5 mr-2 text-primary-600" />}
                        {option.id === "premium" && <Crown className="w-5 h-5 mr-2 text-premium-600" />}
                        {option.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success-600">${option.price}</div>
                      <div className="text-xs text-muted-foreground">{option.duration}</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <Zap className="w-3 h-3 mr-2 text-success-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-ai p-3 rounded-card">
                      <div className="text-sm text-ai-700 dark:text-ai-300 mb-1">Expected Return:</div>
                      <div className="font-medium text-ai-900 dark:text-ai-100">{option.roi}</div>
                      <div className="text-xs text-ai-600 dark:text-ai-400 mt-2">ROI: {calculateROI(option).roiPercentage}%</div>
                    </div>
                  </div>

                  <Button className="w-full" variant={selectedBoost === option.id ? "default" : "outline"}>
                    {selectedBoost === option.id ? "Selected" : "Select This Boost"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedBoost && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">Ready to Boost Your Visibility?</h3>
                  <p className="text-gray-600">Start getting more jobs today</p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    handleActivateBoost(
                      boostOptions.find((b) => b.id === selectedBoost)?.name || "",
                      boostOptions.find((b) => b.id === selectedBoost)?.price || 0,
                    )
                  }
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Activate {boostOptions.find((b) => b.id === selectedBoost)?.name} - $
                  {boostOptions.find((b) => b.id === selectedBoost)?.price}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                ROI Calculator
              </CardTitle>
              <CardDescription>See the potential return on your visibility investment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {boostOptions.map((option) => {
                  const roi = calculateROI(option)
                  return (
                    <div key={option.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">{option.name}</h4>
                        <Badge variant="outline">${option.price}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{roi.expectedJobs}</div>
                          <div className="text-xs text-gray-600">Expected Jobs</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">${roi.grossRevenue}</div>
                          <div className="text-xs text-gray-600">Gross Revenue</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">${roi.netRevenue}</div>
                          <div className="text-xs text-gray-600">Net Profit</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">{roi.roiPercentage}%</div>
                          <div className="text-xs text-gray-600">ROI</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
