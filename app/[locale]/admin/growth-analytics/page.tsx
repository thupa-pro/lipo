"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Users,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  DollarSign,
  Eye,
  CheckCircle
} from "lucide-react";
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface GrowthMetric {
  name: string
  value: string | number
  unit?: string
  change: number
  description: string
}

interface ABTestSummary {
  id: string
  name: string
  status: "running" | "completed" | "paused"
  winner?: string
  conversionLift: number
  confidence: number
}

export default function GrowthAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  const { toast } = useToast()

  // Mock data for growth metrics
  const growthMetrics: GrowthMetric[] = [
    {
      name: "New Signups",
      value: 890,
      change: 15,
      unit: "",
      description: "Users joined this period",
    },
    {
      name: "Conversion Rate",
      value: 12.3,
      change: 2.1,
      unit: "%",
      description: "Visitors to completed jobs",
    },
    {
      name: "User Retention",
      value: 78,
      change: 3.5,
      unit: "%",
      description: "Users active after 30 days",
    },
    {
      name: "Avg. Revenue per User",
      value: 47.5,
      change: 8.2,
      unit: "$",
      description: "Monetization efficiency",
    },
  ]

  const userGrowthData = [
    { date: "Apr 1", users: 100 },
    { date: "Apr 5", users: 120 },
    { date: "Apr 10", users: 150 },
    { date: "Apr 15", users: 130 },
    { date: "Apr 20", users: 180 },
    { date: "Apr 25", users: 200 },
    { date: "Apr 30", users: 220 },
  ]

  const abTestSummaries: ABTestSummary[] = [
    {
      id: "ab-1",
      name: "Homepage CTA Button Text",
      status: "completed",
      winner: "Variant B",
      conversionLift: 18.5,
      confidence: 98.2,
    },
    {
      id: "ab-2",
      name: "Provider Profile Layout",
      status: "running",
      conversionLift: 5.2,
      confidence: 72.1,
    },
    {
      id: "ab-3",
      name: "Signup Flow Steps",
      status: "paused",
      conversionLift: 0,
      confidence: 50,
    },
  ]

  const marketingCampaigns = [
    {
      id: "mkt-1",
      name: "Spring Cleaning Promo",
      status: "Active",
      budget: 5000,
      conversions: 120,
      roi: 150,
    },
    {
      id: "mkt-2",
      name: "New User Welcome Offer",
      status: "Completed",
      budget: 2000,
      conversions: 80,
      roi: 200,
    },
  ]

  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--primary))",
    },
  }

  const getChangeColor = (change: number) => {
    return change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const getChangeIcon = (change: number) => {
    return change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "bg-green-100 text-green-700"
    if (confidence >= 80) return "bg-yellow-100 text-yellow-700"
    return "bg-gray-100 text-gray-700"
  }

  const handleViewDetails = (type: string, id: string) => {
    toast({
      title: `Viewing ${type} Details`,
      description: `Opening details for ${type} ID: ${id}.`,
      variant: "default",
    })
    // In a real, app, navigate to specific detail pages
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-9 h-9 text-success-600" />
            Growth & Analytics
          </h1>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Access detailed performance metrics and insights to drive platform growth and optimization.
        </p>

        {/* Key Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {growthMetrics.map((metric, index) => (
            <Card key={index} className="card-glass-ai interactive-hover">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
                  <div className="text-4xl font-bold mt-2 text-blue-800 dark:text-blue-200">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${getChangeColor(metric.change)}`}>
                    {getChangeIcon(metric.change)}
                    {Math.abs(metric.change)}% vs last period
                  </p>
                </div>
                <Users className="w-12 h-12 text-blue-600 opacity-30" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Growth Chart & A/B Test Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6 text-primary" />
                User Growth Trend
              </CardTitle>
              <CardDescription>Daily new user signups over the last {timeRange}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                </SelectContent>
                </Select>
              </div>
              <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="users" stroke="var(--color-users)" fill="var(--color-users)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FlaskConical className="w-6 h-6 text-primary" />
                A/B Test Summary
              </CardTitle>
              <CardDescription>Overview of active and recently completed A/B tests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTestSummaries.map((test) => (
                  <Card key={test.id} className="card-glass-ai interactive-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{test.name}</h3>
                        <Badge className={getConfidenceColor(test.confidence)}>
                          {test.confidence}% Confidence
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        <div>Status: <Badge variant="outline" className="capitalize">{test.status}</Badge></div>
                        {test.winner && <div>Winner: <Badge className="bg-green-500 text-white">{test.winner}</Badge></div>}
                        {test.conversionLift > 0 && <div>Lift: <span className="font-medium text-green-600">+{test.conversionLift}%</span></div>}
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails("A/B Test", test.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketing Campaign Performance & Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <DollarSign className="w-6 h-6 text-primary" />
                Marketing Campaign Performance
              </CardTitle>
              <CardDescription>Track the effectiveness of your marketing initiatives.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketingCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="card-glass-premium interactive-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        <Badge variant="outline" className="capitalize">{campaign.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <div>Budget: <span className="font-medium">${campaign.budget.toLocaleString()}</span></div>
                        <div>Conversions: <span className="font-medium">{campaign.conversions}</span></div>
                        <div>ROI: <span className="font-medium text-green-600">{campaign.roi}%</span></div>
                      </div>
                      <Button size="sm" variant="outline" className="mt-3" onClick={() => handleViewDetails("Campaign", campaign.id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="w-6 h-6 text-primary" />
                Key Insights & Recommendations
              </CardTitle>
              <CardDescription>Actionable takeaways from your platform's performance data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Optimized CTA buttons increased conversions by 18.5%.</div>
                    <div className="text-sm text-muted-foreground">
                      Roll out winning variant globally for maximum impact.
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">User retention is, strong, focus on acquisition.</div>
                    <div className="text-sm text-muted-foreground">
                      Allocate more budget to top-performing acquisition channels.
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">High ROI from targeted seasonal campaigns.</div>
                    <div className="text-sm text-muted-foreground">
                      Plan more seasonal promotions for key service categories.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <Card className="mt-10 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-950/30 dark:to-blue-950/30 shadow-xl border-none">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-3 text-green-800 dark:text-green-200">
              Drive Continuous Growth and Optimization
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Leverage data-driven insights to make informed decisions and accelerate your platform's success.
            </p>
            <Button size="lg" variant="default" asChild className="shadow-md hover:shadow-lg transition-all">
              <Link href="/admin">Back to Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
