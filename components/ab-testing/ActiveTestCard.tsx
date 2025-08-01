import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye, Pause, Play } from "lucide-react";
import { ABTest } from "./types"

interface ActiveTestCardProps {
  test: ABTest
  getStatusColor: (status: string) => string
  calculateStatisticalSignificance: (test: ABTest) => string
  onViewTest: (testName: string) => void
  onPauseResumeTest: (testId: string, currentStatus: string) => void
}

export default function ActiveTestCard({
  test,
  getStatusColor,
  calculateStatisticalSignificance,
  onViewTest,
  onPauseResumeTest,
}: ActiveTestCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              {test.name}
              <Badge className={`ml-2 ${getStatusColor(test.status)}`}>{test.status}</Badge>
            </CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => onViewTest(test.name)}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {test.status === "running" ? (
              <Button size="sm" variant="outline" onClick={() => onPauseResumeTest(test.id, test.status)}>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => onPauseResumeTest(test.id, test.status)}>
                <Play className="w-4 h-4 mr-1" />
                Resume
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Results */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{test.confidence}%</div>
            <div className="text-sm text-gray-600">Confidence Level</div>
            <Badge
              className={`mt-1 ${
                calculateStatisticalSignificance(test) === "significant"
                  ? "bg-green-100 text-green-700"
                  : calculateStatisticalSignificance(test) === "trending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {calculateStatisticalSignificance(test)}
            </Badge>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {test.variants.reduce((sum, v) => sum + v.visitors, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Visitors</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...test.variants.map((v) => v.conversionRate)).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Best Conversion Rate</div>
          </div>
        </div>

        {/* Variants Performance */}
        <div className="space-y-4">
          <h4 className="font-semibold">Variant Performance</h4>
          {test.variants.map((variant) => (
            <div
              key={variant.id}
              className={`p-4 border rounded-lg ${
                test.winner === variant.id ? "border-green-500 bg-green-50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h5 className="font-medium">{variant.name}</h5>
                  {variant.isControl && <Badge variant="outline">Control</Badge>}
                  {test.winner === variant.id && (
                    <Badge className="bg-green-500">
                      <UIIcons.CheckCircle className="w-3 h-3 mr-1" / />
                      Winner
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{variant.conversionRate}%</div>
                  <div className="text-sm text-gray-600">conversion rate</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Visitors</div>
                  <div className="font-medium">{variant.visitors.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Conversions</div>
                  <div className="font-medium">{variant.conversions}</div>
                </div>
                <div>
                  <div className="text-gray-600">Traffic Split</div>
                  <div className="font-medium">{variant.traffic}%</div>
                </div>
              </div>

              <div className="mt-3">
                <Progress value={variant.conversionRate} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Primary Metric */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium mb-2">Primary Metric: {test.metrics.primaryMetric}</h5>
          <div className="text-sm text-gray-600">
            Secondary Metrics: {test.metrics.secondaryMetrics.join(", ")}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}