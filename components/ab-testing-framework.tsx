"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskConical } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import ActiveTestCard from "./ab-testing/ActiveTestCard"
import TestTemplateCard from "./ab-testing/TestTemplateCard"
import CreateABTestForm from "./ab-testing/CreateABTestForm"
import InsightsSection from "./ab-testing/InsightsSection"
import { ABTest, TestTemplate } from "./ab-testing/types"

export default function ABTestingFramework() {
  const [activeTests, setActiveTests] = useState<ABTest[]>([
    {
      id: "1",
      name: "Job Form CTA Button",
      description: "Testing different call-to-action button text on job posting form",
      status: "running",
      startDate: "2024-01-10",
      variants: [
        {
          id: "control",
          name: "Post Job",
          traffic: 50,
          conversions: 127,
          visitors: 1240,
          conversionRate: 10.2,
          isControl: true,
        },
        {
          id: "variant-a",
          name: "Find My Provider",
          traffic: 50,
          conversions: 156,
          visitors: 1198,
          conversionRate: 13.0,
          isControl: false,
        },
      ],
      metrics: {
        primaryMetric: "Job Post Completion Rate",
        secondaryMetrics: ["Time on Page", "Form Abandonment Rate"],
      },
      confidence: 87.3,
      winner: "variant-a",
    },
    {
      id: "2",
      name: "Provider Card Layout",
      description: "Testing different layouts for provider cards in search results",
      status: "running",
      startDate: "2024-01-08",
      variants: [
        {
          id: "control",
          name: "Horizontal Layout",
          traffic: 33,
          conversions: 89,
          visitors: 892,
          conversionRate: 10.0,
          isControl: true,
        },
        {
          id: "variant-a",
          name: "Vertical Layout",
          traffic: 33,
          conversions: 76,
          visitors: 845,
          conversionRate: 9.0,
          isControl: false,
        },
        {
          id: "variant-b",
          name: "Card with Stats",
          traffic: 34,
          conversions: 112,
          visitors: 901,
          conversionRate: 12.4,
          isControl: false,
        },
      ],
      metrics: {
        primaryMetric: "Provider Contact Rate",
        secondaryMetrics: ["Click-through Rate", "Time to Contact"],
      },
      confidence: 72.1,
    },
  ])

  const [testTemplates] = useState<TestTemplate[]>([
    {
      id: "pricing-display",
      name: "Pricing Display Format",
      description: "Test different ways to display service pricing",
      category: "Conversion",
      estimatedImpact: "high",
      difficulty: "easy",
      duration: "2 weeks",
    },
    {
      id: "onboarding-flow",
      name: "Onboarding Flow Length",
      description: "Compare short vs detailed onboarding processes",
      category: "User Experience",
      estimatedImpact: "medium",
      difficulty: "medium",
      duration: "3 weeks",
    },
    {
      id: "search-filters",
      name: "Search Filter Placement",
      description: "Test sidebar vs top placement for search filters",
      category: "User Experience",
      estimatedImpact: "medium",
      difficulty: "easy",
      duration: "1 week",
    },
    {
      id: "trust-signals",
      name: "Trust Signal Prominence",
      description: "Test different ways to display verification badges",
      category: "Trust & Safety",
      estimatedImpact: "high",
      difficulty: "medium",
      duration: "2 weeks",
    },
  ])

  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-700"
      case "completed":
        return "bg-blue-100 text-blue-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "hard":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "easy":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const calculateStatisticalSignificance = (test: ABTest) => {
    return test.confidence >= 95 ? "significant" : test.confidence >= 80 ? "trending" : "inconclusive"
  }

  const handleViewTest = (testName: string) => {
    toast({
      title: "Viewing Test Details",
      description: `Opening details for A/B test: "${testName}".`,
      variant: "default",
    })
  }

  const handlePauseResumeTest = (testId: string, currentStatus: string) => {
    const newStatus = currentStatus === "running" ? "paused" : "running"
    setActiveTests((prev) =>
      prev.map((test) => (test.id === testId ? { ...test, status: newStatus } : test)),
    )
    toast({
      title: "Test Status Updated",
      description: `A/B test status changed to: ${newStatus.toUpperCase()}.`,
      variant: "default",
    })
  }

  const handleLaunchTest = (templateName: string) => {
    toast({
      title: "Test Launched!",
      description: `A/B test "${templateName}" has been launched.`,
      variant: "default",
    })
    // In a real, app, this would create a new active test
  }

  const handleCreateTest = (testData: {
    name: string
    description: string
    primaryMetric: string
    duration: string
    trafficSplit: number
  }) => {
    if (!testData.name || !testData.primaryMetric || !testData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to create a new test.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "New A/B Test Created!",
      description: `Test "${testData.name}" is now in draft mode.`,
      variant: "default",
    })
    // Simulate adding a new test to activeTests with status 'draft'
    setActiveTests((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: testData.name,
        description: testData.description,
        status: "draft",
        startDate: new Date().toISOString().split('T')[0],
        variants: [
          { id: "control", name: "Control", traffic: 100 - testData.trafficSplit, conversions: 0, visitors: 0, conversionRate: 0, isControl: true },
          { id: "variant-a", name: "Variant A", traffic: testData.trafficSplit, conversions: 0, visitors: 0, conversionRate: 0, isControl: false },
        ],
        metrics: {
          primaryMetric: testData.primaryMetric,
          secondaryMetrics: [],
        },
        confidence: 0,
      },
    ]);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <FlaskConical className="w-8 h-8 mr-3 text-purple-600" />
          A/B Testing Framework
        </h1>
        <p className="text-gray-600">Optimize your platform with data-driven experiments</p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Tests</TabsTrigger>
          <TabsTrigger value="templates">Test Templates</TabsTrigger>
          <TabsTrigger value="create">Create Test</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Active Tests */}
        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6">
            {activeTests.map((test) => (
              <ActiveTestCard
                key={test.id}
                test={test}
                getStatusColor={getStatusColor}
                calculateStatisticalSignificance={calculateStatisticalSignificance}
                onViewTest={handleViewTest}
                onPauseResumeTest={handlePauseResumeTest}
              />
            ))}
          </div>
        </TabsContent>

        {/* Test Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Test Templates</h2>
            <p className="text-gray-600">Pre-built experiments you can launch quickly</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testTemplates.map((template) => (
              <TestTemplateCard
                key={template.id}
                template={template}
                getImpactColor={getImpactColor}
                getDifficultyColor={getDifficultyColor}
                onLaunchTest={handleLaunchTest}
              />
            ))}
          </div>
        </TabsContent>

        {/* Create Test */}
        <TabsContent value="create" className="space-y-6">
          <CreateABTestForm onCreateTest={handleCreateTest} />
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <InsightsSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}