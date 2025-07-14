"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Keyboard,
  Mouse,
  Smartphone,
  Monitor,
  CheckCircle,
  AlertTriangle,
  X,
  Zap,
  Clock,
  Activity,
  BarChart3,
} from "lucide-react";

interface AccessibilityAuditProps {
  onComplete?: (score: number) => void;
}

interface AuditResult {
  category: string;
  tests: Array<{
    name: string;
    status: "pass" | "fail" | "warning";
    description: string;
    impact: "critical" | "serious" | "moderate" | "minor";
    element?: string;
    suggestion?: string;
  }>;
}

export function AccessibilityAudit({ onComplete }: AccessibilityAuditProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const runAccessibilityAudit = async () => {
    setIsRunning(true);
    setProgress(0);

    // Simulate audit progress
    const steps = [
      { progress: 10, delay: 500 },
      { progress: 25, delay: 800 },
      { progress: 45, delay: 600 },
      { progress: 65, delay: 700 },
      { progress: 85, delay: 500 },
      { progress: 100, delay: 400 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      setProgress(step.progress);
    }

    // Generate mock audit results
    const mockResults: AuditResult[] = [
      {
        category: "Color & Contrast",
        tests: [
          {
            name: "Color contrast (WCAG AA)",
            status: "pass",
            description:
              "All text has sufficient contrast ratio (4.5:1 minimum)",
            impact: "serious",
            suggestion: "",
          },
          {
            name: "Color contrast (WCAG AAA)",
            status: "warning",
            description:
              "Some elements don't meet AAA contrast standards (7:1)",
            impact: "moderate",
            element: "Secondary buttons, muted text",
            suggestion: "Increase contrast for better readability",
          },
          {
            name: "Color-only information",
            status: "pass",
            description: "Information is not conveyed through color alone",
            impact: "serious",
          },
        ],
      },
      {
        category: "Keyboard Navigation",
        tests: [
          {
            name: "Tab order",
            status: "pass",
            description: "Tab order follows logical reading sequence",
            impact: "critical",
          },
          {
            name: "Focus indicators",
            status: "pass",
            description:
              "All interactive elements have visible focus indicators",
            impact: "critical",
          },
          {
            name: "Keyboard shortcuts",
            status: "warning",
            description:
              "Some custom shortcuts may conflict with assistive technology",
            impact: "minor",
            suggestion: "Review and document keyboard shortcuts",
          },
        ],
      },
      {
        category: "ARIA & Semantics",
        tests: [
          {
            name: "ARIA labels",
            status: "fail",
            description: "Some interactive elements lack proper ARIA labels",
            impact: "serious",
            element: "Icon buttons, complex widgets",
            suggestion: "Add aria-label or aria-labelledby attributes",
          },
          {
            name: "Semantic HTML",
            status: "pass",
            description: "Proper use of semantic HTML elements",
            impact: "moderate",
          },
          {
            name: "Landmark regions",
            status: "pass",
            description: "Page structure uses proper landmark roles",
            impact: "moderate",
          },
        ],
      },
      {
        category: "Images & Media",
        tests: [
          {
            name: "Alternative text",
            status: "warning",
            description: "Some images lack descriptive alt text",
            impact: "serious",
            element: "Decorative images, charts",
            suggestion: "Add meaningful alt text or mark decorative images",
          },
          {
            name: "Media controls",
            status: "pass",
            description: "Video/audio controls are keyboard accessible",
            impact: "critical",
          },
        ],
      },
      {
        category: "Forms",
        tests: [
          {
            name: "Form labels",
            status: "pass",
            description: "All form inputs have associated labels",
            impact: "critical",
          },
          {
            name: "Error identification",
            status: "pass",
            description: "Form errors are clearly identified and described",
            impact: "critical",
          },
          {
            name: "Required fields",
            status: "pass",
            description: "Required form fields are properly indicated",
            impact: "serious",
          },
        ],
      },
    ];

    setAuditResults(mockResults);

    // Calculate overall score
    const allTests = mockResults.flatMap((category) => category.tests);
    const passedTests = allTests.filter((test) => test.status === "pass");
    const warningTests = allTests.filter((test) => test.status === "warning");
    const failedTests = allTests.filter((test) => test.status === "fail");

    const score = Math.round(
      ((passedTests.length + warningTests.length * 0.5) / allTests.length) *
        100,
    );

    setOverallScore(score);
    setIsRunning(false);
    onComplete?.(score);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "fail":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "serious":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "minor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <div className="space-y-6">
      {/* Audit Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Accessibility Audit
            </CardTitle>
            <Button
              onClick={runAccessibilityAudit}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Run Audit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isRunning ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Scanning accessibility...
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          ) : auditResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
                  >
                    {overallScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getScoreLabel(overallScore)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    WCAG 2.1 AA Compliance
                  </div>
                  <Badge variant={overallScore >= 90 ? "default" : "secondary"}>
                    {overallScore >= 90 ? "Compliant" : "Non-compliant"}
                  </Badge>
                </div>
              </div>
              <Progress value={overallScore} className="w-full" />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Run an accessibility audit to check WCAG compliance</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Results */}
      {auditResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Audit Results</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditResults.map((category, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{category.category}</h3>
                    <div className="flex items-center gap-2">
                      {category.tests.map((test, testIndex) => (
                        <div key={testIndex} className="flex items-center">
                          {getStatusIcon(test.status)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {showDetails && (
                    <div className="space-y-2 ml-4">
                      {category.tests.map((test, testIndex) => (
                        <div
                          key={testIndex}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(test.status)}
                              <span className="font-medium text-sm">
                                {test.name}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={getImpactColor(test.impact)}
                            >
                              {test.impact}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {test.description}
                          </p>

                          {test.element && (
                            <div className="text-xs text-muted-foreground">
                              <strong>Element:</strong> {test.element}
                            </div>
                          )}

                          {test.suggestion && (
                            <div className="text-xs bg-blue-50 text-blue-800 p-2 rounded">
                              <strong>Suggestion:</strong> {test.suggestion}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {index < auditResults.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Accessibility Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Keyboard className="w-6 h-6 mb-2" />
              Test Keyboard Navigation
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Eye className="w-6 h-6 mb-2" />
              Screen Reader Test
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Monitor className="w-6 h-6 mb-2" />
              Color Contrast Checker
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Smartphone className="w-6 h-6 mb-2" />
              Mobile Accessibility
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Volume2 className="w-6 h-6 mb-2" />
              Audio Description
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Activity className="w-6 h-6 mb-2" />
              Motion Sensitivity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>WCAG 2.1 Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="perceivable" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="perceivable">Perceivable</TabsTrigger>
              <TabsTrigger value="operable">Operable</TabsTrigger>
              <TabsTrigger value="understandable">Understandable</TabsTrigger>
              <TabsTrigger value="robust">Robust</TabsTrigger>
            </TabsList>

            <TabsContent value="perceivable" className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">Text Alternatives</h4>
                <p className="text-sm text-muted-foreground">
                  Provide text alternatives for non-text content
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Captions and Alternatives</h4>
                <p className="text-sm text-muted-foreground">
                  Provide captions and other alternatives for multimedia
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Adaptable</h4>
                <p className="text-sm text-muted-foreground">
                  Create content that can be presented in different ways without
                  losing meaning
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Distinguishable</h4>
                <p className="text-sm text-muted-foreground">
                  Make it easier for users to see and hear content
                </p>
              </div>
            </TabsContent>

            <TabsContent value="operable" className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">Keyboard Accessible</h4>
                <p className="text-sm text-muted-foreground">
                  Make all functionality available from a keyboard
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Enough Time</h4>
                <p className="text-sm text-muted-foreground">
                  Give users enough time to read and use content
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Seizures</h4>
                <p className="text-sm text-muted-foreground">
                  Do not use content that causes seizures
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Navigable</h4>
                <p className="text-sm text-muted-foreground">
                  Help users navigate and find content
                </p>
              </div>
            </TabsContent>

            <TabsContent value="understandable" className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">Readable</h4>
                <p className="text-sm text-muted-foreground">
                  Make text content readable and understandable
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Predictable</h4>
                <p className="text-sm text-muted-foreground">
                  Make content appear and operate in predictable ways
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Input Assistance</h4>
                <p className="text-sm text-muted-foreground">
                  Help users avoid and correct mistakes
                </p>
              </div>
            </TabsContent>

            <TabsContent value="robust" className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">Compatible</h4>
                <p className="text-sm text-muted-foreground">
                  Maximize compatibility with assistive technologies
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Standards Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Use valid, semantic HTML and ARIA attributes
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
