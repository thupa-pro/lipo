"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Lightbulb, DollarSign, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface JobSuggestion {
  title: string
  description: string
  category: string
  urgency: "low" | "medium" | "high"
  estimatedPrice: string
  confidence: number
}

interface SmartJobInputProps {
  label: string
  onSuggestionSelect: (suggestion: JobSuggestion) => void
  value?: string
  onChange?: (value: string) => void
}

export default function SmartJobInput({ label, onSuggestionSelect, value = "", onChange }: SmartJobInputProps) {
  const [input, setInput] = useState(value)
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { toast } = useToast()

  // Simulate AI analysis with debouncing
  useEffect(() => {
    if (input.length < 10) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(() => {
      analyzeInput(input)
    }, 1000)

    return () => clearTimeout(timer)
  }, [input])

  const analyzeInput = async (text: string) => {
    setIsAnalyzing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI suggestions based on input keywords
    const mockSuggestions: JobSuggestion[] = []

    if (text.toLowerCase().includes("clean")) {
      mockSuggestions.push({
        title: "Deep House Cleaning Service",
        description:
          "Professional deep cleaning including kitchen, bathrooms, bedrooms, and living areas with eco-friendly products.",
        category: "House Cleaning",
        urgency: "medium",
        estimatedPrice: "$75-120",
        confidence: 92,
      })
    }

    if (text.toLowerCase().includes("fix") || text.toLowerCase().includes("repair")) {
      mockSuggestions.push({
        title: "Home Repair & Maintenance",
        description: "General handyman services for minor repairs, fixture installation, and basic troubleshooting.",
        category: "Handyman Services",
        urgency: "high",
        estimatedPrice: "$50-80/hr",
        confidence: 88,
      })
    }

    if (text.toLowerCase().includes("move") || text.toLowerCase().includes("moving")) {
      mockSuggestions.push({
        title: "Moving & Packing Assistance",
        description: "Professional moving help including packing, loading, and transportation coordination.",
        category: "Moving Services",
        urgency: "high",
        estimatedPrice: "$100-200",
        confidence: 85,
      })
    }

    // Default suggestion if no specific keywords
    if (mockSuggestions.length === 0) {
      mockSuggestions.push({
        title: "General Service Request",
        description: "Custom service based on your specific needs and requirements.",
        category: "General Services",
        urgency: "medium",
        estimatedPrice: "$40-80",
        confidence: 75,
      })
    }

    setSuggestions(mockSuggestions)
    setShowSuggestions(true)
    setIsAnalyzing(false)
    toast({
      title: "AI Suggestions Ready!",
      description: "Choose a suggestion to autofill your job details.",
      variant: "default",
    })
  }

  const handleInputChange = (newValue: string) => {
    setInput(newValue)
    onChange?.(newValue)
  }

  const selectSuggestion = (suggestion: JobSuggestion) => {
    setInput(suggestion.description)
    onChange?.(suggestion.description)
    onSuggestionSelect(suggestion)
    setShowSuggestions(false)
    toast({
      title: "Suggestion Applied!",
      description: `Job details autofilled with "${suggestion.title}".`,
      variant: "default",
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-input" className="flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
          {label}
        </Label>
        <Textarea
          id="job-input"
          placeholder="Describe what you need help with... (e.g., 'I need my apartment cleaned before moving out next week')"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          rows={4}
          className="mt-2"
        />

        {isAnalyzing && (
          <div className="flex items-center mt-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            AI is analyzing your request...
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-purple-600" />
              AI Suggestions
            </CardTitle>
            <CardDescription>Based on your description, here are optimized job postings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => selectSuggestion(suggestion)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    <Badge variant="outline" className="mt-1">
                      {suggestion.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {suggestion.estimatedPrice}
                    </div>
                    <div className="text-xs text-gray-500">{suggestion.confidence}% match</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                <div className="flex items-center justify-between">
                  <Badge className={getUrgencyColor(suggestion.urgency)}>
                    <Clock className="w-3 h-3 mr-1" />
                    {suggestion.urgency.charAt(0).toUpperCase() + suggestion.urgency.slice(1)} Priority
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => selectSuggestion(suggestion)}>
                    Use This Suggestion
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {input.length > 0 && input.length < 10 && (
        <div className="text-sm text-gray-500 flex items-center">
          <Sparkles className="w-4 h-4 mr-2" />
          Keep typing for AI suggestions (minimum 10 characters)
        </div>
      )}
    </div>
  )
}