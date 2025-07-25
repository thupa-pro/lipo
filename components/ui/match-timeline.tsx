"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Users,
  MessageSquare,
  Zap,
  Clock,
  Star
} from "lucide-react";

interface TimelineStep {
  id: string
  title: string
  description: string
  status: "completed" | "active" | "pending"
  estimatedTime?: string
  completedAt?: Date
}

interface MatchTimelineProps {
  jobId: string
}

export default function MatchTimeline({ jobId }: MatchTimelineProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [matchCount, setMatchCount] = useState(0)

  const steps: TimelineStep[] = [
    {
      id: "analyzing",
      title: "Analyzing Your Request",
      description: "AI is processing your job details and requirements",
      status: currentStep >= 0 ? "completed" : "pending",
      estimatedTime: "30 seconds",
      completedAt: currentStep >= 0 ? new Date(Date.now() - 120000) : undefined,
    },
    {
      id: "matching",
      title: "Finding Perfect Matches",
      description: "Searching through verified providers in your area",
      status: currentStep >= 1 ? (currentStep === 1 ? "active" : "completed") : "pending",
      estimatedTime: "2-3 minutes",
      completedAt: currentStep >= 2 ? new Date(Date.now() - 60000) : undefined,
    },
    {
      id: "scoring",
      title: "Ranking Providers",
      description: "Scoring matches based on, ratings, availability, and proximity",
      status: currentStep >= 2 ? (currentStep === 2 ? "active" : "completed") : "pending",
      estimatedTime: "1 minute",
      completedAt: currentStep >= 3 ? new Date(Date.now() - 30000) : undefined,
    },
    {
      id: "notifying",
      title: "Notifying Top Matches",
      description: "Sending your job to the best-matched providers",
      status: currentStep >= 3 ? (currentStep === 3 ? "active" : "completed") : "pending",
      estimatedTime: "30 seconds",
      completedAt: currentStep >= 4 ? new Date() : undefined,
    },
    {
      id: "responses",
      title: "Collecting Responses",
      description: "Providers are reviewing and responding to your job",
      status: currentStep >= 4 ? "active" : "pending",
      estimatedTime: "5-15 minutes",
    },
  ]

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) {
          const next = prev + 1
          setProgress((next / 4) * 100)
          if (next >= 2) {
            setMatchCount((prev) => Math.min(prev + Math.floor(Math.random() * 3) + 1, 12))
          }
          return next
        }
        return prev
      })
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const getStepIcon = (step: TimelineStep, index: number) => {
    if (step.status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    } else if (step.status === "active") {
      return <div className="w-5 h-5 border-2 border-blue-600 rounded-full animate-pulse bg-blue-100" />
    } else {
      return <div className="w-5 h-5 border-2 border-gray-300 rounded-full bg-gray-100" />
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-blue-600" />
              Match Progress
            </CardTitle>
            <CardDescription>Your job is being processed and matched with providers</CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Job #{jobId.slice(-6)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Match Stats */}
        {matchCount > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{matchCount}</div>
              <div className="text-xs text-gray-600">Providers Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <div className="text-xs text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">0.3mi</div>
              <div className="text-xs text-gray-600">Avg Distance</div>
            </div>
          </div>
        )}

        {/* Timeline Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">{getStepIcon(step, index)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-medium ${
                      step.status === "completed"
                        ? "text-green-700"
                        : step.status === "active"
                          ? "text-blue-700"
                          : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.completedAt && <span className="text-xs text-gray-500">{formatTime(step.completedAt)}</span>}
                </div>
                <p className={`text-sm mt-1 ${step.status === "pending" ? "text-gray-400" : "text-gray-600"}`}>
                  {step.description}
                </p>
                {step.estimatedTime && step.status !== "completed" && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Est. {step.estimatedTime}
                  </div>
                )}
                {step.status === "active" && step.id === "responses" && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs text-green-600">
                      <MessageSquare className="w-3 h-3 mr-1" />3 providers have responded
                    </div>
                    <div className="flex items-center text-xs text-blue-600">
                      <Users className="w-3 h-3 mr-1" />2 more reviewing your job
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        {currentStep >= 4 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-green-600 mr-2" />
              <span className="font-medium text-green-800">Ready for Review!</span>
            </div>
            <p className="text-sm text-green-700">
              You'll receive notifications as providers respond. Check your dashboard to review and select the best
              match.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
