"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Maximize,
  Minimize,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  Sun,
  Moon,
} from "lucide-react";

interface DeviceTestingProps {
  onTestComplete?: (results: DeviceTestResults) => void;
}

interface DeviceTestResults {
  mobile: TestResult;
  tablet: TestResult;
  desktop: TestResult;
  overall: number;
}

interface TestResult {
  score: number;
  issues: Array<{
    type: "critical" | "warning" | "info";
    message: string;
    suggestion?: string;
  }>;
  passed: string[];
}

export function DeviceTesting({ onTestComplete }: DeviceTestingProps) {
  const [isTestingRunning, setIsTestingRunning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("mobile");
  const [testResults, setTestResults] = useState<DeviceTestResults | null>(
    null,
  );
  const [currentViewport, setCurrentViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const devicePresets = [
    {
      id: "mobile",
      name: "Mobile Phones",
      icon: Smartphone,
      viewports: [
        { name: "iPhone 14 Pro", width: 393, height: 852 },
        { name: "iPhone SE", width: 375, height: 667 },
        { name: "Samsung Galaxy S21", width: 384, height: 854 },
        { name: "Google Pixel 6", width: 411, height: 823 },
      ],
      tests: [
        "Touch target sizing (minimum 44px)",
        "Mobile navigation usability",
        "Scroll performance",
        "Text readability",
        "Form input accessibility",
        "Image optimization",
        "Loading performance",
        "Offline functionality",
      ],
    },
    {
      id: "tablet",
      name: "Tablets",
      icon: Tablet,
      viewports: [
        { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
        { name: "iPad Air", width: 820, height: 1180 },
        { name: "Samsung Galaxy Tab", width: 800, height: 1280 },
        { name: "Surface Pro", width: 912, height: 1368 },
      ],
      tests: [
        "Layout adaptation",
        "Touch and mouse interaction",
        "Content spacing",
        "Navigation patterns",
        "Multi-column layouts",
        "Media responsiveness",
        "Performance optimization",
        "Orientation handling",
      ],
    },
    {
      id: "desktop",
      name: "Desktop",
      icon: Monitor,
      viewports: [
        { name: "1920x1080 (Full HD)", width: 1920, height: 1080 },
        { name: "1366x768 (HD)", width: 1366, height: 768 },
        { name: "2560x1440 (QHD)", width: 2560, height: 1440 },
        { name: "1440x900 (MacBook)", width: 1440, height: 900 },
      ],
      tests: [
        "Responsive breakpoints",
        "Keyboard navigation",
        "Mouse interactions",
        "Content layout",
        "Performance optimization",
        "Browser compatibility",
        "Multi-window support",
        "Accessibility compliance",
      ],
    },
  ];

  const runDeviceTests = async () => {
    setIsTestingRunning(true);

    // Simulate comprehensive device testing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResults: DeviceTestResults = {
      mobile: {
        score: 87,
        issues: [
          {
            type: "warning",
            message: "Some touch targets are smaller than 44px",
            suggestion:
              "Increase button and link sizes for better mobile usability",
          },
          {
            type: "info",
            message: "Images could be further optimized for mobile",
            suggestion: "Consider using WebP format and responsive images",
          },
        ],
        passed: [
          "Mobile navigation is accessible",
          "Text is readable on small screens",
          "Forms work well with touch input",
          "Page loads quickly on mobile networks",
          "Scroll performance is smooth",
          "Content adapts to different screen sizes",
        ],
      },
      tablet: {
        score: 92,
        issues: [
          {
            type: "info",
            message: "Some layouts could better utilize tablet screen space",
            suggestion:
              "Consider multi-column layouts for better content organization",
          },
        ],
        passed: [
          "Layout adapts well to tablet sizes",
          "Touch interactions work properly",
          "Content is well-spaced and readable",
          "Navigation patterns are intuitive",
          "Media displays correctly",
          "Performance is optimized",
          "Orientation changes handled smoothly",
        ],
      },
      desktop: {
        score: 95,
        issues: [
          {
            type: "info",
            message: "All tests passed successfully",
            suggestion: "Consider testing on additional browser versions",
          },
        ],
        passed: [
          "Responsive breakpoints work correctly",
          "Keyboard navigation is complete",
          "Mouse interactions are responsive",
          "Content layout is optimal",
          "Performance is excellent",
          "Browser compatibility is good",
          "Multi-window support works",
          "Accessibility standards met",
        ],
      },
      overall: 91,
    };

    setTestResults(mockResults);
    setIsTestingRunning(false);
    onTestComplete?.(mockResults);
  };

  const previewViewport = (width: number, height: number) => {
    // This would typically open a new window or iframe with the specified dimensions
    console.log(`Preview viewport: ${width}x${height}`);
  };

  const getDeviceIcon = (deviceId: string) => {
    const device = devicePresets.find((d) => d.id === deviceId);
    if (!device) return Monitor;
    const IconComponent = device.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <X className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Testing Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Cross-Device Testing
            </CardTitle>
            <Button
              onClick={runDeviceTests}
              disabled={isTestingRunning}
              className="flex items-center gap-2"
            >
              {isTestingRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {testResults ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Overall Device Compatibility
                </span>
                <div
                  className={`text-2xl font-bold ${getScoreColor(testResults.overall)}`}
                >
                  {testResults.overall}/100
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div
                    className={`text-xl font-bold ${getScoreColor(testResults.mobile.score)}`}
                  >
                    {testResults.mobile.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Mobile</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div
                    className={`text-xl font-bold ${getScoreColor(testResults.tablet.score)}`}
                  >
                    {testResults.tablet.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Tablet</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div
                    className={`text-xl font-bold ${getScoreColor(testResults.desktop.score)}`}
                  >
                    {testResults.desktop.score}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Desktop</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>
                Run comprehensive tests across mobile, tablet, and desktop
                devices
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Viewports */}
      <Card>
        <CardHeader>
          <CardTitle>Device Viewports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedDevice}
            onValueChange={setSelectedDevice}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {devicePresets.map((device) => (
                <TabsTrigger
                  key={device.id}
                  value={device.id}
                  className="flex items-center gap-2"
                >
                  {getDeviceIcon(device.id)}
                  {device.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {devicePresets.map((device) => (
              <TabsContent
                key={device.id}
                value={device.id}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {device.viewports.map((viewport, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{viewport.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {viewport.width} × {viewport.height}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            previewViewport(viewport.width, viewport.height)
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>

                      <div className="aspect-[16/10] bg-muted rounded border relative overflow-hidden">
                        <div
                          className="bg-white border shadow-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            width: `${Math.min(100, (viewport.width / 1920) * 100)}%`,
                            height: `${Math.min(100, (viewport.height / 1080) * 100)}%`,
                            minWidth: "60px",
                            minHeight: "40px",
                          }}
                        >
                          <div className="w-full h-2 bg-gray-200 rounded-t"></div>
                          <div className="p-1 space-y-1">
                            <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                            <div className="h-1 bg-gray-300 rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mobile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="tablet">Tablet</TabsTrigger>
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
              </TabsList>

              {Object.entries(testResults).map(([deviceType, result]) => {
                if (deviceType === "overall") return null;

                return (
                  <TabsContent
                    key={deviceType}
                    value={deviceType}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">
                        {deviceType} Test Results
                      </h4>
                      <div
                        className={`text-xl font-bold ${getScoreColor(result.score)}`}
                      >
                        {result.score}/100
                      </div>
                    </div>

                    {result.issues.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Issues Found</h5>
                        {result.issues.map((issue, index) => (
                          <Alert key={index}>
                            <div className="flex items-start gap-2">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1">
                                <AlertDescription>
                                  <div className="font-medium">
                                    {issue.message}
                                  </div>
                                  {issue.suggestion && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      <strong>Suggestion:</strong>{" "}
                                      {issue.suggestion}
                                    </div>
                                  )}
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        ))}
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Tests Passed
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.passed.map((test, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {test}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Current Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Current Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Monitor className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Viewport</div>
                <div className="text-xs text-muted-foreground">
                  {currentViewport.width} × {currentViewport.height}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Wifi className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">Connection</div>
                <div className="text-xs text-muted-foreground">Fast 3G</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Sun className="w-4 h-4 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">Theme</div>
                <div className="text-xs text-muted-foreground">Light Mode</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium">Status</div>
                <div className="text-xs text-muted-foreground">Ready</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Mobile Testing
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Touch targets 44px minimum</li>
                <li>• Readable text without zooming</li>
                <li>• Thumb-friendly navigation</li>
                <li>• Fast loading on slow networks</li>
                <li>• Offline functionality</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Tablet className="w-4 h-4" />
                Tablet Testing
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Optimal layout utilization</li>
                <li>• Touch and mouse support</li>
                <li>• Orientation handling</li>
                <li>• Multi-column layouts</li>
                <li>• Balanced content density</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Desktop Testing
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Keyboard navigation</li>
                <li>• Mouse hover states</li>
                <li>• Multiple browser support</li>
                <li>• Large screen optimization</li>
                <li>• Multi-window functionality</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DeviceTesting;
