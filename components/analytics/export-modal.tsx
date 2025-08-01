import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, FileSpreadsheet, FileImage } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: any;
}

export function ExportModal({ open, onOpenChange, filters }: ExportModalProps) {
  const [exportType, setExportType] = useState("pdf");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "overview",
    "users",
    "revenue",
    "performance",
  ]);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeRawData, setIncludeRawData] = useState(false);
  const [reportTitle, setReportTitle] = useState("Analytics Report");
  const [reportDescription, setReportDescription] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF Report",
      description: "Professional report with charts and insights",
      icon: FileText,
      size: "2-5 MB",
    },
    {
      id: "excel",
      name: "Excel Workbook",
      description: "Raw data with multiple sheets",
      icon: FileSpreadsheet,
      size: "1-3 MB",
    },
    {
      id: "csv",
      name: "CSV Data",
      description: "Raw data in comma-separated format",
      icon: FileText,
      size: "100-500 KB",
    },
    {
      id: "png",
      name: "Chart Images",
      description: "High-resolution chart images",
      icon: FileImage,
      size: "5-10 MB",
    },
  ];

  const metricsOptions = [
    {
      id: "overview",
      name: "Overview & KPIs",
      description: "Key performance indicators and summary",
    },
    {
      id: "users",
      name: "User Analytics",
      description: "User, acquisition, retention, and behavior",
    },
    {
      id: "revenue",
      name: "Revenue Analysis",
      description: "Financial metrics and trends",
    },
    {
      id: "performance",
      name: "Performance Metrics",
      description: "System and operational metrics",
    },
    {
      id: "funnel",
      name: "Conversion Funnel",
      description: "User journey and conversion rates",
    },
    {
      id: "cohorts",
      name: "Cohort Analysis",
      description: "User behavior over time",
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const intervals = [
      { delay: 500, progress: 20, message: "Gathering data..." },
      { delay: 1000, progress: 40, message: "Processing metrics..." },
      { delay: 800, progress: 60, message: "Generating charts..." },
      { delay: 700, progress: 80, message: "Formatting report..." },
      { delay: 500, progress: 100, message: "Export complete!" },
    ];

    for (const interval of intervals) {
      await new Promise((resolve) => setTimeout(resolve, interval.delay));
      setExportProgress(interval.progress);
    }

    setExportComplete(true);

    // Simulate download
    setTimeout(() => {
      const blob = new Blob(["Mock export data"], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportTitle.replace(/\s+/g, "_")}.${exportType}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Reset modal
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportComplete(false);
        onOpenChange(false);
      }, 2000);
    }, 1000);
  };

  const selectedFormat = exportFormats.find((f) => f.id === exportType);

  if (isExporting || exportComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exportComplete ? (
                <UIIcons.CheckCircle className="w-5 h-5 text-green-500" / />
              ) : (
                <UIIcons.Loader2 className="w-5 h-5 animate-spin" / />
              )}
              {exportComplete ? "Export Complete" : "Exporting Report"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Progress value={exportProgress} className="w-full" />
            <div className="text-center text-sm text-muted-foreground">
              {exportComplete
                ? "Your report has been downloaded successfully!"
                : `Processing... ${exportProgress}%`}
            </div>

            {exportComplete && (
              <div className="flex justify-center">
                <Button onClick={() => onOpenChange(false)}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Analytics Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Add a description for your report"
                rows={2}
              />
            </div>
          </div>

          {/* Export Format */}
          <div className="space-y-4">
            <Label>Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <Card
                    key={format.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      exportType === format.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setExportType(format.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Icon className="w-8 h-8 text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium">{format.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            ~{format.size}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Metrics Selection */}
          <div className="space-y-4">
            <Label>Include Metrics</Label>
            <div className="space-y-3">
              {metricsOptions.map((metric) => (
                <div key={metric.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMetrics([...selectedMetrics, metric.id]);
                      } else {
                        setSelectedMetrics(
                          selectedMetrics.filter((m) => m !== metric.id),
                        );
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={metric.id}
                      className="font-medium cursor-pointer"
                    >
                      {metric.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Label>Export Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={includeCharts}
                  onCheckedChange={setIncludeCharts}
                />
                <Label htmlFor="charts" className="cursor-pointer">
                  Include charts and visualizations
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rawdata"
                  checked={includeRawData}
                  onCheckedChange={setIncludeRawData}
                />
                <Label htmlFor="rawdata" className="cursor-pointer">
                  Include raw data tables
                </Label>
              </div>
            </div>
          </div>

          {/* Date Range Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BusinessIcons.Calendar className="w-4 h-4" / />
                <span className="font-medium">Report Period</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {filters.dateRange.from.toLocaleDateString()} -{" "}
                {filters.dateRange.to.toLocaleDateString()}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>Granularity: {filters.granularity}</span>
                <span>Segments: {filters.segments.join(", ")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Email Recipients (if applicable) */}
          {exportType === "pdf" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Recipients (Optional)</Label>
              <div className="flex items-center gap-2">
                <OptimizedIcon name="Mail" className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with commas. Leave empty to download
                only.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedMetrics.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export {selectedFormat?.name}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
