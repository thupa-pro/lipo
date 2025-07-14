"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Sparkles, Lightbulb, TrendingUp } from "lucide-react"

interface Suggestion {
  type: "title" | "description" | "budget" | "category"
  text: string
  confidence: number
  reasoning: string
}

interface FormData {
  title: string
  description: string
  category: string
  budget: string
  location: string
}

export default function SmartFormAssistant() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    budget: "",
    location: "",
  })

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [completionScore, setCompletionScore] = useState(0)
  const [aiInsights, setAiInsights] = useState<string[]>([])

  // Simulate AI analysis
  useEffect(() => {
    if (formData.title || formData.description) {
      setIsAnalyzing(true)
      const timer = setTimeout(() => {
        generateSuggestions()
        setIsAnalyzing(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [formData.title, formData.description])

  // Calculate completion score
  useEffect(() => {
    const fields = Object.values(formData)
    const filledFields = fields.filter((field) => field.trim() !== "").length
    const score = (filledFields / fields.length) * 100
    setCompletionScore(score)
  }, [formData])

  const generateSuggestions = () => {
    const newSuggestions: Suggestion[] = []
    const insights: string[] = []

    // Title suggestions based on input
    if (formData.title.toLowerCase().includes("clean")) {
      newSuggestions.push({
        type: "title",
        text: "Deep Clean 3-Bedroom Apartment",
        confidence: 92,
        reasoning: "Specific room count increases booking rate by 34%",
      })
      newSuggestions.push({
        type: "budget",
        text: "$75-120",
        confidence: 88,
        reasoning: "Average cleaning job in your area",
      })
      insights.push("Cleaning jobs with specific details get 40% more responses")
    }

    if (formData.title.toLowerCase().includes("fix") || formData.title.toLowerCase().includes("repair")) {
      newSuggestions.push({
        type: "title",
        text: "Fix Kitchen Sink Leak - Urgent",
        confidence: 89,
        reasoning: "Urgency keywords increase response rate by 45%",
      })
      newSuggestions.push({
        type: "budget",
        text: "$80-150",
        confidence: 85,
        reasoning: "Typical handyman repair cost range",
      })
      insights.push("Repair jobs marked as 'urgent' get matched 60% faster")
    }

    if (formData.description.toLowerCase().includes("dog") || formData.description.toLowerCase().includes("pet")) {
      newSuggestions.push({
        type: "category",
        text: "Pet Care",
        confidence: 95,
        reasoning: "Auto-detected from description keywords",
      })
      newSuggestions.push({
        type: "budget",
        text: "$25-40/hour",
        confidence: 90,
        reasoning: "Standard pet care rates in your area",
      })
      insights.push("Pet care jobs with photos get 3x more applications")
    }

    // Generic helpful suggestions
    if (formData.title && !formData.description) {
      newSuggestions.push({
        type: "description",
        text: "Include specific details about what needs to be done, when you need it completed, and any special requirements or preferences.",
        confidence: 85,
        reasoning: "Detailed descriptions improve match quality by 28%",
      })
    }

    setSuggestions(newSuggestions)
    setAiInsights(insights)
  }

  const applySuggestion = (suggestion: Suggestion) => {
    setFormData((prev) => ({
      ...prev,
      [suggestion.type]: suggestion.text,
    }))
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Smart Job Form Assistant
          </CardTitle>
          <CardDescription>AI-powered suggestions to help you create the perfect job posting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Completion Score */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Form Completion Score</span>
              <span className="text-sm font-bold text-primary">{Math.round(completionScore)}%</span>
            </div>
            <Progress value={completionScore} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              Complete forms get {completionScore > 80 ? "3x" : "2x"} more responses
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="What do you need help with?"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your job in detail..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., House Cleaning"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $50-100"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Your address or neighborhood"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>

          {/* AI Analysis Status */}
          {isAnalyzing && (
            <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Brain className="w-5 h-5 mr-2 text-blue-600 animate-pulse" />
              <span className="text-blue-700 dark:text-blue-300">AI analyzing your input...</span>
            </div>
          )}

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                <h4 className="font-semibold">AI Suggestions</h4>
              </div>

              <div className="grid gap-3">
                {suggestions.map((suggestion, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {suggestion.type}
                            </Badge>
                            <Badge className="bg-green-500 text-white text-xs">
                              {suggestion.confidence}% confidence
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-1">{suggestion.text}</p>
                          <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => applySuggestion(suggestion)}>
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {aiInsights.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Pro Tips</h4>
              </div>
              <ul className="space-y-1">
                {aiInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start">
                    <TrendingUp className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
