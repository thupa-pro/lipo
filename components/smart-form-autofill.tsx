"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Wand2} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FormData {
  title: string
  category: string
  description: string
  urgency: string
  estimatedDuration: string
  skills: string[]
  budget: string
}

export default function SmartFormAutofill() {
  const [freeTextInput, setFreeTextInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    description: "",
    urgency: "",
    estimatedDuration: "",
    skills: [],
    budget: "",
  })
  const [suggestions, setSuggestions] = useState<Partial<FormData>>({})
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { toast } = useToast()

  // Simulate AI analysis with streaming suggestions
  const analyzeAndSuggest = async () => {
    if (!freeTextInput.trim()) return

    setIsAnalyzing(true)
    setShowSuggestions(false)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock AI-generated suggestions based on input
    const aiSuggestions: Partial<FormData> = {
      title: "Professional House Cleaning Service",
      category: "house-cleaning",
      description:
        "Deep cleaning service for a 3-bedroom apartment including kitchen, bathrooms, living areas, and bedrooms. Focus on move-out preparation with attention to detail for landlord inspection.",
      urgency: "high",
      estimatedDuration: "4-6 hours",
      skills: ["Deep Cleaning", "Move-out Cleaning", "Kitchen Sanitization", "Bathroom Cleaning"],
      budget: "$100-150",
    }

    setSuggestions(aiSuggestions)
    setIsAnalyzing(false)
    setShowSuggestions(true)
    toast({
      title: "AI Suggestions Generated!",
      description: "Review the suggestions and apply them to your form.",
      variant: "default",
    })
  }

  const applySuggestion = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    toast({
      title: "Suggestion Applied",
      description: `The '${field}' field has been updated.`,
      variant: "default",
    })
  }

  const applyAllSuggestions = () => {
    setFormData((prev) => ({ ...prev, ...suggestions }))
    setShowSuggestions(false)
    toast({
      title: "All Suggestions Applied!",
      description: "Your form has been autofilled with AI suggestions.",
      variant: "default",
    })
  }

  const handleSaveAsDraft = () => {
    toast({
      title: "Job Saved as Draft",
      description: "Your job posting has been saved and can be completed later.",
      variant: "default",
    })
  }

  const handlePostJob = () => {
    toast({
      title: "Job Posted Successfully!",
      description: "Your job is now live and providers will start responding soon.",
      variant: "default",
    })
    // Simulate redirect or further action
  }

  // Auto-analyze as user types (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (freeTextInput.length > 50) {
        analyzeAndSuggest()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [freeTextInput])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* AI Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Smart Form Assistant
          </CardTitle>
          <CardDescription>Describe what you need in plain English, and I'll help fill out the details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="freeText">Tell me about your project</Label>
              <Textarea
                id="freeText"
                placeholder="e.g., I need someone to clean my apartment really well because I'm moving out next week and want to get my deposit back. It's a 3 bedroom place and it's pretty messy..."
                rows={4}
                value={freeTextInput}
                onChange={(e) => setFreeTextInput(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {freeTextInput.length > 50 ? "✨ AI analysis in progress..." : "Keep typing for AI suggestions"}
              </div>
              <Button onClick={analyzeAndSuggest} disabled={!freeTextInput.trim() || isAnalyzing} size="sm">
                {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions Panel */}
      {showSuggestions && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                AI Suggestions
              </span>
              <Button onClick={applyAllSuggestions} size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Apply All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.title && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-600">Suggested Title</div>
                  <div className="font-medium">{suggestions.title}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => applySuggestion("title", suggestions.title)}>
                  Use This
                </Button>
              </div>
            )}

            {suggestions.category && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-600">Suggested Category</div>
                  <div className="font-medium">{suggestions.category}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => applySuggestion("category", suggestions.category)}>
                  Use This
                </Button>
              </div>
            )}

            {suggestions.skills && suggestions.skills.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-600">Suggested Skills</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {suggestions.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => applySuggestion("skills", suggestions.skills)}>
                  Use These
                </Button>
              </div>
            )}

            {suggestions.budget && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-600">Estimated Budget</div>
                  <div className="font-medium text-green-600">{suggestions.budget}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => applySuggestion("budget", suggestions.budget)}>
                  Use This
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Complete your job posting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Deep Clean 3-Bedroom Apartment"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house-cleaning">House Cleaning</SelectItem>
                  <SelectItem value="handyman">Handyman Services</SelectItem>
                  <SelectItem value="pet-care">Pet Care</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                  <SelectItem value="moving">Moving Help</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of what you need..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Flexible timing</SelectItem>
                  <SelectItem value="medium">Medium - Within a week</SelectItem>
                  <SelectItem value="high">High - ASAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Estimated Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 2-4 hours"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimatedDuration: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget Range</Label>
              <Input
                id="budget"
                placeholder="e.g., $50-100"
                value={formData.budget}
                onChange={(e) => setFormData((prev) => ({ ...prev, budget: e.target.value }))}
              />
            </div>
          </div>

          {formData.skills.length > 0 && (
            <div>
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleSaveAsDraft}>Save as Draft</Button>
            <Button onClick={handlePostJob}>Post Job</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}