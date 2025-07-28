import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Brain, BarChart3 } from "lucide-react";
import { ThemeToggleIcon } from "@/components/ui/theme-toggle";
import FunnelAnalyzer from "@/components/analytics/funnel-analyzer";
import SmartFormAssistant from "@/components/ui/smart-form-assistant";
import UrgencyNotificationSystem from "@/components/provider/urgency-notification-system";
import EscrowExplainer from "@/components/ui/escrow-explainer";
import Link from "next/link";

export default function FunnelOptimizationPage() {
  const [optimizationScore] = useState(87);

  const impactMetrics = [
    { label: "Form Completion", before: 42, after: 58, improvement: "+38%" },
    {
      label: "Provider Acceptance",
      before: 27,
      after: 33,
      improvement: "+23%",
    },
    { label: "Payment Conversion", before: 24, after: 28, improvement: "+15%" },
    { label: "Overall Funnel", before: 20, after: 22, improvement: "+12%" },
  ];

  const optimizationFeatures = [
    {
      title: "Smart Form Assistant",
      description: "AI-powered suggestions and auto-completion",
      impact: "High",
      status: "Active",
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      title: "Urgency Notifications",
      description: "Real-time alerts for high-priority jobs",
      impact: "High",
      status: "Active",
      icon: Zap,
      color: "bg-yellow-500",
    },
    {
      title: "Escrow Explainer",
      description: "Interactive payment security guide",
      impact: "Medium",
      status: "Active",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Behavioral Analytics",
      description: "User journey tracking and optimization",
      impact: "High",
      status: "Learning",
      icon: BarChart3,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Loconomy
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-500 text-white">
              Optimization Active
            </Badge>
            <ThemeToggleIcon />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Funnel Optimization Engine
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            AI-powered conversion optimization eliminating bottlenecks and
            boosting user engagement
          </p>
          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {optimizationScore}%
              </div>
              <div className="text-sm text-muted-foreground">
                Optimization Score
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">+27%</div>
              <div className="text-sm text-muted-foreground">
                Conversion Uplift
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">4.2min</div>
              <div className="text-sm text-muted-foreground">
                Avg Response Time
              </div>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Optimization Impact
            </CardTitle>
            <CardDescription>
              Measurable improvements across the conversion funnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {impactMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-muted-foreground mb-1">
                      {metric.before}%
                    </div>
                    <div className="text-xs text-muted-foreground">Before</div>
                  </div>
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-lg font-bold text-green-600">
                      {metric.improvement}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {metric.after}%
                    </div>
                    <div className="text-xs text-muted-foreground">After</div>
                  </div>
                  <div className="text-sm font-medium">{metric.label}</div>
                  <Progress value={metric.after} className="mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <NavigationIcons.Settings className="w-5 h-5 mr-2" />
              Active Optimizations
            </CardTitle>
            <CardDescription>
              AI-powered features improving user experience and conversions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {optimizationFeatures.map((feature, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center`}
                        >
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {feature.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                feature.impact === "High"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {feature.impact} Impact
                            </Badge>
                            <Badge
                              variant={
                                feature.status === "Active"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {feature.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Funnel Analytics</TabsTrigger>
            <TabsTrigger value="form-assistant">Smart Forms</TabsTrigger>
            <TabsTrigger value="notifications">Urgency Alerts</TabsTrigger>
            <TabsTrigger value="escrow">Payment Security</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <FunnelAnalyzer />
          </TabsContent>

          <TabsContent value="form-assistant">
            <SmartFormAssistant />
          </TabsContent>

          <TabsContent value="notifications">
            <UrgencyNotificationSystem />
          </TabsContent>

          <TabsContent value="escrow">
            <EscrowExplainer />
          </TabsContent>
        </Tabs>

        {/* Success Metrics */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UIIcons.CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Optimization Engine Fully Deployed!
              </h3>
              <p className="text-muted-foreground mb-4">
                Your conversion funnel is now optimized with AI-powered
                improvements that eliminate bottlenecks and boost engagement.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">+38%</div>
                  <div className="text-sm text-muted-foreground">
                    Form Completion
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">87%</div>
                  <div className="text-sm text-muted-foreground">
                    AI Match Accuracy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    4.8/5
                  </div>
                  <div className="text-sm text-muted-foreground">
                    User Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
