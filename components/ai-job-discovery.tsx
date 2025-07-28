import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Lightbulb } from "lucide-react";

interface JobSuggestion {
  category: string
  title: string
  description: string
  urgency: "low" | "medium" | "high"
  estimatedPrice: string
  confidence: number
  budget: string
}

interface AIJobDiscoveryProps {
  onSelect: (suggestion: JobSuggestion) => void
}

export function AIJobDiscovery({ onSelect }: AIJobDiscoveryProps) {
  const [step, setStep] = useState(1)
  const [userInput, setUserInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<JobSuggestion | null>(null)

  // Simulate AI analysis
  const analyzeUserInput = async () => {
    setIsAnalyzing(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock AI suggestions based on input keywords
    const mockSuggestions: JobSuggestion[] = []

    if (userInput.toLowerCase().includes("clean")) {
      mockSuggestions.push({
        category: "cleaning",
        title: "Deep House Cleaning Service",
        description:
          "Professional deep cleaning including, kitchen, bathrooms, bedrooms, and living areas with eco-friendly products.",
        urgency: "medium",
        estimatedPrice: "$75-120",
        confidence: 95,
        budget: "100-250",
      })
    }

    if (userInput.toLowerCase().includes("fix") || userInput.toLowerCase().includes("repair")) {
      mockSuggestions.push({
        category: "handyman",
        title: "Home Repair & Maintenance",
        description: "General handyman services for minor, repairs, fixture, installation, and basic troubleshooting.",
        urgency: "urgent",
        estimatedPrice: "$50-80/hr",
        confidence: 88,
        budget: "50-100",
      })
    }

    if (userInput.toLowerCase().includes("move") || userInput.toLowerCase().includes("moving")) {
      mockSuggestions.push({
        category: "moving",
        title: "Moving & Packing Assistance",
        description: "Professional moving help including, packing, loading, and transportation coordination.",
        urgency: "urgent",
        estimatedPrice: "$100-200",
        confidence: 85,
        budget: "100-250",
      })
    }

    if (userInput.toLowerCase().includes("tutor") || userInput.toLowerCase().includes("teach")) {
      mockSuggestions.push({
        category: "tutoring",
        title: "Academic Tutoring Service",
        description: "Personalized tutoring sessions for various subjects and grade levels.",
        urgency: "soon",
        estimatedPrice: "$30-50/hr",
        confidence: 82,
        budget: "50-100",
      })
    }

    // Default suggestion if no specific keywords
    if (mockSuggestions.length === 0) {
      mockSuggestions.push({
        category: "other",
        title: "General Service Request",
        description: "Custom service based on your specific needs and requirements.",
        urgency: "flexible",
        estimatedPrice: "$40-80",
        confidence: 75,
        budget: "under-50",
      })
    }

    setSuggestions(mockSuggestions)
    setIsAnalyzing(false)
    setStep(2)
  }

  const selectSuggestion = (suggestion: JobSuggestion) => {
    setSelectedSuggestion(suggestion)
    setStep(3)
  }

  const confirmSelection = () => {
    if (selectedSuggestion) {
      onSelect(selectedSuggestion)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "soon":
        return "bg-blue-100 text-blue-700"
      case "flexible":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Job Discovery Assistant</h3>
            <p className="text-muted-foreground">
              Describe what you need help, with, and I'll suggest the perfect service for you
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-description">What do you need help with?</Label>
              <Textarea
                id="ai-description"
                placeholder="e.g., My apartment is messy and I'm moving out next week. I need someone to clean it thoroughly before the landlord inspection..."
                rows={4}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <OptimizedIcon name="MessageSquare" className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">AI-Powered Suggestions</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Our AI will analyze your description and suggest the best service, category, estimated, pricing, and
                    urgency level to help you get matched faster.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={analyzeUserInput} disabled={!userInput.trim() || isAnalyzing} className="w-full" size="lg">
              {isAnalyzing ? (
                <>
                  <UIIcons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing your request...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get AI Suggestions
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">AI Suggestions for Your Request</h3>
            <p className="text-muted-foreground">Based on your, description, here are the best matches:</p>
          </div>

          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                onClick={() => selectSuggestion(suggestion)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold">{suggestion.title}</h4>
                        <Badge variant="outline">{suggestion.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{suggestion.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 mb-1">{suggestion.estimatedPrice}</div>
                      <div className="text-xs text-muted-foreground">{suggestion.confidence}% match</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getUrgencyColor(suggestion.urgency)}>
                      <OptimizedIcon name="Clock" className="w-3 h-3 mr-1" />
                      {suggestion.urgency.charAt(0).toUpperCase() + suggestion.urgency.slice(1)} Priority
                    </Badge>
                    <Button size="sm">Select This Service</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => setStep(1)}>
              <OptimizedIcon name="MessageSquare" className="w-4 h-4 mr-2" />
              Try Different Description
            </Button>
          </div>
        </div>
      )}

      {step === 3 && selectedSuggestion && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIIcons.CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Perfect Match Found!</h3>
            <p className="text-muted-foreground">Your AI-optimized job posting is ready to go live</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-2">{selectedSuggestion.title}</h4>
            <p className="text-muted-foreground mb-4">{selectedSuggestion.description}</p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium capitalize">{selectedSuggestion.category}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Estimated Cost</div>
                <div className="font-medium text-green-600">{selectedSuggestion.estimatedPrice}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Priority</div>
                <Badge className={getUrgencyColor(selectedSuggestion.urgency)}>{selectedSuggestion.urgency}</Badge>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              AI Optimization Benefits
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 3x faster provider matching with optimized keywords</li>
              <li>• Accurate pricing reduces negotiation time</li>
              <li>• Priority level helps providers understand urgency</li>
              <li>• {selectedSuggestion.confidence}% confidence score ensures quality matches</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Button className="flex-1" size="lg" onClick={confirmSelection}>
              <Sparkles className="w-4 h-4 mr-2" />
              Use This Suggestion
            </Button>
            <Button variant="outline" onClick={() => setStep(2)}>
              Choose Different Option
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
