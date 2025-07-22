import { MobileDashboard } from "@/components/mobile/mobile-dashboard";
import { BiometricAuth } from "@/components/mobile/biometric-auth";
import { NotificationSystem } from "@/components/mobile/notification-system";
import { ProgressTracker } from "@/components/mobile/progress-tracker";
import { FeedbackWidget } from "@/components/mobile/feedback-widget";
import { PerformanceMonitor } from "@/components/mobile/performance-monitor";
import { DynamicPaymentSystem } from "@/components/payment/dynamic-payment-system";
import { DynamicWallet } from "@/components/payment/dynamic-wallet";
import { PaymentAnalytics } from "@/components/payment/payment-analytics";
import { MobilePaymentFlow } from "@/components/payment/mobile-payment-flow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  CreditCard,
  BarChart,
  Shield,
  Bell,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Loconomy Elite Dashboard
              </h1>
              <p className="text-muted-foreground">
                Comprehensive mobile app showcase with real-time features
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Active Users",
                value: "10,247",
                icon: TrendingUp,
                change: "+12%",
              },
              {
                label: "Transactions",
                value: "₿2,847",
                icon: CreditCard,
                change: "+8%",
              },
              {
                label: "Success Rate",
                value: "99.7%",
                icon: Shield,
                change: "+0.3%",
              },
              {
                label: "Response Time",
                value: "0.8s",
                icon: Zap,
                change: "-15%",
              },
            ].map((stat) => (
              <Card key={stat.label} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                <CardContent className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="mobile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger
              value="mobile"
              className="flex items-center gap-2 py-3"
            >
              <Smartphone className="w-4 h-4" />
              Mobile Components
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center gap-2 py-3"
            >
              <CreditCard className="w-4 h-4" />
              Payment Systems
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 py-3"
            >
              <BarChart className="w-4 h-4" />
              Analytics & Insights
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 py-3"
            >
              <Shield className="w-4 h-4" />
              Security & Auth
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Mobile Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MobileDashboard />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification System
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NotificationSystem />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progress Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressTracker />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Feedback Widget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FeedbackWidget />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceMonitor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Payment System</CardTitle>
                </CardHeader>
                <CardContent>
                  <DynamicPaymentSystem />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Digital Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <DynamicWallet />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mobile Payment Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <MobilePaymentFlow />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentAnalytics />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <PaymentAnalytics />
              <PerformanceMonitor />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biometric Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <BiometricAuth />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <span className="font-medium">Security Score</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        99.8%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">
                          Real-time Protection
                        </span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Threat Detection</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        Advanced
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
