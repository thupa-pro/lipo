"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessibilityAudit } from "@/components/accessibility/accessibility-audit";
import { PerformanceOptimizer } from "@/components/performance/performance-optimizer";
import {
  Eye,
  CheckCircle,
  TrendingUp,
  Activity,
  BarChart3, Gauge
} from "lucide-react";

export default function AccessibilityPerformancePage() {
  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleAccessibilityComplete = (score: number) => {
    setAccessibilityScore(score);
    updateOverallScore(score, performanceScore);
  };

  const handlePerformanceComplete = (score: number) => {
    setPerformanceScore(score);
    updateOverallScore(accessibilityScore, score);
  };

  const updateOverallScore = (a11yScore: number, perfScore: number) => {
    if (a11yScore > 0 && perfScore > 0) {
      // Weight accessibility and performance equally
      const overall = Math.round((a11yScore + perfScore) / 2);
      setOverallScore(overall);
      if (overall < 90) {
        setShowRecommendations(true);
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 95) return "Excellent";
    if (score >= 90) return "Good";
    if (score >= 75) return "Fair";
    return "Needs Improvement";
  };

  const generateRecommendations = () => {
    const recommendations = [];

    if (accessibilityScore < 90) {
      recommendations.push({
        category: "Accessibility",
        priority: "high",
        title: "Improve WCAG Compliance",
        description:
          "Focus on ARIA, labels, keyboard, navigation, and color contrast",
        impact: "Critical for inclusive user experience",
      });
    }

    if (performanceScore < 90) {
      recommendations.push({
        category: "Performance",
        priority: "high",
        title: "Optimize Core Web Vitals",
        description:
          "Improve, LCP, FID, and CLS metrics for better user experience",
        impact: "Directly affects user engagement and SEO",
      });
    }

    if (accessibilityScore < 80) {
      recommendations.push({
        category: "Accessibility",
        priority: "medium",
        title: "Implement Screen Reader Testing",
        description:
          "Test with actual screen readers and improve semantic HTML",
        impact: "Essential for visually impaired users",
      });
    }

    if (performanceScore < 80) {
      recommendations.push({
        category: "Performance",
        priority: "medium",
        title: "Optimize Resource Loading",
        description:
          "Implement code splitting and lazy loading for better performance",
        impact: "Reduces initial load time and improves user experience",
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Accessibility & Performance
              </h1>
              <p className="text-muted-foreground">
                Optimize your application for accessibility and performance
              </p>
            </div>

            {/* Overall Score */}
            {overallScore > 0 && (
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
                >
                  {overallScore}/100
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Score
                </div>
                <Badge variant={overallScore >= 90 ? "default" : "secondary"}>
                  {getScoreLabel(overallScore)}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Score Overview */}
        {(accessibilityScore > 0 || performanceScore > 0) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Score Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Accessibility Score */}
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(accessibilityScore)}`}
                  >
                    {accessibilityScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Accessibility
                  </div>
                  <Progress value={accessibilityScore} className="w-full" />
                  <div className="mt-2">
                    <Badge
                      variant={
                        accessibilityScore >= 90 ? "default" : "secondary"
                      }
                    >
                      WCAG 2.1{" "}
                      {accessibilityScore >= 90 ? "Compliant" : "Non-compliant"}
                    </Badge>
                  </div>
                </div>

                {/* Performance Score */}
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}
                  >
                    {performanceScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Performance
                  </div>
                  <Progress value={performanceScore} className="w-full" />
                  <div className="mt-2">
                    <Badge
                      variant={performanceScore >= 90 ? "default" : "secondary"}
                    >
                      Lighthouse {getScoreLabel(performanceScore)}
                    </Badge>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(overallScore)}`}
                  >
                    {overallScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Overall
                  </div>
                  <Progress value={overallScore} className="w-full" />
                  <div className="mt-2">
                    <Badge
                      variant={overallScore >= 95 ? "default" : "secondary"}
                    >
                      Target: 95+
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Priority Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge
                          variant="outline"
                          className={
                            rec.priority === "high"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <Badge variant="secondary">{rec.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.description}
                    </p>
                    <div className="text-sm font-medium text-blue-600">
                      Impact: {rec.impact}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="accessibility" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="accessibility"
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Accessibility Audit
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Performance Optimizer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accessibility" className="space-y-6">
            <AccessibilityAudit onComplete={handleAccessibilityComplete} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceOptimizer onComplete={handlePerformanceComplete} />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <Shield className="w-6 h-6 mb-2" />
                Security Audit
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Activity className="w-6 h-6 mb-2" />
                Real-time Monitoring
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Gauge className="w-6 h-6 mb-2" />
                Load Testing
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <CheckCircle className="w-6 h-6 mb-2" />
                Compliance Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Best Practices Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Accessibility Guidelines
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Ensure 4.5:1 contrast ratio for text</li>
                  <li>• Provide keyboard navigation for all features</li>
                  <li>• Use semantic HTML and ARIA labels</li>
                  <li>• Test with screen readers</li>
                  <li>• Support assistive technologies</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Performance Guidelines
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Optimize Core Web Vitals (LCP, FID, CLS)</li>
                  <li>�� Minimize JavaScript bundle size</li>
                  <li>• Implement efficient caching strategies</li>
                  <li>• Optimize images and media</li>
                  <li>• Use modern loading techniques</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
