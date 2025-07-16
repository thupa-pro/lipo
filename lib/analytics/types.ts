// Analytics and Observability Types

export interface KeyMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  growthRate: number;
  conversionRate: number;
  avgSessionDuration: number;
}

export interface UserMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  returningUsers: number;
  userGrowthRate: number;
  avgSessionsPerUser: number;
  userRetentionRate: number;
  topUserSegments: Array<{
    segment: string;
    count: number;
    percentage: number;
  }>;
  usersByLocation: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  usersByDevice: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageOrderValue: number;
  totalBookings: number;
  revenueGrowthRate: number;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
    growth: number;
  }>;
  revenueByRegion: Array<{
    region: string;
    revenue: number;
    percentage: number;
  }>;
  topSpendingUsers: Array<{
    userId: string;
    userName: string;
    totalSpent: number;
    bookingCount: number;
  }>;
  revenueTimeline: Array<{
    date: string;
    revenue: number;
    bookings: number;
  }>;
}

export interface PerformanceMetrics {
  systemHealth: {
    status: "healthy" | "warning" | "critical";
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  databaseMetrics: {
    connectionCount: number;
    queryPerformance: number;
    slowQueries: number;
    cacheHitRate: number;
  };
  apiMetrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    p95ResponseTime: number;
  };
  errorAnalysis: Array<{
    errorType: string;
    count: number;
    lastOccurrence: string;
    impact: "low" | "medium" | "high";
  }>;
  performanceTimeline: Array<{
    timestamp: string;
    responseTime: number;
    throughput: number;
    errorRate: number;
  }>;
}

export interface BusinessIntelligence {
  customerLifetimeValue: number;
  customerAcquisitionCost: number;
  churnRate: number;
  netPromoterScore: number;
  marketSegmentAnalysis: Array<{
    segment: string;
    size: number;
    growth: number;
    revenue: number;
    profitability: number;
  }>;
  competitiveAnalysis: Array<{
    metric: string;
    ourValue: number;
    industryAverage: number;
    percentile: number;
  }>;
  seasonalTrends: Array<{
    period: string;
    bookings: number;
    revenue: number;
    popularCategories: string[];
  }>;
  predictiveMetrics: {
    projectedRevenue: number;
    projectedUsers: number;
    riskFactors: Array<{
      factor: string;
      impact: "low" | "medium" | "high";
      probability: number;
    }>;
  };
}

export interface RealTimeMetrics {
  currentActiveUsers: number;
  realtimeBookings: number;
  systemLoad: number;
  alertsCount: number;
  recentActivity: Array<{
    id: string;
    type: "booking" | "signup" | "payment" | "error";
    description: string;
    timestamp: string;
    severity?: "info" | "warning" | "error";
  }>;
  geographicActivity: Array<{
    location: string;
    latitude: number;
    longitude: number;
    activityCount: number;
  }>;
}

export interface AnalyticsChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }>;
}

export interface ConversionFunnel {
  stage: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface CohortAnalysis {
  cohort: string;
  month0: number;
  month1: number;
  month2: number;
  month3: number;
  month6: number;
  month12: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: "greater_than" | "less_than" | "equals" | "percentage_change";
  threshold: number;
  timeframe: string;
  severity: "low" | "medium" | "high" | "critical";
  isActive: boolean;
  notifications: string[];
  lastTriggered?: string;
}

export interface Alert {
  id: string;
  ruleId: string;
  ruleName: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "acknowledged" | "resolved";
  triggeredAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  metadata?: Record<string, any>;
}

export interface ExportOptions {
  format: "csv" | "xlsx" | "pdf" | "json";
  metrics: string[];
  timeframe: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  includeCharts: boolean;
  includeRawData: boolean;
}

export interface AnalyticsApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedAnalyticsResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filter and query types
export interface AnalyticsFilter {
  field: string;
  operator: "eq" | "ne" | "gt" | "lt" | "gte" | "lte" | "in" | "like";
  value: any;
}

export interface AnalyticsQuery {
  timeframe: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  filters?: AnalyticsFilter[];
  groupBy?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

// Dashboard configuration
export interface DashboardWidget {
  id: string;
  type: "chart" | "metric" | "table" | "map" | "funnel";
  title: string;
  description?: string;
  metric: string;
  chartType?: "line" | "bar" | "pie" | "doughnut" | "area";
  size: "small" | "medium" | "large";
  position: { x: number; y: number; w: number; h: number };
  config?: Record<string, any>;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Constants
export const TIMEFRAME_OPTIONS = [
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
  { value: "1y", label: "Last Year" },
  { value: "custom", label: "Custom Range" },
] as const;

export type TimeframeOption = (typeof TIMEFRAME_OPTIONS)[number]["value"];

export const METRIC_CATEGORIES = {
  USER: "User Metrics",
  REVENUE: "Revenue Metrics",
  PERFORMANCE: "Performance Metrics",
  BUSINESS: "Business Intelligence",
  SYSTEM: "System Health",
} as const;

export const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  warning: "#F97316",
  info: "#06B6D4",
  success: "#22C55E",
  muted: "#6B7280",
} as const;

export const ALERT_SEVERITIES = {
  low: { color: "#22C55E", label: "Low" },
  medium: { color: "#F59E0B", label: "Medium" },
  high: { color: "#F97316", label: "High" },
  critical: { color: "#EF4444", label: "Critical" },
} as const;

export const DEFAULT_METRICS_CONFIG = {
  refreshInterval: 30000, // 30 seconds
  retentionDays: 90,
  aggregationInterval: "1h",
  alertThresholds: {
    errorRate: 5, // 5%
    responseTime: 2000, // 2 seconds
    uptime: 99.9, // 99.9%
  },
} as const;
