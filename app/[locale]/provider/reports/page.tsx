"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react";

export default function ProviderReportsPage() {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("30d");

  const reports = [
    {
      name: "Revenue Report",
      description: "Detailed breakdown of earnings and payments",
      lastGenerated: "2 hours ago",
      type: "revenue",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      name: "Booking Summary",
      description: "Client bookings and appointment analytics",
      lastGenerated: "1 day ago",
      type: "bookings",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      name: "Performance Review",
      description: "Ratings, reviews, and service quality metrics",
      lastGenerated: "3 days ago",
      type: "performance",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      name: "Client Analysis",
      description: "Customer demographics and behavior insights",
      lastGenerated: "1 week ago",
      type: "clients",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  const recentReports = [
    {
      name: "Monthly Revenue - November 2024",
      generatedOn: "Dec 1, 2024",
      size: "2.4 MB",
      format: "PDF",
    },
    {
      name: "Client Performance Report - Q4",
      generatedOn: "Nov 28, 2024",
      size: "1.8 MB",
      format: "XLSX",
    },
    {
      name: "Service Analytics - October",
      generatedOn: "Nov 15, 2024",
      size: "3.1 MB",
      format: "PDF",
    },
  ];

  const metrics = [
    {
      label: "Total Revenue",
      value: "$12,847",
      change: "+15.2%",
      trend: "up",
    },
    {
      label: "Completed Jobs",
      value: "156",
      change: "+8.4%",
      trend: "up",
    },
    {
      label: "Average Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
    },
    {
      label: "Response Time",
      value: "2.3h",
      change: "-12%",
      trend: "down",
    },
  ];

  const generateReport = () => {
    console.log(`Generating ${reportType} report for ${dateRange}`);
    // Report generation logic would go here
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate detailed reports and track your business performance
        </p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={`h-4 w-4 ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate New Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate New Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="bookings">Booking Summary</SelectItem>
                  <SelectItem value="performance">
                    Performance Review
                  </SelectItem>
                  <SelectItem value="clients">Client Analysis</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateReport} className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Report Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <report.icon className={`h-8 w-8 ${report.color}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {report.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Last generated {report.lastGenerated}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {report.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Generated on {report.generatedOn} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{report.format}</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
