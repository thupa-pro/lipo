import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Smartphone, CreditCard, BarChart3, Bell, TrendingUp, Zap, Activity, Globe, Target, Rocket, Brain, Eye, Award, ArrowUp, ArrowDown, Sparkles, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface DashboardStat {
  label: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: any;
  color: string;
  description: string;
  target?: string;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'signup';
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  amount?: string;
  status: 'success' | 'pending' | 'failed';
}

const mockStats: DashboardStat[] = [
  {
    label: "Active Users",
    value: "12,847",
    change: "+18%",
    changeType: 'increase',
    icon: Users,
    color: "blue",
    description: "Total active users this month",
    target: "15,000"
  },
  {
    label: "Revenue",
    value: "$284,750",
    change: "+24%",
    changeType: 'increase',
    icon: DollarSign,
    color: "green",
    description: "Total revenue this month",
    target: "$300,000"
  },
  {
    label: "Bookings",
    value: "3,429",
    change: "+12%",
    changeType: 'increase',
    icon: Calendar,
    color: "purple",
    description: "Total bookings completed",
    target: "4,000"
  },
  {
    label: "Satisfaction",
    value: "4.9/5",
    change: "+0.2",
    changeType: 'increase',
    icon: Star,
    color: "yellow",
    description: "Average customer rating",
    target: "5.0"
  },
  {
    label: "Response Time",
    value: "0.6s",
    change: "-25%",
    changeType: 'increase',
    icon: Zap,
    color: "orange",
    description: "Average API response time",
    target: "0.5s"
  },
  {
    label: "Success Rate",
    value: "99.8%",
    change: "+0.1%",
    changeType: 'increase',
    icon: Shield,
    color: "emerald",
    description: "Transaction success rate",
    target: "99.9%"
  }
];

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Premium Booking',
    description: 'House cleaning service booked by Sarah J.',
    timestamp: new Date(Date.now() - 300000),
    user: 'Sarah Johnson',
    amount: '$125',
    status: 'success'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Processed',
    description: 'Payment for plumbing service completed',
    timestamp: new Date(Date.now() - 600000),
    user: 'Mike Chen',
    amount: '$180',
    status: 'success'
  },
  {
    id: '3',
    type: 'review',
    title: '5-Star Review',
    description: 'Excellent garden maintenance service',
    timestamp: new Date(Date.now() - 900000),
    user: 'Emma Wilson',
    status: 'success'
  },
  {
    id: '4',
    type: 'signup',
    title: 'New Provider',
    description: 'Professional electrician joined the platform',
    timestamp: new Date(Date.now() - 1200000),
    user: 'David Rodriguez',
    status: 'pending'
  }
];

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);
  const [liveStats, setLiveStats] = useState(mockStats);

  useEffect(() => {
    setMounted(true);
    
    // Simulate live data updates
    const interval = setInterval(() => {
      setLiveStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.label === "Active Users" 
          ? `${(parseInt(stat.value.replace(/,/g, '')) + Math.floor(Math.random() * 10)).toLocaleString()}`
          : stat.value
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const getStatColor = (color: string) => {
    const colors = {
      blue: "from-ai to-primary",
      green: "from-trust to-success",
      purple: "from-primary to-ai",
      yellow: "from-warning to-premium",
      orange: "from-premium to-warning",
      emerald: "from-success to-trust"
    };
    return colors[color as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? ArrowUp : ArrowDown;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'payment': return DollarSign;
      case 'review': return Star;
      case 'signup': return Users;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'failed': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 bg-gradient-ai rounded-2xl flex items-center justify-center shadow-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BarChart3 className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Elite Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Real-time business intelligence and mobile app showcase
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="glass-subtle border-white/40">
              <NavigationIcons.Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <Eye className="w-4 h-4 mr-2" />
              Live View
            </Button>
          </div>
        </div>

        {/* Real-time indicator */}
        <motion.div
          className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-2"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Data • Updated {new Date().toLocaleTimeString()}
          </span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {liveStats.map((stat, index) => {
          const IconComponent = stat.icon;
          const ChangeIcon = getChangeIcon(stat.changeType);
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="glass-ultra border-white/40 hover:border-blue-300/50 transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${getStatColor(stat.color)} opacity-5`} />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatColor(stat.color)} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      stat.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <ChangeIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {stat.description}
                    </p>
                    
                    {stat.target && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Target: {stat.target}</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 glass-ultra border border-white/40 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Smartphone className="w-4 h-4" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
            <OptimizedIcon name="Shield" className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-ultra border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {mockActivities.map((activity, index) => {
                        const IconComponent = getActivityIcon(activity.type);
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 glass-subtle rounded-xl border border-white/40 hover:border-blue-300/50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {activity.title}
                                </h4>
                                {activity.amount && (
                                  <Badge variant="outline" className="text-green-600 border-green-200">
                                    {activity.amount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>{activity.user}</span>
                                <span>•</span>
                                <span>{activity.timestamp.toLocaleTimeString()}</span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-ultra border-white/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Users, label: "Manage Users", color: "blue" },
                    { icon: Calendar, label: "View Bookings", color: "purple" },
                    { icon: DollarSign, label: "Payment Reports", color: "green" },
                    { icon: Star, label: "Review Analytics", color: "yellow" },
                    { icon: Bell, label: "Notifications", color: "orange" },
                    { icon: Settings, label: "System Settings", color: "gray" }
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      className="w-full p-3 glass-subtle rounded-xl border border-white/40 hover:border-blue-300/50 transition-all duration-200 text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${getStatColor(action.color)} flex items-center justify-center`}>
                          <action.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {action.label}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-ultra border-white/40">
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

            <Card className="glass-ultra border-white/40">
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

            <Card className="glass-ultra border-white/40">
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

            <Card className="glass-ultra border-white/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <OptimizedIcon name="MessageSquare" className="w-5 h-5" />
                  Feedback Widget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FeedbackWidget />
              </CardContent>
            </Card>
          </div>

          <Card className="glass-ultra border-white/40">
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
            <Card className="glass-ultra border-white/40">
              <CardHeader>
                <CardTitle>Dynamic Payment System</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicPaymentSystem />
              </CardContent>
            </Card>

            <Card className="glass-ultra border-white/40">
              <CardHeader>
                <CardTitle>Digital Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <DynamicWallet />
              </CardContent>
            </Card>

            <Card className="glass-ultra border-white/40">
              <CardHeader>
                <CardTitle>Mobile Payment Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <MobilePaymentFlow />
              </CardContent>
            </Card>

            <Card className="glass-ultra border-white/40">
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
            <Card className="glass-ultra border-white/40">
              <CardHeader>
                <CardTitle>Biometric Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <BiometricAuth />
              </CardContent>
            </Card>

            <Card className="glass-ultra border-white/40">
              <CardHeader>
                <CardTitle>Security Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div
                    className="flex items-center justify-between p-4 glass-subtle rounded-xl border border-emerald-200/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                        <OptimizedIcon name="Shield" className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">Security Score</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      99.8%
                    </Badge>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center justify-between p-4 glass-subtle rounded-xl border border-blue-200/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">Real-time Protection</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Active
                    </Badge>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center justify-between p-4 glass-subtle rounded-xl border border-purple-200/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">Threat Detection</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                      Advanced
                    </Badge>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
