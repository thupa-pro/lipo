import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles, Brain, Zap, Target } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AIPatternShowcaseProps {
  className?: string
}

export function AIPatternShowcase({ className }: AIPatternShowcaseProps) {
  const [activePattern, setActivePattern] = React.useState(0)
  const [smartInputValue, setSmartInputValue] = React.useState("")
  const [aiThinking, setAiThinking] = React.useState(false)

  const patterns = [
    {
      title: "Smart Suggestions",
      description: "AI-powered contextual suggestions that appear based on user behavior",
      icon: Brain,
      demo: "suggestion"
    },
    {
      title: "Predictive Actions",
      description: "Interface elements that anticipate user needs and provide shortcuts",
      icon: Zap,
      demo: "prediction"
    },
    {
      title: "Contextual Intelligence",
      description: "Smart forms and inputs that adapt to user context",
      icon: Target,
      demo: "context"
    }
  ]

  const handleSmartInput = (value: string) => {
    setSmartInputValue(value)
    if (value.length > 3) {
      setAiThinking(true)
      setTimeout(() => setAiThinking(false), 1500)
    }
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto p-6", className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-glass-border backdrop-blur-glass mb-6"
        >
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">AI-Native Design Patterns</span>
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Intelligent User Experience
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how AI-driven patterns create seamless, contextual interactions 
          that anticipate user needs and enhance productivity.
        </p>
      </div>

      {/* Pattern Navigation */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Pattern List */}
        <div className="lg:w-1/3">
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  variant={activePattern === index ? "premium" : "glass"}
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    activePattern === index && "ring-2 ring-primary/20"
                  )}
                  onClick={() => setActivePattern(index)}
                >
                  <CardHeader variant="compact">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        activePattern === index 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                          : "bg-glass text-muted-foreground"
                      )}>
                        <pattern.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle size="sm">{pattern.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pattern.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pattern Demo */}
        <div className="lg:w-2/3">
          <Card variant="glass" size="lg" className="h-full">
            <CardContent>
              <motion.div
                key={activePattern}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activePattern === 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Smart Suggestions Demo</h3>
                    
                    {/* AI Suggestion Cards */}
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium">Complete your profile</h4>
                              <span className="text-xs bg-glass px-2 py-0.5 rounded-full">
                                89% confident
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Adding a photo increases booking rates by 40%. Based on successful profiles in your area.
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="premium" className="h-8 px-3 text-xs">
                                Add Photo
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                                Later
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 rounded-xl bg-glass border border-glass-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium mb-1">Optimize pricing</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Similar services in your area charge 15% more. Consider adjusting your rates.
                            </p>
                            <Button size="sm" variant="outline" className="h-8 px-3 text-xs">
                              View Recommendations
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {activePattern === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Predictive Actions Demo</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-glass border border-glass-border">
                        <h4 className="font-medium mb-4">Quick Actions (Predicted based on your activity)</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="glass" className="justify-start">
                            <span className="mr-2">📅</span>
                            Set Availability
                          </Button>
                          <Button variant="glass" className="justify-start">
                            <span className="mr-2">💬</span>
                            Reply to Messages
                          </Button>
                          <Button variant="glass" className="justify-start">
                            <span className="mr-2">📊</span>
                            View Analytics
                          </Button>
                          <Button variant="glass" className="justify-start">
                            <span className="mr-2">⭐</span>
                            Check Reviews
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium">Smart Reminder</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You usually update your availability on Sundays. Would you like to do that now?
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activePattern === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Contextual Intelligence Demo</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Service Description</label>
                        <Input
                          variant="premium"
                          placeholder="Start typing your service description..."
                          value={smartInputValue}
                          onChange={(e) => handleSmartInput(e.target.value)}
                          className={cn(aiThinking && "animate-glow-pulse")}
                        />
                        
                        {aiThinking && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="animate-spin">
                                <Sparkles className="h-3 w-3 text-blue-500" />
                              </div>
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                AI Assistant is analyzing...
                              </span>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Generating SEO-optimized description based on high-performing listings
                            </p>
                          </motion.div>
                        )}

                        {smartInputValue.length > 10 && !aiThinking && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="h-3 w-3 text-emerald-500" />
                              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                Smart Suggestions
                              </span>
                            </div>
                            <div className="space-y-1">
                              <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline block">
                                + Add "licensed and insured" (increases trust by 23%)
                              </button>
                              <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline block">
                                + Include "same-day service" (popular in your area)
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-glass border border-glass-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Smart Pricing</h4>
                          <span className="text-xs bg-glass px-2 py-1 rounded-full">AI Recommended</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">$75</div>
                            <div className="text-xs text-muted-foreground">Recommended</div>
                          </div>
                          <UIIcons.ArrowRight className="h-4 w-4 text-muted-foreground" / />
                          <div className="text-sm text-muted-foreground">
                            Based on 47 similar services in your area
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
