"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Download,
  FileText,
  TrendingUp,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  DollarSign,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { format } from "date-fns";

export default function ProviderReportsPage() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(2024, 0, 1),
    to: new Date(),
  });
  const [reportType, setReportType] = useState("earnings");

  const reports = [
    {
      id: 1,
      title: "Monthly Earnings Report",
      description:
        "Detailed breakdown of your earnings for the selected period",
      type: "earnings",
      icon: DollarSign,
      color: "text-green-600",
      generated: "2024-01-20",
      status: "ready",
    },
    {
      id: 2,
      title: "Booking Analytics",
      description: "Analysis of your booking patterns and customer behavior",
      type: "bookings",
      icon: CalendarIcon,
      color: "text-blue-600",
      generated: "2024-01-18",
      status: "ready",
    },
    {
      id: 3,
      title: "Performance Metrics",
      description: "Key performance indicators and trends",
      type: "performance",
      icon: TrendingUp,
      color: "text-purple-600",
      generated: "2024-01-15",
      status: "processing",
    },
    {
      id: 4,
      title: "Customer Feedback Summary",
      description: "Compilation of reviews and ratings",
      type: "feedback",
      icon: Eye,
      color: "text-orange-600",
      generated: "2024-01-12",
      status: "ready",
    },
  ];

  const quickStats = [
    { label: "Total Reports", value: "24", period: "This Year" },
    { label: "Avg. Response Time", value: "2.3h", period: "Last 30 Days" },
    { label: "Report Accuracy", value: "98.5%", period: "All Time" },
  ];

  const generateReport = () => {
    console.log("Generating report:", { reportType, dateRange });
    // In a real app, this would trigger report generation
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate and download detailed reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.period}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Generator */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>
              Create a custom report for your data
            </CardDescription>
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
                  <SelectItem value="earnings">Earnings Report</SelectItem>
                  <SelectItem value="bookings">Booking Analytics</SelectItem>
                  <SelectItem value="performance">
                    Performance Metrics
                  </SelectItem>
                  <SelectItem value="feedback">Customer Feedback</SelectItem>
                  <SelectItem value="tax">Tax Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`
                      : "Select date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => setDateRange(range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button onClick={generateReport} className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Download your previously generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => {
                const Icon = report.icon;
                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${report.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Generated: {report.generated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          report.status === "ready" ? "default" : "secondary"
                        }
                      >
                        {report.status}
                      </Badge>
                      {report.status === "ready" && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>
            Pre-configured report templates for common needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Tax Summary",
                description: "For tax filing purposes",
                icon: FileText,
              },
              {
                name: "Performance Review",
                description: "Monthly performance",
                icon: TrendingUp,
              },
              {
                name: "Customer Analysis",
                description: "Customer behavior insights",
                icon: Eye,
              },
              {
                name: "Time Tracking",
                description: "Hours worked summary",
                icon: Clock,
              },
            ].map((template, index) => {
              const Icon = template.icon;
              return (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
