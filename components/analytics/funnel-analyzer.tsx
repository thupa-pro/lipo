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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingDown,
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart3,
  Zap,
  DollarSign,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

interface FunnelStage {
  name: string;
  users: number;
  percentage: number;
  dropOff: number;
  issues: string[];
  solutions: string[];
}

interface OptimizationSuggestion {
  title: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  description: string;
  expectedUplift: string;
  priority: number;
}

export default function FunnelAnalyzer() {
  const [selectedStage, setSelectedStage] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const funnelStages: FunnelStage[] = [
    {
      name: "Landing Page Visit",
      users: 10000,
      percentage: 100,
      dropOff: 0,
      issues: [],
      solutions: [],
    },
    {
      name: "Job Form Opened",
      users: 6800,
      percentage: 68,
      dropOff: 32,
      issues: ["Complex navigation", "Unclear value proposition"],
      solutions: ["Simplify CTA", "Add social proof"],
    },
    {
      name: "Job Form Submitted",
      users: 4200,
      percentage: 42,
      dropOff: 38,
      issues: [
        "Too many required fields",
        "Unclear pricing",
        "No progress indicator",
      ],
      solutions: [
        "Smart form assistant",
        "Progressive disclosure",
        "AI suggestions",
      ],
    },
    {
      name: "Match Initiated",
      users: 3500,
      percentage: 35,
      dropOff: 17,
      issues: ["Long wait times", "No feedback"],
      solutions: ["Real-time matching status", "Expected wait time display"],
    },
    {
      name: "Provider Accepts",
      users: 2700,
      percentage: 27,
      dropOff: 23,
      issues: ["Low provider urgency", "Poor match quality"],
      solutions: ["Urgency notifications", "Better matching algorithm"],
    },
    {
      name: "Payment Processed",
      users: 2400,
      percentage: 24,
      dropOff: 11,
      issues: ["Confusing escrow explanation", "Security concerns"],
      solutions: ["Interactive payment guide", "Trust badges"],
    },
    {
      name: "Job Completed",
      users: 2000,
      percentage: 20,
      dropOff: 17,
      issues: ["No follow-up", "Poor communication"],
      solutions: ["Automated reminders", "In-app messaging"],
    },
  ];

  const optimizationSuggestions: OptimizationSuggestion[] = [
    {
      title: "Smart Form Assistant",
      impact: "High",
      effort: "Medium",
      description: "AI-powered form completion with intelligent suggestions",
      expectedUplift: "+38% form completion",
      priority: 1,
    },
    {
      title: "Urgency Notification System",
      impact: "High",
      effort: "Low",
      description: "Real-time alerts for high-value jobs to providers",
      expectedUplift: "+23% provider acceptance",
      priority: 2,
    },
    {
      title: "Interactive Escrow Explainer",
      impact: "Medium",
      effort: "Low",
      description: "Step-by-step payment security explanation",
      expectedUplift: "+15% payment conversion",
      priority: 3,
    },
    {
      title: "Real-time Match Status",
      impact: "Medium",
      effort: "Medium",
      description: "Live updates on matching progress with ETA",
      expectedUplift: "+12% match completion",
      priority: 4,
    },
  ];

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "High":
        return "text-slate-700 dark:text-white";
      case "Medium":
        return "text-slate-600 dark:text-white";
      case "Low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Conversion Funnel Analysis
              </CardTitle>
              <CardDescription>
                Real-time analysis of user journey bottlenecks and optimization
                opportunities
              </CardDescription>
            </div>
            <Button onClick={runAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="funnel" className="space-y-4">
            <TabsList>
              <TabsTrigger value="funnel">Funnel Stages</TabsTrigger>
              <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
              <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="funnel" className="space-y-4">
              <div className="grid gap-4">
                {funnelStages.map((stage, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors ${
                      selectedStage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedStage(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{stage.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {stage.users.toLocaleString()} users (
                              {stage.percentage}%)
                            </p>
                          </div>
                        </div>
                        {stage.dropOff > 0 && (
                          <div className="flex items-center space-x-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                              -{stage.dropOff}%
                            </span>
                          </div>
                        )}
                      </div>

                      <Progress value={stage.percentage} className="mb-3" />

                      {stage.issues.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />
                            Issues Identified:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {stage.issues.map((issue, i) => (
                              <Badge
                                key={i}
                                variant="destructive"
                                className="text-xs"
                              >
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimizations" className="space-y-4">
              <div className="grid gap-4">
                {optimizationSuggestions.map((suggestion, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">
                              {suggestion.title}
                            </h4>
                            <Badge
                              className={getImpactColor(suggestion.impact)}
                            >
                              {suggestion.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={getEffortColor(suggestion.effort)}>
                              {suggestion.effort} Effort
                            </span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {suggestion.expectedUplift}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            #{suggestion.priority}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Priority
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Overall Conversion
                        </p>
                        <p className="text-2xl font-bold">20%</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">
                        +2.3% vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg. Time to Match
                        </p>
                        <p className="text-2xl font-bold">4.2min</p>
                      </div>
                      <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingDown className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">
                        -1.2min improvement
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Revenue per User
                        </p>
                        <p className="text-2xl font-bold">$47</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">
                        +$8 vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Optimization Score
                        </p>
                        <p className="text-2xl font-bold">87%</p>
                      </div>
                      <Target className="w-8 h-8 text-purple-500" />
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">
                        Excellent
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
