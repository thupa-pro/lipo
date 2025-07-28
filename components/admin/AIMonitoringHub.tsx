import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { aiClient } from '@/lib/ai/gemini-client';
import { Monitor, Cpu, Database, Network, Activity, TrendingUp, Bell, Play, Pause, RefreshCw, Brain, Gauge, Server, Cloud, Eye, Zap, Target } from "lucide-react";

interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  aiRecommendation?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  aiOptimization?: string;
}

export default function AIMonitoringHub({ platformData }: { platformData: any }) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isGeneratingOptimizations, setIsGeneratingOptimizations] = useState(false);

  useEffect(() => {
    generateInitialData();
    if (isMonitoring) {
      const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const generateInitialData = () => {
    const initialMetrics: PerformanceMetric[] = [
      {
        name: 'CPU Usage',
        value: 67,
        unit: '%',
        status: 'optimal',
        trend: 'stable',
        aiOptimization: 'Current usage is within optimal range. Consider load balancing for peak hours.'
      },
      {
        name: 'Memory Usage',
        value: 78,
        unit: '%',
        status: 'warning',
        trend: 'up',
        aiOptimization: 'Memory usage trending upward. Implement caching strategies to optimize.'
      },
      {
        name: 'API Response Time',
        value: 145,
        unit: 'ms',
        status: 'optimal',
        trend: 'down',
        aiOptimization: 'Response times improving. Current optimization strategies are effective.'
      },
      {
        name: 'Database Connections',
        value: 234,
        unit: 'active',
        status: 'optimal',
        trend: 'stable',
        aiOptimization: 'Connection pool size is adequate for current load patterns.'
      },
      {
        name: 'Error Rate',
        value: 0.12,
        unit: '%',
        status: 'optimal',
        trend: 'down',
        aiOptimization: 'Error rates are decreasing. Monitoring and alerting systems are effective.'
      },
      {
        name: 'Throughput',
        value: 1247,
        unit: 'req/min',
        status: 'optimal',
        trend: 'up',
        aiOptimization: 'Throughput increasing steadily. Infrastructure scaling is working well.'
      }
    ];

    const initialAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'info',
        title: 'System Optimization Complete',
        description: 'AI-driven performance optimization has been successfully applied.',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        resolved: true,
        aiRecommendation: 'Continue monitoring for improved performance metrics.'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Memory Usage Trending High',
        description: 'Memory usage has increased by 15% in the last hour.',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        resolved: false,
        aiRecommendation: 'Implement memory optimization strategies and consider horizontal scaling.'
      }
    ];

    setMetrics(initialMetrics);
    setAlerts(initialAlerts);
  };

  const updateMetrics = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * (metric.value * 0.1), // Small random fluctuation
      trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : metric.trend
    })));
    setLastUpdate(new Date());
  };

  const generateAIOptimizations = async () => {
    setIsGeneratingOptimizations(true);
    try {
      // Generate optimization recommendations from Sophia (Operations AI)
      const optimization = await aiClient.generateInsight(
        'sophia',
        'system_optimization',
        { metrics, alerts, platformData }
      );

      const newAlert: SystemAlert = {
        id: Date.now().toString(),
        type: 'info',
        title: 'AI Optimization Recommendation',
        description: optimization,
        timestamp: new Date(),
        resolved: false,
        aiRecommendation: 'Review and implement the suggested optimizations for improved performance.'
      };

      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Error generating AI optimizations:', error);
    } finally {
      setIsGeneratingOptimizations(false);
    }
  };

  const getMetricIcon = (name: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'CPU Usage': <Cpu className="h-4 w-4" />,
      'Memory Usage': <Database className="h-4 w-4" />,
      'API Response Time': <Network className="h-4 w-4" />,
      'Database Connections': <Server className="h-4 w-4" />,
      'Error Rate': <UIIcons.AlertTriangle className="h-4 w-4" / />,
      'Throughput': <Activity className="h-4 w-4" />
    };
    return icons[name] || <Gauge className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      optimal: 'text-green-600 bg-green-50 border-green-200',
      warning: 'text-amber-600 bg-amber-50 border-amber-200',
      critical: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.optimal;
  };

  const getAlertColor = (type: string) => {
    const colors = {
      critical: 'text-red-600 bg-red-50 border-red-200',
      warning: 'text-amber-600 bg-amber-50 border-amber-200',
      info: 'text-blue-600 bg-blue-50 border-blue-200',
      success: 'text-green-600 bg-green-50 border-green-200'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getTrendIcon = (trend: string) => {
    const icons = {
      up: <TrendingUp className="h-3 w-3 text-green-600" />,
      down: <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />,
      stable: <Activity className="h-3 w-3 text-gray-600" />
    };
    return icons[trend as keyof typeof icons] || icons.stable;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border bg-gradient-to-r from-slate-50 to-gray-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Monitor className="h-6 w-6 text-slate-600" />
                AI System Monitoring Hub
              </CardTitle>
              <p className="text-gray-600 mt-1">Real-time performance monitoring with AI-powered optimizations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button
                onClick={generateAIOptimizations}
                disabled={isGeneratingOptimizations}
                className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
              >
                {isGeneratingOptimizations ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    AI Optimize
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsMonitoring(!isMonitoring)}
                variant={isMonitoring ? "destructive" : "default"}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`gradient-border hover:shadow-lg transition-all duration-300 ${getStatusColor(metric.status)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getMetricIcon(metric.name)}
                  <span className="font-medium text-sm">{metric.name}</span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="text-2xl font-bold mb-1">
                {typeof metric.value === 'number' ? metric.value.toFixed(metric.name === 'Error Rate' ? 2 : 0) : metric.value}
                <span className="text-sm font-normal text-gray-600 ml-1">{metric.unit}</span>
              </div>

              <div className="text-xs text-gray-600 mb-2">
                Status: <span className="font-medium capitalize">{metric.status}</span>
              </div>

              {metric.aiOptimization && (
                <div className="mt-3 p-2 bg-white/50 rounded text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    <Brain className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-blue-600">AI Insight</span>
                  </div>
                  <p className="text-gray-700">{metric.aiOptimization}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Alerts */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            System Alerts & AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UIIcons.CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" / />
                <p>All systems operating optimally</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                    alert.resolved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {alert.type === 'critical' && <UIIcons.AlertTriangle className="h-4 w-4" / />}
                        {alert.type === 'warning' && <UIIcons.AlertTriangle className="h-4 w-4" / />}
                        {alert.type === 'info' && <Bell className="h-4 w-4" />}
                        {alert.type === 'success' && <UIIcons.CheckCircle className="h-4 w-4" / />}
                        <span className="font-medium">{alert.title}</span>
                        {alert.resolved && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-2">{alert.description}</p>
                      
                      {alert.aiRecommendation && (
                        <div className="bg-white/50 p-2 rounded text-xs mt-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Target className="h-3 w-3 text-purple-600" />
                            <span className="font-medium text-purple-600">AI Recommendation</span>
                          </div>
                          <p>{alert.aiRecommendation}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </div>
                      {!alert.resolved && (
                        <Button size="sm" variant="outline" className="mt-2">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-600" />
            Infrastructure Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Load Balancers</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">3/3</div>
              <div className="text-xs text-blue-700">All healthy</div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Databases</span>
              </div>
              <div className="text-2xl font-bold text-green-900">5/5</div>
              <div className="text-xs text-green-700">Optimal performance</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <OptimizedIcon name="Shield" className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Security</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">100%</div>
              <div className="text-xs text-purple-700">All checks passed</div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">Auto-scaling</span>
              </div>
              <div className="text-2xl font-bold text-amber-900">Active</div>
              <div className="text-xs text-amber-700">2 instances added</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
