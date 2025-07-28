import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, TrendingUp, Camera, Sparkles, ChevronRight, X, Check, Lightbulb, Target, Zap } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Recommendation {
  id: string
  type: "pricing" | "availability" | "profile" | "marketing" | "quality" | "booking"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: {
    metric: string
    change: string
    confidence: number
  }
  actions: Array<{
    label: string
    action: () => void
    variant?: "primary" | "secondary"
    estimated_time?: string
  }>
  insights: string[]
  deadline?: Date
  category: string
  dismissible?: boolean
}

interface AIRecommendationSystemProps {
  userId?: string
  context?: {
    page: string
    userRole: "provider" | "customer" | "admin"
    currentData?: Record<string, any>
  }
  onRecommendationAction?: (recommendationId: string, actionLabel: string) => void
  onRecommendationDismiss?: (recommendationId: string) => void
  className?: string
  variant?: "dashboard" | "sidebar" | "modal" | "inline"
  maxRecommendations?: number
}

export function AIRecommendationSystem({
  userId,
  context,
  onRecommendationAction,
  onRecommendationDismiss,
  className,
  variant = "dashboard",
  maxRecommendations = 6
}: AIRecommendationSystemProps) {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([])
  const [loading, setLoading] = React.useState(true)
  const [expandedRecommendation, setExpandedRecommendation] = React.useState<string | null>(null)
  const [dismissedRecommendations, setDismissedRecommendations] = React.useState<Set<string>>(new Set())

  // Simulate fetching AI recommendations
  React.useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockRecommendations: Recommendation[] = [
        {
          id: "pricing-optimization",
          type: "pricing",
          priority: "high",
          title: "Optimize Your Pricing",
          description: "Your current rates are 15% below market average for similar services in your area.",
          impact: {
            metric: "booking rate",
            change: "+23%",
            confidence: 0.89
          },
          actions: [
            { label: "Update Pricing", action: () => {}, variant: "primary", estimated_time: "5 min" },
            { label: "View Market Analysis", action: () => {}, variant: "secondary" }
          ],
          insights: [
            "Similar services charge $85-95 in your area",
            "Higher prices often indicate better quality to customers",
            "You have 4.8★ rating, supporting premium pricing"
          ],
          category: "Revenue",
          dismissible: true
        },
        {
          id: "profile-photos",
          type: "profile",
          priority: "high",
          title: "Add Professional Photos",
          description: "Profiles with high-quality photos receive 40% more bookings.",
          impact: {
            metric: "profile views",
            change: "+40%",
            confidence: 0.93
          },
          actions: [
            { label: "Upload Photos", action: () => {}, variant: "primary", estimated_time: "10 min" },
            { label: "Photo Guidelines", action: () => {}, variant: "secondary" }
          ],
          insights: [
            "Before/after shots perform best for your service type",
            "Natural lighting increases photo quality perception",
            "3-5 photos is the optimal number"
          ],
          category: "Profile",
          dismissible: true
        },
        {
          id: "availability-optimization",
          type: "availability",
          priority: "medium",
          title: "Expand Weekend Hours",
          description: "Your availability doesn't cover peak weekend demand periods.",
          impact: {
            metric: "weekly bookings",
            change: "+18%",
            confidence: 0.76
          },
          actions: [
            { label: "Update Schedule", action: () => {}, variant: "primary", estimated_time: "3 min" },
            { label: "View Demand Analytics", action: () => {}, variant: "secondary" }
          ],
          insights: [
            "Saturday 9-11am has highest demand in your area",
            "Weekend rates can be 20% higher",
            "Advance booking increases for weekend slots"
          ],
          category: "Scheduling",
          dismissible: true
        },
        {
          id: "response-time",
          type: "quality",
          priority: "medium",
          title: "Improve Response Time",
          description: "Faster responses lead to higher booking conversion rates.",
          impact: {
            metric: "conversion rate",
            change: "+15%",
            confidence: 0.82
          },
          actions: [
            { label: "Enable Notifications", action: () => {}, variant: "primary", estimated_time: "2 min" },
            { label: "Set Auto-Responses", action: () => {}, variant: "secondary" }
          ],
          insights: [
            "Average response time: 3.2 hours",
            "Top performers respond within 1 hour",
            "Quick responses show professionalism"
          ],
          category: "Communication",
          dismissible: true
        },
        {
          id: "seasonal-promotion",
          type: "marketing",
          priority: "low",
          title: "Create Seasonal Promotion",
          description: "Spring cleaning demand is increasing in your area.",
          impact: {
            metric: "new bookings",
            change: "+12%",
            confidence: 0.68
          },
          actions: [
            { label: "Create Promotion", action: () => {}, variant: "primary", estimated_time: "15 min" },
            { label: "View Templates", action: () => {}, variant: "secondary" }
          ],
          insights: [
            "Spring cleaning searches up 45% this month",
            "Limited-time offers create urgency",
            "Bundle services for higher value"
          ],
          category: "Marketing",
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          dismissible: true
        }
      ]
      
      setRecommendations(mockRecommendations.slice(0, maxRecommendations))
      setLoading(false)
    }

    fetchRecommendations()
  }, [userId, context, maxRecommendations])

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <UIIcons.AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Lightbulb className="h-4 w-4 text-amber-500" />
      default:
        return <Target className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200/50 bg-red-50/50 dark:bg-red-950/20"
      case "medium":
        return "border-amber-200/50 bg-amber-50/50 dark:bg-amber-950/20"
      default:
        return "border-blue-200/50 bg-blue-50/50 dark:bg-blue-950/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pricing":
        return <BusinessIcons.DollarSign className="h-4 w-4" />
      case "availability":
        return <BusinessIcons.Calendar className="h-4 w-4" />
      case "profile":
        return <Camera className="h-4 w-4" />
      case "marketing":
        return <TrendingUp className="h-4 w-4" />
      case "quality":
        return <OptimizedIcon name="Star" className="h-4 w-4" />
      case "booking":
        return <NavigationIcons.Users className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const handleAction = (recommendationId: string, actionLabel: string, action: () => void) => {
    action()
    onRecommendationAction?.(recommendationId, actionLabel)
  }

  const handleDismiss = (recommendationId: string) => {
    setDismissedRecommendations(prev => new Set([...prev, recommendationId]))
    onRecommendationDismiss?.(recommendationId)
  }

  const filteredRecommendations = recommendations.filter(
    rec => !dismissedRecommendations.has(rec.id)
  )

  if (loading) {
    return (
      <Card variant="glass" className={className}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <Brain className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <CardTitle>AI Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">Analyzing your data...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-glass rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredRecommendations.length === 0) {
    return (
      <Card variant="glass" className={className}>
        <CardContent className="text-center py-8">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">All Caught Up!</h3>
          <p className="text-sm text-muted-foreground">
            You're following all current AI recommendations. Check back later for new insights.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="glass" className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle>AI Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredRecommendations.length} personalized insights to boost your success
            </p>
          </div>
          <Badge variant="secondary" className="bg-glass">
            Updated now
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence>
          {filteredRecommendations.map((recommendation, index) => (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 cursor-pointer group relative",
                getPriorityStyles(recommendation.priority),
                expandedRecommendation === recommendation.id && "ring-2 ring-primary/20"
              )}
              onClick={() => setExpandedRecommendation(
                expandedRecommendation === recommendation.id ? null : recommendation.id
              )}
            >
              {/* Dismiss Button */}
              {recommendation.dismissible && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDismiss(recommendation.id)
                  }}
                  className="absolute top-2 right-2 p-1 rounded-lg hover:bg-glass transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              <div className="flex items-start gap-3">
                {/* Priority & Type Icons */}
                <div className="flex flex-col gap-1">
                  {getPriorityIcon(recommendation.priority)}
                  <div className="text-muted-foreground">
                    {getTypeIcon(recommendation.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{recommendation.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {recommendation.category}
                    </Badge>
                    {recommendation.deadline && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.ceil((recommendation.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {recommendation.description}
                  </p>

                  {/* Impact */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {recommendation.impact.change} {recommendation.impact.metric}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div 
                        className="h-1 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${recommendation.impact.confidence * 64}px` }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(recommendation.impact.confidence * 100)}% confident
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    {recommendation.actions.slice(0, 2).map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.variant === "primary" ? "premium" : "ghost"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAction(recommendation.id, action.label, action.action)
                        }}
                        className="h-7 px-3 text-xs"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {action.label}
                        {action.estimated_time && (
                          <span className="ml-1 opacity-60">({action.estimated_time})</span>
                        )}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs ml-auto"
                    >
                      <ChevronRight className={cn(
                        "h-3 w-3 transition-transform",
                        expandedRecommendation === recommendation.id && "rotate-90"
                      )} />
                    </Button>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedRecommendation === recommendation.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-glass-border"
                      >
                        <h5 className="font-medium text-sm mb-2">Key Insights</h5>
                        <ul className="space-y-1 mb-4">
                          {recommendation.insights.map((insight, insightIndex) => (
                            <li key={insightIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                              <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-500" />
                              {insight}
                            </li>
                          ))}
                        </ul>

                        {/* All Actions */}
                        {recommendation.actions.length > 2 && (
                          <div className="flex flex-wrap gap-2">
                            {recommendation.actions.slice(2).map((action, actionIndex) => (
                              <Button
                                key={actionIndex + 2}
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAction(recommendation.id, action.label, action.action)
                                }}
                                className="h-7 px-3 text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Summary Stats */}
        <div className="mt-6 p-4 rounded-lg bg-glass border border-glass-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">+{
                filteredRecommendations
                  .filter(r => r.priority === "high")
                  .reduce((sum, r) => sum + parseInt(r.impact.change.replace(/[^\d]/g, "")), 0)
              }%</div>
              <div className="text-xs text-muted-foreground">Potential Impact</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{filteredRecommendations.length}</div>
              <div className="text-xs text-muted-foreground">Active Recommendations</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{
                Math.round(
                  filteredRecommendations.reduce((sum, r) => sum + r.impact.confidence, 0) / 
                  filteredRecommendations.length * 100
                )
              }%</div>
              <div className="text-xs text-muted-foreground">Avg Confidence</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
