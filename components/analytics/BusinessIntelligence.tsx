"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  Star,
  Globe,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { analyticsClient } from "@/lib/analytics/utils";
import { CHART_COLORS } from "@/lib/analytics/types";
import type { BusinessIntelligence } from "@/lib/analytics/types";
import { toast } from "sonner";

interface BusinessIntelligenceProps {
  timeframe: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function BusinessIntelligence({ timeframe }: BusinessIntelligenceProps) {
  const [loading, setLoading] = useState(true);
  const [businessMetrics, setBusinessMetrics] =
    useState<BusinessIntelligence | null>(null);

  useEffect(() => {
    loadBusinessIntelligence();
  }, [timeframe]);

  const loadBusinessIntelligence = async () => {
    setLoading(true);
    try {
      const response = await analyticsClient.getBusinessIntelligence(timeframe);
      if (response.success) {
        setBusinessMetrics(response.data);
      }
    } catch (error) {
      console.error("Error loading business intelligence:", error);
      toast.error("Failed to load business intelligence");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getNPSColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getNPSLabel = (score: number) => {
    if (score >= 70) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 30) return "Fair";
    return "Poor";
  };

  const getRiskColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Business Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Lifetime Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessMetrics
                ? formatCurrency(businessMetrics.customerLifetimeValue)
                : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              Average per customer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Acquisition Cost
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessMetrics
                ? formatCurrency(businessMetrics.customerAcquisitionCost)
                : "..."}
            </div>
            <div className="text-xs text-muted-foreground">Cost to acquire</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessMetrics
                ? formatPercentage(businessMetrics.churnRate)
                : "..."}
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              {businessMetrics && businessMetrics.churnRate < 5 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Healthy</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">Monitor</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Net Promoter Score
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${businessMetrics ? getNPSColor(businessMetrics.netPromoterScore) : ""}`}
            >
              {businessMetrics ? businessMetrics.netPromoterScore : "..."}
            </div>
            <div className="text-xs text-muted-foreground">
              {businessMetrics
                ? getNPSLabel(businessMetrics.netPromoterScore)
                : "No data"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Segment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Market Segment Analysis</CardTitle>
          <CardDescription>
            Performance across different market segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessMetrics?.marketSegmentAnalysis?.map((segment, index) => (
              <div key={segment.segment} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{segment.segment}</span>
                    <Badge variant="secondary">
                      {formatNumber(segment.size)} users
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {formatCurrency(segment.revenue)}
                    </span>
                    <Badge
                      variant={segment.growth > 0 ? "default" : "secondary"}
                    >
                      {segment.growth > 0 ? "+" : ""}
                      {formatPercentage(segment.growth)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Profitability</span>
                    <span>{formatPercentage(segment.profitability)}</span>
                  </div>
                  <Progress value={segment.profitability} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Competitive Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Competitive Analysis
            </CardTitle>
            <CardDescription>
              How we compare to industry standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={businessMetrics?.competitiveAnalysis || []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Our Performance"
                  dataKey="percentile"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.3}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Seasonal Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seasonal Trends
            </CardTitle>
            <CardDescription>
              Booking patterns throughout the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={businessMetrics?.seasonalTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  fill={CHART_COLORS.primary}
                  name="Bookings"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill={CHART_COLORS.secondary}
                  name="Revenue ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Predictive Insights
            </CardTitle>
            <CardDescription>AI-powered business projections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Projected Revenue</span>
                  <span className="text-lg font-bold">
                    {businessMetrics
                      ? formatCurrency(
                          businessMetrics.predictiveMetrics.projectedRevenue,
                        )
                      : "..."}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span>Next 30 days projection</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Projected Users</span>
                  <span className="text-lg font-bold">
                    {businessMetrics
                      ? formatNumber(
                          businessMetrics.predictiveMetrics.projectedUsers,
                        )
                      : "..."}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3 text-blue-600" />
                  <span>Expected new registrations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
            <CardDescription>
              Potential business risks and threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {businessMetrics?.predictiveMetrics.riskFactors?.map(
                (risk, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{risk.factor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Probability: {formatPercentage(risk.probability)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getRiskColor(risk.impact)}>
                      {risk.impact} impact
                    </Badge>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LTV to CAC Ratio */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Value Analysis</CardTitle>
          <CardDescription>
            Lifetime Value to Customer Acquisition Cost ratio - A key indicator
            of business health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {businessMetrics
                  ? formatCurrency(businessMetrics.customerLifetimeValue)
                  : "..."}
              </div>
              <div className="text-sm text-muted-foreground">
                Customer Lifetime Value
              </div>
            </div>
            <div className="text-4xl text-muted-foreground">÷</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {businessMetrics
                  ? formatCurrency(businessMetrics.customerAcquisitionCost)
                  : "..."}
              </div>
              <div className="text-sm text-muted-foreground">
                Customer Acquisition Cost
              </div>
            </div>
            <div className="text-4xl text-muted-foreground">=</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {businessMetrics
                  ? (
                      businessMetrics.customerLifetimeValue /
                      businessMetrics.customerAcquisitionCost
                    ).toFixed(1)
                  : "..."}
              </div>
              <div className="text-sm text-muted-foreground">LTV:CAC Ratio</div>
              <div className="text-xs text-muted-foreground mt-1">
                {businessMetrics &&
                businessMetrics.customerLifetimeValue /
                  businessMetrics.customerAcquisitionCost >=
                  3
                  ? "✅ Healthy ratio"
                  : "⚠️ Needs improvement"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
