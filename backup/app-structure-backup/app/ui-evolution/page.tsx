"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  TrendingUp,
  MessageSquare,
  Shield,
  Zap,
  Eye,
  Target,
  Brain,
  Rocket,
} from "lucide-react";
import SmartJobInput from "@/components/ui/smart-job-input";
import MatchTimeline from "@/components/ui/match-timeline";
import VisibilityBooster from "@/components/provider/visibility-booster";
import ChatBubble, { TypingIndicator } from "@/components/messages/chat-bubble";
import TrustBadge from "@/components/ui/trust-badge";

export default function UIEvolutionPage() {
  const [selectedDemo, setSelectedDemo] = useState<string>("");

  const evolutionMetrics = [
    {
      label: "Form Completion Rate",
      before: 65,
      after: 87,
      improvement: "+35%",
    },
    { label: "User Retention", before: 72, after: 92, improvement: "+28%" },
    { label: "Contact Conversion", before: 45, after: 59, improvement: "+31%" },
    {
      label: "Provider Monetization",
      before: 23,
      after: 33,
      improvement: "+45%",
    },
  ];

  const features = [
    {
      id: "smart-input",
      name: "Smart Job Input Assistant",
      description: "AI-powered job suggestion engine with auto-completion",
      icon: Brain,
      impact: "35% reduction in form abandonment",
      color: "bg-purple-500",
    },
    {
      id: "match-timeline",
      name: "Real-time Match Timeline",
      description: "Visual progress tracking with estimated completion times",
      icon: Target,
      impact: "28% increase in completion rates",
      color: "bg-blue-500",
    },
    {
      id: "visibility-booster",
      name: "Smart Visibility Booster",
      description: "Contextual upgrade prompts with ROI calculations",
      icon: Rocket,
      impact: "45% increase in provider monetization",
      color: "bg-green-500",
    },
    {
      id: "enhanced-messaging",
      name: "Enhanced Messaging Experience",
      description:
        "Typing, indicators, read, receipts, and improved chat bubbles",
      icon: MessageSquare,
      impact: "22% improvement in response rates",
      color: "bg-orange-500",
    },
    {
      id: "trust-badge",
      name: "Interactive Trust Score Breakdown",
      description: "Transparent trust score explanation with hover tooltips",
      icon: Shield,
      impact: "31% increase in provider contact rates",
      color: "bg-indigo-500",
    },
  ];

  const mockMessages = [
    {
      id: "1",
      content:
        "Hi! I'm interested in your cleaning service. Are you available this weekend?",
      senderId: "user1",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      timestamp: new Date(Date.now() - 300000),
      status: "read" as const,
      type: "text" as const,
      isOwn: false,
    },
    {
      id: "2",
      content:
        "Hello Sarah! Yes, I have availability this Saturday afternoon. What type of cleaning service are you looking for?",
      senderId: "provider1",
      senderName: "Mike Rodriguez",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      timestamp: new Date(Date.now() - 240000),
      status: "read" as const,
      type: "text" as const,
      isOwn: true,
    },
    {
      id: "3",
      content:
        "I need a deep clean for my 2-bedroom apartment. Moving out next week and want to get the deposit back!",
      senderId: "user1",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      timestamp: new Date(Date.now() - 180000),
      status: "read" as const,
      type: "text" as const,
      isOwn: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              UI Evolution Engine
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Intelligent UI improvements that automatically optimize for higher
              conversion
            </p>
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Live & Learning
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Evolution Impact Metrics
            </CardTitle>
            <CardDescription>
              Measurable improvements from AI-driven UI optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              {evolutionMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {metric.improvement}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {metric.label}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Before: {metric.before}%</span>
                      <span>After: {metric.after}%</span>
                    </div>
                    <Progress value={metric.after} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Showcase */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="smart-input">Smart Input</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="booster">Booster</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="trust">Trust Score</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-green-800">
                        Impact:
                      </div>
                      <div className="text-sm text-green-700">
                        {feature.impact}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="smart-input" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  Smart Job Input Assistant Demo
                </CardTitle>
                <CardDescription>
                  AI-powered suggestions that auto-complete job titles and
                  descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SmartJobInput
                  label="What do you need help with?"
                  onSuggestionSelect={(suggestion) => {
                    // Handle suggestion selection
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Real-time Match Timeline Demo
                </CardTitle>
                <CardDescription>
                  Visual progress tracking with estimated completion times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MatchTimeline jobId="demo-job-123456" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booster" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-green-600" />
                  Smart Visibility Booster Demo
                </CardTitle>
                <CardDescription>
                  Contextual upgrade prompts with ROI calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VisibilityBooster providerId="demo-provider-123" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messaging" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                  Enhanced Messaging Experience Demo
                </CardTitle>
                <CardDescription>
                  Typing, indicators, read, receipts, and improved chat bubbles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  {mockMessages.map((message) => (
                    <ChatBubble
                      key={message.id}
                      message={message}
                      onReply={(msg) => console.log("Reply to:", msg)}
                      onReact={(id, reaction) =>
                        console.log("React:", id, reaction)
                      }
                    />
                  ))}
                  <TypingIndicator senderName="Mike Rodriguez" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trust" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                    Trust Badge (Hover)
                  </CardTitle>
                  <CardDescription>
                    Hover over the badge to see the detailed breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <TrustBadge score={92} size="lg" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Trust Score</CardTitle>
                  <CardDescription>
                    Full breakdown view with all scoring factors
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <TrustBadge score={92} detailed={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Evolution Engine Status */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900">
                    Evolution Engine Status
                  </h3>
                  <p className="text-purple-700">
                    Continuously learning and optimizing user experience
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">Active</div>
                <div className="text-sm text-gray-600">
                  Learning from 1,247 interactions
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">15</div>
                <div className="text-xs text-gray-600">A/B Tests Running</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">92%</div>
                <div className="text-xs text-gray-600">
                  Optimization Success
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">2.3s</div>
                <div className="text-xs text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">24/7</div>
                <div className="text-xs text-gray-600">Monitoring Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
