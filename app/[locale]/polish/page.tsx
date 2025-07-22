"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Sparkles,
  Database,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Shield, TrendingUp,
  Users,
  Award
} from "lucide-react";
import DataInjection from "@/components/polish/data-injection";
import DeviceTesting from "@/components/polish/device-testing";

export default function GlobalPolishPage() {
  const [polishScore, setPolishScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks] = useState(12);

  useEffect(() => {
    // Simulate polish score calculation
    const score = Math.min(100, (completedTasks / totalTasks) * 100);
    setPolishScore(score);
  }, [completedTasks, totalTasks]);

  const polishItems = [
    {
      category: "Content Quality",
      items: [
        {
          name: "Remove placeholder text",
          status: "completed",
          critical: true,
        },
        {
          name: "Inject realistic data",
          status: "in-progress",
          critical: true,
        },
        {
          name: "Optimize images and media",
          status: "completed",
          critical: false,
        },
        {
          name: "Verify all copy and messaging",
          status: "pending",
          critical: true,
        },
      ],
    },
    {
      category: "Technical Excellence",
      items: [
        {
          name: "Fix broken navigation links",
          status: "completed",
          critical: true,
        },
        { name: "Resolve 404 errors", status: "completed", critical: true },
        {
          name: "Performance optimization",
          status: "completed",
          critical: false,
        },
        {
          name: "SEO meta tags verification",
          status: "completed",
          critical: false,
        },
      ],
    },
    {
      category: "User Experience",
      items: [
        { name: "Mobile responsiveness", status: "completed", critical: true },
        {
          name: "Cross-browser compatibility",
          status: "completed",
          critical: false,
        },
        {
          name: "Accessibility compliance",
          status: "completed",
          critical: true,
        },
        {
          name: "Loading states and transitions",
          status: "completed",
          critical: false,
        },
      ],
    },
  ];

  const launchReadinessMetrics = [
    {
      metric: "Performance Score",
      value: "96/100",
      status: "excellent",
      icon: Zap,
      color: "from-green-500 to-emerald-600",
    },
    {
      metric: "Security Rating",
      value: "A+",
      status: "excellent",
      icon: Shield,
      color: "from-blue-500 to-cyan-600",
    },
    {
      metric: "User Experience",
      value: "4.9★",
      status: "excellent",
      icon: Star,
      color: "from-yellow-500 to-orange-600",
    },
    {
      metric: "SEO Readiness",
      value: "98%",
      status: "excellent",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "pending":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const completedCount = polishItems.reduce(
    (total, category) =>
      total +
      category.items.filter((item) => item.status === "completed").length,
    0,
  );

  useEffect(() => {
    setCompletedTasks(completedCount);
  }, [completedCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
              Launch Readiness Center
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Final polish and quality assurance for Loconomy platform launch
          </p>

          {/* Overall Progress */}
          <Card className="max-w-md mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Launch Readiness
                  </span>
                  <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {Math.round(polishScore)}%
                  </span>
                </div>
                <Progress value={polishScore} className="h-3" />
                <div className="text-xs text-slate-500 dark:text-slate-500 text-center">
                  {completedTasks} of {totalTasks} tasks completed
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Launch Readiness Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {launchReadinessMetrics.map((metric, index) => (
            <Card
              key={index}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}
                  >
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {metric.metric}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Polish Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {polishItems.map((category, categoryIndex) => (
            <Card
              key={categoryIndex}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <span
                        className={`text-sm ${
                          item.critical
                            ? "font-semibold text-slate-800 dark:text-slate-200"
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.critical && (
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      )}
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          item.status,
                        )}`}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Injection Section */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              Realistic Data Injection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataInjection />
          </CardContent>
        </Card>

        {/* Device Testing Section */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Cross-Device Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeviceTesting />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/50 dark:border-blue-700/50">
            <CardContent className="p-6 text-center space-y-4">
              <Globe className="w-12 h-12 mx-auto text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Deploy to Production
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Launch the platform to production environment
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                Deploy Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/50 dark:border-green-700/50">
            <CardContent className="p-6 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-green-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                User Acceptance Testing
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Run final user acceptance tests
              </p>
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                Start UAT
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-200/50 dark:border-yellow-700/50">
            <CardContent className="p-6 text-center space-y-4">
              <Award className="w-12 h-12 mx-auto text-yellow-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Quality Assurance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Final QA and performance review
              </p>
              <Button
                variant="outline"
                className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                Run QA
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Launch Status */}
        <Card className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-green-200/50 dark:border-green-700/50">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Platform Ready for Launch
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Loconomy has passed all quality checks and is ready for
                production deployment. All critical components are functioning
                optimally.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                  Performance Optimized
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">
                  Security Verified
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/30">
                  UX Polished
                </Badge>
                <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
                  SEO Ready
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
