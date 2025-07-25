"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  Users,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Zap,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMetrics {
  totalVolume: number;
  totalTransactions: number;
  averageTransaction: number;
  successRate: number;
  disputeRate: number;
  refundRate: number;
  processingFees: number;
  netRevenue: number;
}

interface TimeSeriesData {
  period: string;
  volume: number;
  transactions: number;
  revenue: number;
}

interface PaymentMethod {
  name: string;
  percentage: number;
  volume: number;
  growth: number;
}

interface PaymentAnalyticsProps {
  timeframe?: "24h" | "7d" | "30d" | "90d";
  className?: string;
}

export function PaymentAnalytics({
  timeframe = "30d",
  className,
}: PaymentAnalyticsProps) {
  const [metrics, setMetrics] = useState<PaymentMetrics>({
    totalVolume: 125847.5,
    totalTransactions: 1247,
    averageTransaction: 100.92,
    successRate: 98.7,
    disputeRate: 0.3,
    refundRate: 1.2,
    processingFees: 3145.2,
    netRevenue: 122702.3,
  });

  const [timeSeriesData] = useState<TimeSeriesData[]>([
    { period: "Week 1", volume: 28500, transactions: 285, revenue: 27642 },
    { period: "Week 2", volume: 32100, transactions: 321, revenue: 31137 },
    { period: "Week 3", volume: 29800, transactions: 298, revenue: 28902 },
    { period: "Week 4", volume: 35447.5, transactions: 343, revenue: 35021.3 },
  ]);

  const [paymentMethods] = useState<PaymentMethod[]>([
    { name: "Credit Card", percentage: 45.2, volume: 56883.22, growth: 12.5 },
    { name: "Loconomy Wallet", percentage: 28.7, volume: 36118.2, growth: 8.3 },
    { name: "Apple Pay", percentage: 15.1, volume: 19003.01, growth: 25.7 },
    { name: "Bank Transfer", percentage: 8.5, volume: 10697.04, growth: -3.2 },
    { name: "Crypto", percentage: 2.5, volume: 3146.03, growth: 45.8 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!realtimeEnabled) return;

    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        totalVolume: prev.totalVolume + Math.random() * 500,
        totalTransactions:
          prev.totalTransactions + Math.floor(Math.random() * 3),
        netRevenue: prev.netRevenue + Math.random() * 400,
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [realtimeEnabled]);

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate data refresh
    setMetrics((prev) => ({
      ...prev,
      totalVolume: prev.totalVolume + Math.random() * 1000,
      successRate: Math.min(99.9, prev.successRate + Math.random() * 0.5),
    }));

    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-emerald-600" : "text-red-600";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Analytics</h2>
          <p className="text-muted-foreground">
            Real-time payment performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRealtimeEnabled(!realtimeEnabled)}
            className={cn(
              realtimeEnabled
                ? "text-emerald-600 border-emerald-200"
                : "text-gray-400",
            )}
          >
            {realtimeEnabled && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            )}
            Live
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {timeframe}
              </Badge>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(metrics.totalVolume)}
            </p>
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">+12.5%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-emerald-600" />
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                Active
              </Badge>
            </div>
            <p className="text-2xl font-bold">
              {metrics.totalTransactions.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Transactions</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">+8.3%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                Success
              </Badge>
            </div>
            <p className="text-2xl font-bold">
              {formatPercentage(metrics.successRate)}
            </p>
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">+0.3%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <Wallet className="w-8 h-8 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                Net
              </Badge>
            </div>
            <p className="text-2xl font-bold">
              {formatCurrency(metrics.netRevenue)}
            </p>
            <p className="text-sm text-muted-foreground">Net Revenue</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">+15.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Payment Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeSeriesData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>{data.period}</span>
                    <span className="font-semibold">
                      {formatCurrency(data.volume)}
                    </span>
                  </div>
                  <Progress
                    value={
                      (data.volume /
                        Math.max(...timeSeriesData.map((d) => d.volume))) *
                      100
                    }
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{data.transactions} transactions</span>
                    <span>{formatCurrency(data.revenue)} revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{method.name}</span>
                    <div className="flex items-center gap-2">
                      {getGrowthIcon(method.growth)}
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          getGrowthColor(method.growth),
                        )}
                      >
                        {method.growth >= 0 ? "+" : ""}
                        {method.growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={method.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatPercentage(method.percentage)}</span>
                    <span>{formatCurrency(method.volume)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Performance & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">2.3s</p>
                  <p className="text-sm text-muted-foreground">
                    Avg Processing Time
                  </p>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">99.9%</p>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>

                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(metrics.averageTransaction)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avg Transaction
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Fraud Detection Rate</span>
                    <span className="font-bold text-emerald-600">99.8%</span>
                  </div>
                  <Progress value={99.8} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Dispute Rate</span>
                    <span className="font-bold text-yellow-600">
                      {formatPercentage(metrics.disputeRate)}
                    </span>
                  </div>
                  <Progress value={metrics.disputeRate * 10} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Chargeback Rate</span>
                    <span className="font-bold text-red-600">0.1%</span>
                  </div>
                  <Progress value={1} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Security Score
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">A+</p>
                    <p className="text-sm text-emerald-600">
                      Excellent security posture
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>PCI DSS Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>3D Secure Enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span>End-to-end Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Growth Opportunity
                      </span>
                    </div>
                    <p className="text-sm text-emerald-600">
                      Mobile payments show 25.7% growth. Consider promoting
                      Apple Pay and Google Pay for higher conversion rates.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        User Behavior
                      </span>
                    </div>
                    <p className="text-sm text-blue-600">
                      Peak transaction time is 2-4 PM. Consider optimizing
                      server capacity during these hours.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                        Optimization
                      </span>
                    </div>
                    <p className="text-sm text-yellow-600">
                      Bank transfers have higher abandonment rate. Consider
                      offering instant verification incentives.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        Revenue Impact
                      </span>
                    </div>
                    <p className="text-sm text-purple-600">
                      Reducing processing fees by 0.1% could save $
                      {(metrics.totalVolume * 0.001).toFixed(2)}
                      per month.
                    </p>
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
