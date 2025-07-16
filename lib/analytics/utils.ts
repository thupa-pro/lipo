import { createClient } from "@/lib/supabase/client";
import type {
  KeyMetrics,
  UserMetrics,
  RevenueMetrics,
  PerformanceMetrics,
  BusinessIntelligence,
  RealTimeMetrics,
  AnalyticsChartData,
  ConversionFunnel,
  CohortAnalysis,
  Alert,
  AlertRule,
  ExportOptions,
  AnalyticsApiResponse,
  AnalyticsQuery,
  Dashboard,
  DashboardWidget,
  TimeframeOption,
} from "./types";

export class AnalyticsClient {
  private supabase = createClient();

  // Key Metrics
  async getKeyMetrics(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<KeyMetrics>> {
    try {
      const { data, error } = await this.supabase.rpc("get_key_metrics", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching key metrics:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch key metrics",
      };
    }
  }

  // User Analytics
  async getUserMetrics(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<UserMetrics>> {
    try {
      const { data, error } = await this.supabase.rpc("get_user_metrics", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching user metrics:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user metrics",
      };
    }
  }

  async getUserGrowthChart(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<AnalyticsChartData>> {
    try {
      const { data, error } = await this.supabase.rpc("get_user_growth_chart", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching user growth chart:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user growth chart",
      };
    }
  }

  async getConversionFunnel(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<ConversionFunnel[]>> {
    try {
      const { data, error } = await this.supabase.rpc("get_conversion_funnel", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching conversion funnel:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversion funnel",
      };
    }
  }

  async getCohortAnalysis(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<CohortAnalysis[]>> {
    try {
      const { data, error } = await this.supabase.rpc("get_cohort_analysis", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching cohort analysis:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch cohort analysis",
      };
    }
  }

  // Revenue Analytics
  async getRevenueMetrics(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<RevenueMetrics>> {
    try {
      const { data, error } = await this.supabase.rpc("get_revenue_metrics", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching revenue metrics:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch revenue metrics",
      };
    }
  }

  async getRevenueChart(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<AnalyticsChartData>> {
    try {
      const { data, error } = await this.supabase.rpc("get_revenue_chart", {
        timeframe_param: timeframe,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching revenue chart:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch revenue chart",
      };
    }
  }

  // Performance Monitoring
  async getPerformanceMetrics(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<PerformanceMetrics>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_performance_metrics",
        { timeframe_param: timeframe },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch performance metrics",
      };
    }
  }

  async getSystemHealth(): Promise<
    AnalyticsApiResponse<PerformanceMetrics["systemHealth"]>
  > {
    try {
      const { data, error } = await this.supabase.rpc("get_system_health");

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching system health:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch system health",
      };
    }
  }

  // Business Intelligence
  async getBusinessIntelligence(
    timeframe: string,
  ): Promise<AnalyticsApiResponse<BusinessIntelligence>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "get_business_intelligence",
        { timeframe_param: timeframe },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching business intelligence:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch business intelligence",
      };
    }
  }

  // Real-time Metrics
  async getRealTimeMetrics(): Promise<AnalyticsApiResponse<RealTimeMetrics>> {
    try {
      const { data, error } = await this.supabase.rpc("get_realtime_metrics");

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error fetching real-time metrics:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch real-time metrics",
      };
    }
  }

  // Subscribe to real-time updates
  subscribeToRealTimeMetrics(callback: (data: RealTimeMetrics) => void) {
    const channel = this.supabase
      .channel("realtime-metrics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "analytics_events",
        },
        () => {
          // Fetch updated metrics when changes occur
          this.getRealTimeMetrics().then((response) => {
            if (response.success && response.data) {
              callback(response.data);
            }
          });
        },
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }

  // Alerts Management
  async getAlerts(status?: string): Promise<AnalyticsApiResponse<Alert[]>> {
    try {
      let query = this.supabase
        .from("analytics_alerts")
        .select("*")
        .order("triggered_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch alerts",
      };
    }
  }

  async getAlertRules(): Promise<AnalyticsApiResponse<AlertRule[]>> {
    try {
      const { data, error } = await this.supabase
        .from("analytics_alert_rules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching alert rules:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch alert rules",
      };
    }
  }

  async createAlertRule(
    rule: Omit<AlertRule, "id">,
  ): Promise<AnalyticsApiResponse<AlertRule>> {
    try {
      const { data, error } = await this.supabase
        .from("analytics_alert_rules")
        .insert([rule])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating alert rule:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create alert rule",
      };
    }
  }

  async acknowledgeAlert(
    alertId: string,
    userId: string,
  ): Promise<AnalyticsApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from("analytics_alerts")
        .update({
          status: "acknowledged",
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: userId,
        })
        .eq("id", alertId);

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to acknowledge alert",
      };
    }
  }

  async resolveAlert(
    alertId: string,
    userId: string,
  ): Promise<AnalyticsApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from("analytics_alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: userId,
        })
        .eq("id", alertId);

      if (error) throw error;

      return { success: true, data: true };
    } catch (error) {
      console.error("Error resolving alert:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to resolve alert",
      };
    }
  }

  // Dashboard Management
  async getDashboards(): Promise<AnalyticsApiResponse<Dashboard[]>> {
    try {
      const { data, error } = await this.supabase
        .from("analytics_dashboards")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error fetching dashboards:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch dashboards",
      };
    }
  }

  async createDashboard(
    dashboard: Omit<Dashboard, "id" | "createdAt" | "updatedAt">,
  ): Promise<AnalyticsApiResponse<Dashboard>> {
    try {
      const { data, error } = await this.supabase
        .from("analytics_dashboards")
        .insert([
          {
            ...dashboard,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error creating dashboard:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create dashboard",
      };
    }
  }

  async updateDashboard(
    dashboardId: string,
    updates: Partial<Dashboard>,
  ): Promise<AnalyticsApiResponse<Dashboard>> {
    try {
      const { data, error } = await this.supabase
        .from("analytics_dashboards")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dashboardId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error updating dashboard:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update dashboard",
      };
    }
  }

  // Export Functions
  async exportAnalytics(
    timeframe: string,
    dateRange?: { from: Date; to: Date },
    options?: ExportOptions,
  ): Promise<AnalyticsApiResponse<string>> {
    try {
      const { data, error } = await this.supabase.rpc("export_analytics_data", {
        timeframe_param: timeframe,
        date_range: dateRange
          ? {
              from: dateRange.from.toISOString(),
              to: dateRange.to.toISOString(),
            }
          : null,
        export_options: options || {},
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error exporting analytics:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to export analytics",
      };
    }
  }

  // Custom Queries
  async executeCustomQuery(
    query: AnalyticsQuery,
  ): Promise<AnalyticsApiResponse<any>> {
    try {
      const { data, error } = await this.supabase.rpc(
        "execute_analytics_query",
        { query_params: query },
      );

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error("Error executing custom query:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to execute query",
      };
    }
  }

  // Utility Functions
  formatMetric(
    value: number,
    type: "currency" | "number" | "percentage" | "duration",
  ): string {
    switch (type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(value);
      case "percentage":
        return `${value.toFixed(1)}%`;
      case "duration":
        if (value < 60) return `${Math.round(value)}s`;
        if (value < 3600) return `${Math.round(value / 60)}m`;
        return `${Math.round(value / 3600)}h`;
      default:
        return new Intl.NumberFormat("en-US").format(value);
    }
  }

  calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  getTimeframeDates(timeframe: TimeframeOption): { from: Date; to: Date } {
    const now = new Date();
    const to = new Date(now);
    let from: Date;

    switch (timeframe) {
      case "1h":
        from = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "24h":
        from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { from, to };
  }

  generateChartColors(count: number): string[] {
    const baseColors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#22C55E",
      "#F97316",
      "#EC4899",
      "#6366F1",
    ];

    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Generate additional colors if needed
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const hue = (i * 137.508) % 360; // Golden angle approximation
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
  }

  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}

export const analyticsClient = new AnalyticsClient();

// Export utility functions
export { analyticsClient as default };
