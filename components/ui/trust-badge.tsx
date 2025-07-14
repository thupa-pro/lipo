"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Shield, Star, MapPin, Clock, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface TrustScore {
  overall: number
  factors: {
    rating: { score: number; weight: number; description: string }
    verification: { score: number; weight: number; description: string }
    experience: { score: number; weight: number; description: string }
    location: { score: number; weight: number; description: string }
    availability: { score: number; weight: number; description: string }
    responseTime: { score: number; weight: number; description: string }
  }
}

interface TrustBadgeProps {
  score: number
  detailed?: boolean
  size?: "sm" | "md" | "lg"
}

export default function TrustBadge({ score, detailed = false, size = "md" }: TrustBadgeProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Mock detailed trust score data
  const trustScore: TrustScore = {
    overall: score,
    factors: {
      rating: {
        score: 95,
        weight: 30,
        description: "4.9/5 average rating from 127 completed jobs",
      },
      verification: {
        score: 100,
        weight: 25,
        description: "Identity verified, background checked, insured",
      },
      experience: {
        score: 85,
        weight: 20,
        description: "3+ years on platform, 200+ completed jobs",
      },
      location: {
        score: 90,
        weight: 10,
        description: "Located 0.3 miles from your area",
      },
      availability: {
        score: 80,
        weight: 10,
        description: "Available 6 days/week, flexible scheduling",
      },
      responseTime: {
        score: 92,
        weight: 5,
        description: "Responds within 15 minutes on average",
      },
    },
  }

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { level: "Excellent", color: "bg-green-500", textColor: "text-green-700" }
    if (score >= 80) return { level: "Very Good", color: "bg-blue-500", textColor: "text-blue-700" }
    if (score >= 70) return { level: "Good", color: "bg-yellow-500", textColor: "text-yellow-700" }
    if (score >= 60) return { level: "Fair", color: "bg-orange-500", textColor: "text-orange-700" }
    return { level: "Poor", color: "bg-red-500", textColor: "text-red-700" }
  }

  const trustLevel = getTrustLevel(score)

  const getFactorIcon = (factor: string) => {
    switch (factor) {
      case "rating":
        return <Star className="w-4 h-4" />
      case "verification":
        return <Shield className="w-4 h-4" />
      case "experience":
        return <CheckCircle className="w-4 h-4" />
      case "location":
        return <MapPin className="w-4 h-4" />
      case "availability":
        return <Clock className="w-4 h-4" />
      case "responseTime":
        return <Clock className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getFactorColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const badgeSize = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  if (!detailed) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Badge className={`${trustLevel.color} text-white hover:opacity-90 cursor-pointer ${badgeSize[size]}`}>
            <Shield className="w-3 h-3 mr-1" />
            {score}% Trust Score
          </Badge>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{score}%</div>
              <div className={`text-sm font-medium ${trustLevel.textColor}`}>{trustLevel.level} Trust Score</div>
            </div>

            <div className="space-y-3">
              {Object.entries(trustScore.factors).map(([key, factor]) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className={getFactorColor(factor.score)}>{getFactorIcon(key)}</div>
                      <span className="ml-2 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    </div>
                    <span className="font-medium">{factor.score}%</span>
                  </div>
                  <Progress value={factor.score} className="h-1" />
                  <div className="text-xs text-gray-500">{factor.description}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                <div className="text-xs text-blue-700">
                  <div className="font-medium mb-1">How Trust Scores Work</div>
                  <div>
                    We analyze multiple factors including ratings, verification status, experience, and reliability to
                    calculate a comprehensive trust score.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 ${trustLevel.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
          <Shield className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">{score}%</CardTitle>
        <CardDescription className={`font-medium ${trustLevel.textColor}`}>
          {trustLevel.level} Trust Score
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {Object.entries(trustScore.factors).map(([key, factor]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={getFactorColor(factor.score)}>{getFactorIcon(key)}</div>
                  <span className="ml-2 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {factor.weight}%
                  </Badge>
                </div>
                <span className="text-sm font-bold">{factor.score}%</span>
              </div>
              <Progress value={factor.score} className="h-2" />
              <div className="text-xs text-gray-600">{factor.description}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 mr-2" />
            <div className="text-xs text-gray-700">
              <div className="font-medium mb-1">Trust Score Calculation</div>
              <div>
                This score is calculated using weighted factors. Higher scores indicate more reliable and trustworthy
                service providers.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
