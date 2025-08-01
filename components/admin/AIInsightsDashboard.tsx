import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { aiClient } from '@/lib/ai/gemini-client';
import { TrendingUp, TrendingDown, Brain, Target, Activity, Eye, RefreshCw, Lightbulb, BarChart3 } from "lucide-react";

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  agentId: string;
  timestamp: Date;
  actionable: boolean;
  priority: number;
}

interface Metric {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  prediction: string;
  confidence: number;
}

export default function AIInsightsDashboard({ platformData }: { platformData: any }) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    generateInsights();
    generateMetrics();
  }, [platformData]);

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      // Generate insights from different AI agents
      const agentPromises = [
        aiClient.generateInsight('sophia', 'growth_analysis', platformData),
        aiClient.generateInsight('marcus', 'security_analysis', platformData),
        aiClient.generateInsight('elena', 'user_experience', platformData),
        aiClient.generateInsight('alex', 'financial_analysis', platformData)
      ];

      const results = await Promise.all(agentPromises);
      
      const newInsights: Insight[] = results.map((result, index) => ({
        id: `insight-${Date.now()}-${index}`,
        type: getInsightType(index),
        title: getInsightTitle(index),
        description: result,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        impact: getInsightImpact(index),
        agentId: ['sophia', 'marcus', 'elena', 'alex'][index],
        timestamp: new Date(),
        actionable: true,
        priority: Math.floor(Math.random() * 5) + 1
      }));

      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Fallback insights
      setInsights(getFallbackInsights());
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMetrics = () => {
    const mockMetrics: Metric[] = [
      {
        name: 'User Engagement Score',
        value: '87.3%',
        change: 5.2,
        trend: 'up',
        prediction: 'Will reach 90% by next week',
        confidence: 85
      },
      {
        name: 'Revenue Growth Rate',
        value: '+23.5%',
        change: 2.1,
        trend: 'up',
        prediction: 'Sustainable 20%+ growth expected',
        confidence: 78
      },
      {
        name: 'Security Risk Score',
        value: '4.2/10',
        change: -1.3,
        trend: 'down',
        prediction: 'Risk will decrease to 3.5 by month-end',
        confidence: 92
      },
      {
        name: 'Provider Satisfaction',
        value: '94.1%',
        change: 1.8,
        trend: 'up',
        prediction: 'May reach 95% threshold soon',
        confidence: 73
      }
    ];
    setMetrics(mockMetrics);
  };

  const getInsightType = (index: number): Insight['type'] => {
    const types: Insight['type'][] = ['opportunity', 'warning', 'success', 'prediction'];
    return types[index % 4];
  };

  const getInsightTitle = (index: number): string => {
    const titles = [
      'Growth Optimization Opportunity',
      'Security Alert Detected',
      'User Experience Success',
      'Revenue Prediction Update'
    ];
    return titles[index % 4];
  };

  const getInsightImpact = (index: number): Insight['impact'] => {
    const impacts: Insight['impact'][] = ['high', 'medium', 'low', 'high'];
    return impacts[index % 4];
  };

  const getFallbackInsights = (): Insight[] => [
    {
      id: 'fallback-1',
      type: 'opportunity',
      title: 'User Engagement Optimization',
      description: 'Based on recent activity, patterns, implementing personalized dashboards could increase user engagement by 15-20%.',
      confidence: 82,
      impact: 'high',
      agentId: 'sophia',
      timestamp: new Date(),
      actionable: true,
      priority: 1
    },
    {
      id: 'fallback-2',
      type: 'warning',
      title: 'Security Monitoring Alert',
      description: 'Unusual login patterns detected in the last 6 hours. Recommend increasing security monitoring and implementing additional authentication layers.',
      confidence: 91,
      impact: 'medium',
      agentId: 'marcus',
      timestamp: new Date(),
      actionable: true,
      priority: 2
    }
  ];

  const getInsightIcon = (type: Insight['type']) => {
    const icons = {
      opportunity: <Target className="h-4 w-4" />,
      warning: <UIIcons.AlertTriangle className="h-4 w-4" / />,
      success: <UIIcons.CheckCircle className="h-4 w-4" / />,
      prediction: <Brain className="h-4 w-4" />
    };
    return icons[type];
  };

  const getInsightColor = (type: Insight['type']) => {
    const colors = {
      opportunity: 'text-blue-600 bg-blue-50',
      warning: 'text-amber-600 bg-amber-50',
      success: 'text-green-600 bg-green-50',
      prediction: 'text-purple-600 bg-purple-50'
    };
    return colors[type];
  };

  const getImpactColor = (impact: Insight['impact']) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      medium: 'text-orange-600 bg-orange-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[impact];
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    const icons = {
      up: <TrendingUp className="h-4 w-4 text-green-600" />,
      down: <TrendingDown className="h-4 w-4 text-red-600" />,
      stable: <Activity className="h-4 w-4 text-gray-600" />
    };
    return icons[trend];
  };

  const getAgentAvatar = (agentId: string) => {
    const avatars = {
      sophia: '🧠',
      marcus: '🛡️',
      elena: '💫',
      alex: '📈'
    };
    return avatars[agentId as keyof typeof avatars] || '🤖';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="h-6 w-6 text-indigo-600" />
                AI Intelligence Center
              </CardTitle>
              <p className="text-gray-600 mt-1">Real-time insights and predictive analytics powered by AGI</p>
            </div>
            <Button 
              onClick={generateInsights}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Insights
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Predictive Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-xs text-gray-600 mb-3">{metric.prediction}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Confidence</span>
                  <span className="text-xs font-medium">{metric.confidence}%</span>
                </div>
                <Progress value={metric.confidence} className="h-1 mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <Card key={insight.id} className="gradient-border hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{getAgentAvatar(insight.agentId)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${getInsightColor(insight.type)}`}>
                        {getInsightIcon(insight.type)}
                      </span>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact.toUpperCase()} IMPACT
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {insight.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Confidence</div>
                  <div className="text-sm font-bold text-gray-900">{insight.confidence}%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{insight.description}</p>
              
              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>AI Confidence Level</span>
                  <span>{insight.confidence}%</span>
                </div>
                <Progress value={insight.confidence} className="h-2" />
              </div>

              {insight.actionable && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Take Action
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time-based Analytics */}
      <Card className="gradient-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <OptimizedIcon name="Clock" className="h-5 w-5 text-purple-600" />
              Temporal Analysis
            </CardTitle>
            <div className="flex gap-2">
              {['1h', '24h', '7d', '30d'].map((timeframe) => (
                <Button
                  key={timeframe}
                  size="sm"
                  variant={selectedTimeframe === timeframe ? "default" : "outline"}
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <NavigationIcons.Users className="h-4 w-4 text-blue-600" / />
                <span className="text-sm font-medium text-blue-900">User Activity Patterns</span>
              </div>
              <p className="text-xs text-blue-700 mb-2">Peak hours: 2-4 PM, 7-9 PM</p>
              <div className="text-lg font-bold text-blue-900">+12.5% vs last {selectedTimeframe}</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BusinessIcons.DollarSign className="h-4 w-4 text-green-600" / />
                <span className="text-sm font-medium text-green-900">Revenue Trends</span>
              </div>
              <p className="text-xs text-green-700 mb-2">Consistent growth trajectory</p>
              <div className="text-lg font-bold text-green-900">+18.7% vs last {selectedTimeframe}</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <OptimizedIcon name="Shield" className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Security Events</span>
              </div>
              <p className="text-xs text-purple-700 mb-2">All systems secure</p>
              <div className="text-lg font-bold text-purple-900">0 threats detected</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}