"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DataInjection } from "@/components/polish/data-injection";
import { DeviceTesting } from "@/components/polish/device-testing";
import {
  Sparkles,
  Database,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Settings,
  Eye,
  Zap,
} from "lucide-react";

interface PolishStatus {
  dataInjection: boolean;
  deviceTesting: boolean;
  overallScore: number;
}

export default function GlobalPolishPage() {
  const [polishStatus, setPolishStatus] = useState<PolishStatus>({
    dataInjection: false,
    deviceTesting: false,
    overallScore: 0,
  });

  const [deviceTestResults, setDeviceTestResults] = useState<any>(null);

  const handleDataInjectionComplete = () => {
    setPolishStatus((prev) => ({
      ...prev,
      dataInjection: true,
      overallScore: calculateOverallScore({ ...prev, dataInjection: true }),
    }));
  };

  const handleDeviceTestingComplete = (results: any) => {
    setDeviceTestResults(results);
    setPolishStatus((prev) => ({
      ...prev,
      deviceTesting: true,
      overallScore: calculateOverallScore({ ...prev, deviceTesting: true }),
    }));
  };

  const calculateOverallScore = (status: Partial<PolishStatus>) => {
    let score = 0;
    const totalTasks = 2;

    if (status.dataInjection) score += 50;
    if (status.deviceTesting) score += 50;

    return Math.round(score);
  };

  const getPolishRecommendations = () => {
    const recommendations = [];

    if (!polishStatus.dataInjection) {
      recommendations.push({
        priority: "high",
        title: "Inject Realistic Data",
        description:
          "Replace placeholder content with authentic user profiles and services",
        action: "Complete data injection to improve user experience",
      });
    }

    if (!polishStatus.deviceTesting) {
      recommendations.push({
        priority: "high",
        title: "Test Cross-Device Compatibility",
        description:
          "Ensure optimal experience across mobile, tablet, and desktop",
        action: "Run comprehensive device testing",
      });
    }

    if (deviceTestResults && deviceTestResults.overall < 90) {
      recommendations.push({
        priority: "medium",
        title: "Address Device-Specific Issues",
        description: "Fix identified compatibility and usability issues",
        action: "Review test results and implement suggested improvements",
      });
    }

    return recommendations;
  };

  const recommendations = getPolishRecommendations();
  const completedTasks = Object.values(polishStatus).filter(
    (v, i) => i < 2 && v,
  ).length;
  const totalTasks = 2;
  const completionPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Global Polish & Testing
              </h1>
              <p className="text-muted-foreground">
                Final polish with realistic data and cross-device testing
              </p>
            </div>

            {/* Completion Status */}
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${polishStatus.overallScore >= 90 ? "text-green-600" : polishStatus.overallScore >= 50 ? "text-yellow-600" : "text-red-600"}`}
              >
                {polishStatus.overallScore}%
              </div>
              <div className="text-sm text-muted-foreground">
                Complete ({completedTasks}/{totalTasks})
              </div>
              <Badge
                variant={
                  polishStatus.overallScore >= 90 ? "default" : "secondary"
                }
              >
                {polishStatus.overallScore >= 90
                  ? "Production Ready"
                  : "In Progress"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Polish Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Polish Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Polish completion ({completedTasks}/{totalTasks} tasks)
                </span>
                <span className="text-sm text-muted-foreground">
                  {completionPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={completionPercentage} className="w-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Data Injection</span>
                  </div>
                  {polishStatus.dataInjection ? (
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Device Testing</span>
                  </div>
                  {polishStatus.deviceTesting ? (
                    <Badge variant="default">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              </div>

              {polishStatus.overallScore === 100 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    🎉 Congratulations! Your platform is fully polished and
                    ready for production. All tasks have been completed
                    successfully.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Priority Actions
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
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {rec.description}
                    </p>
                    <div className="text-sm font-medium text-blue-600">
                      Action: {rec.action}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Injection
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Device Testing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            <DataInjection onDataLoaded={handleDataInjectionComplete} />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <DeviceTesting onTestComplete={handleDeviceTestingComplete} />
          </TabsContent>
        </Tabs>

        {/* Quality Metrics */}
        {(polishStatus.dataInjection || polishStatus.deviceTesting) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quality Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {polishStatus.dataInjection ? "100%" : "0%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Data Quality
                  </div>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {deviceTestResults ? `${deviceTestResults.overall}%` : "0%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Device Compatibility
                  </div>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {polishStatus.overallScore >= 50 ? "95%" : "70%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    User Experience
                  </div>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {polishStatus.overallScore >= 100
                      ? "100%"
                      : polishStatus.overallScore + "%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Production Readiness
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <Eye className="w-6 h-6 mb-2" />
                Preview Live Site
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Zap className="w-6 h-6 mb-2" />
                Performance Test
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Settings className="w-6 h-6 mb-2" />
                Final Configuration
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <CheckCircle className="w-6 h-6 mb-2" />
                Launch Checklist
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Polish Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Quality
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Replace all placeholder content</li>
                  <li>• Use realistic user profiles and data</li>
                  <li>• Ensure data consistency across pages</li>
                  <li>• Test with various data volumes</li>
                  <li>• Verify data accuracy and relevance</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Cross-Device Polish
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Test on multiple device types</li>
                  <li>• Verify responsive breakpoints</li>
                  <li>• Optimize touch interactions</li>
                  <li>• Ensure readable typography</li>
                  <li>• Test offline functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
