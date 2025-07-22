"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, BarChart3, PieChart, Activity,
  MapPin, Calendar, Filter, Download
} from 'lucide-react';

interface MetricData {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

interface BusinessIntelligenceProps {
  className?: string;
}

export function BusinessIntelligence({ className }: BusinessIntelligenceProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics: MetricData[] = [
    {
      label: 'Total Revenue',
      value: '$124,580',
      change: 12.5,
      trend: 'up',
      icon: DollarSign
    },
    {
      label: 'Active Users',
      value: '8,426',
      change: 8.2,
      trend: 'up',
      icon: Users
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: -2.1,
      trend: 'down',
      icon: Target
    },
    {
      label: 'Avg. Session',
      value: '4m 32s',
      change: 15.3,
      trend: 'up',
      icon: Activity
    }
  ];

  const regionData = [
    { region: 'North America', revenue: 45600, users: 3250, growth: 12.3 },
    { region: 'Europe', revenue: 38900, users: 2890, growth: 8.7 },
    { region: 'Asia Pacific', revenue: 28700, users: 2140, growth: 18.5 },
    { region: 'Latin America', revenue: 11380, users: 146, growth: 7.2 }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Business Intelligence
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mt-1">
            Advanced analytics and insights for your business
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {metric.value}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <metric.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-sm text-slate-500">vs last period</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-gray-400">
                  Revenue chart visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Market Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-gray-400">
                  Market distribution chart
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Regional Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {region.region}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {region.users.toLocaleString()} active users
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    ${region.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-600">
                      +{region.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
