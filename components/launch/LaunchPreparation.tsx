import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Rocket, TrendingUp, Server, Globe, Database, Code, FileText, Play, Pause, RefreshCw, Download, Upload, Monitor, Activity
  Award, BarChart3, PieChart
  Gauge, CheckSquare, XCircle, Info, ExternalLink, Copy, Eye, EyeOff, Plus, Minus, MoreVertical, Filter, Bell, MessageSquare
  Heart, Bookmark, Share2, GitBranch, GitCommit, GitMerge, Target, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LaunchChecklist {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  dependencies: string[];
  estimatedTime: string;
  assignee?: string;
  lastUpdated: Date;
}

interface PerformanceMetrics {
  id: string;
  metric: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: Array<{ timestamp: Date; value: number }>;
}

interface DeploymentStatus {
  id: string;
  environment: string;
  version: string;
  status: 'deploying' | 'success' | 'failed' | 'rollback';
  progress: number;
  startTime: Date;
  endTime?: Date;
  logs: Array<{ timestamp: Date; level: 'info' | 'warning' | 'error'; message: string }>;
  health: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

interface QualityMetrics {
  id: string;
  category: string;
  score: number;
  maxScore: number;
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: string;
    message: string;
    file?: string;
    line?: number;
  }>;
  trend: 'improving' | 'stable' | 'declining';
}

const mockLaunchChecklist: LaunchChecklist[] = [
  {
    id: '1',
    category: 'Performance',
    title: 'Optimize Bundle Size',
    description: 'Reduce JavaScript bundle size to under 300KB',
    status: 'completed',
    priority: 'high',
    progress: 100,
    dependencies: [],
    estimatedTime: '4 hours',
    assignee: 'Frontend Team',
    lastUpdated: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    category: 'Security',
    title: 'Security Audit',
    description: 'Complete penetration testing and vulnerability assessment',
    status: 'in-progress',
    priority: 'critical',
    progress: 75,
    dependencies: [],
    estimatedTime: '8 hours',
    assignee: 'Security Team',
    lastUpdated: new Date('2024-01-15T14:20:00')
  },
  {
    id: '3',
    category: 'Testing',
    title: 'End-to-End Tests',
    description: 'Achieve 95% test coverage for critical user flows',
    status: 'in-progress',
    priority: 'high',
    progress: 82,
    dependencies: ['1'],
    estimatedTime: '12 hours',
    assignee: 'QA Team',
    lastUpdated: new Date('2024-01-15T16:45:00')
  },
  {
    id: '4',
    category: 'Infrastructure',
    title: 'Load Testing',
    description: 'Verify system can handle 10,000 concurrent users',
    status: 'pending',
    priority: 'critical',
    progress: 0,
    dependencies: ['2', '3'],
    estimatedTime: '6 hours',
    assignee: 'DevOps Team',
    lastUpdated: new Date('2024-01-15T09:00:00')
  },
  {
    id: '5',
    category: 'Documentation',
    title: 'API Documentation',
    description: 'Complete and review all API documentation',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    dependencies: [],
    estimatedTime: '3 hours',
    assignee: 'Backend Team',
    lastUpdated: new Date('2024-01-14T17:00:00')
  },
  {
    id: '6',
    category: 'Compliance',
    title: 'GDPR Compliance',
    description: 'Ensure all data handling meets GDPR requirements',
    status: 'completed',
    priority: 'critical',
    progress: 100,
    dependencies: [],
    estimatedTime: '16 hours',
    assignee: 'Legal Team',
    lastUpdated: new Date('2024-01-13T11:30:00')
  }
];

const mockPerformanceMetrics: PerformanceMetrics[] = [
  {
    id: '1',
    metric: 'Page Load Time',
    value: 1.2,
    unit: 'seconds',
    target: 2.0,
    status: 'good',
    trend: 'down',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: 1.0 + Math.random() * 0.8
    }))
  },
  {
    id: '2',
    metric: 'First Contentful Paint',
    value: 0.8,
    unit: 'seconds',
    target: 1.5,
    status: 'good',
    trend: 'stable',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: 0.7 + Math.random() * 0.4
    }))
  },
  {
    id: '3',
    metric: 'Core Web Vitals Score',
    value: 92,
    unit: 'score',
    target: 90,
    status: 'good',
    trend: 'up',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: 85 + Math.random() * 10
    }))
  },
  {
    id: '4',
    metric: 'API Response Time',
    value: 150,
    unit: 'ms',
    target: 200,
    status: 'good',
    trend: 'down',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: 120 + Math.random() * 80
    }))
  },
  {
    id: '5',
    metric: 'Error Rate',
    value: 0.12,
    unit: '%',
    target: 0.5,
    status: 'good',
    trend: 'stable',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: Math.random() * 0.3
    }))
  },
  {
    id: '6',
    metric: 'Bundle Size',
    value: 285,
    unit: 'KB',
    target: 300,
    status: 'good',
    trend: 'down',
    history: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 3600000),
      value: 280 + Math.random() * 30
    }))
  }
];

const mockDeployments: DeploymentStatus[] = [
  {
    id: '1',
    environment: 'Production',
    version: 'v2.1.0',
    status: 'success',
    progress: 100,
    startTime: new Date('2024-01-15T14:00:00'),
    endTime: new Date('2024-01-15T14:15:00'),
    logs: [
      { timestamp: new Date('2024-01-15T14:00:00'), level: 'info', message: 'Starting deployment...' },
      { timestamp: new Date('2024-01-15T14:05:00'), level: 'info', message: 'Building application...' },
      { timestamp: new Date('2024-01-15T14:10:00'), level: 'info', message: 'Running tests...' },
      { timestamp: new Date('2024-01-15T14:15:00'), level: 'info', message: 'Deployment completed successfully' }
    ],
    health: { cpu: 45, memory: 62, disk: 35, network: 23 }
  },
  {
    id: '2',
    environment: 'Staging',
    version: 'v2.2.0-beta',
    status: 'deploying',
    progress: 65,
    startTime: new Date('2024-01-15T16:30:00'),
    logs: [
      { timestamp: new Date('2024-01-15T16:30:00'), level: 'info', message: 'Starting deployment...' },
      { timestamp: new Date('2024-01-15T16:35:00'), level: 'info', message: 'Building application...' },
      { timestamp: new Date('2024-01-15T16:40:00'), level: 'info', message: 'Running tests...' }
    ],
    health: { cpu: 38, memory: 55, disk: 42, network: 18 }
  },
  {
    id: '3',
    environment: 'Development',
    version: 'v2.2.0-alpha',
    status: 'success',
    progress: 100,
    startTime: new Date('2024-01-15T12:00:00'),
    endTime: new Date('2024-01-15T12:12:00'),
    logs: [
      { timestamp: new Date('2024-01-15T12:00:00'), level: 'info', message: 'Starting deployment...' },
      { timestamp: new Date('2024-01-15T12:08:00'), level: 'warning', message: 'Deprecated API usage detected' },
      { timestamp: new Date('2024-01-15T12:12:00'), level: 'info', message: 'Deployment completed successfully' }
    ],
    health: { cpu: 25, memory: 41, disk: 28, network: 15 }
  }
];

const mockQualityMetrics: QualityMetrics[] = [
  {
    id: '1',
    category: 'Code Quality',
    score: 87,
    maxScore: 100,
    issues: [
      { severity: 'medium', type: 'Code Complexity', message: 'Function too complex', file: 'utils/helpers.ts', line: 45 },
      { severity: 'low', type: 'Code Duplication', message: 'Duplicate code detected', file: 'components/ui/button.tsx', line: 23 }
    ],
    trend: 'improving'
  },
  {
    id: '2',
    category: 'Test Coverage',
    score: 94,
    maxScore: 100,
    issues: [
      { severity: 'medium', type: 'Missing Tests', message: 'No tests for error handling', file: 'api/auth.ts', line: 67 }
    ],
    trend: 'stable'
  },
  {
    id: '3',
    category: 'Security',
    score: 96,
    maxScore: 100,
    issues: [
      { severity: 'low', type: 'Dependency Vulnerability', message: 'Outdated package version', file: 'package.json', line: 15 }
    ],
    trend: 'improving'
  },
  {
    id: '4',
    category: 'Performance',
    score: 91,
    maxScore: 100,
    issues: [
      { severity: 'medium', type: 'Large Bundle', message: 'Component bundle too large', file: 'components/dashboard.tsx' }
    ],
    trend: 'stable'
  }
];

export function LaunchPreparation() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [checklistFilter, setChecklistFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [launchChecklist, setLaunchChecklist] = useState(mockLaunchChecklist);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);
  const [deployments, setDeployments] = useState(mockDeployments);
  const [qualityMetrics, setQualityMetrics] = useState(mockQualityMetrics);

  // Calculate overall readiness
  const completedTasks = launchChecklist.filter(task => task.status === 'completed').length;
  const totalTasks = launchChecklist.length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);
  const criticalTasksCompleted = launchChecklist.filter(task => 
    task.priority === 'critical' && task.status === 'completed'
  ).length;
  const totalCriticalTasks = launchChecklist.filter(task => task.priority === 'critical').length;

  // Filter checklist
  const filteredChecklist = launchChecklist.filter(task => {
    const matchesStatus = checklistFilter === 'all' || task.status === checklistFilter;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <OptimizedIcon name="Clock" className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <OptimizedIcon name="Clock" className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Launch Preparation</h1>
          <p className="text-gray-600 mt-1">Monitor readiness and prepare for production launch</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            Deploy to Production
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress value={overallProgress} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">{completedTasks} of {totalTasks} tasks completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{criticalTasksCompleted}/{totalCriticalTasks}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UIIcons.AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <Progress 
              value={(criticalTasksCompleted / totalCriticalTasks) * 100} 
              className="mt-3"
            />
            <p className="text-xs text-gray-500 mt-2">Mission critical items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Score</p>
                <p className="text-2xl font-bold text-gray-900">92/100</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={92} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">Code quality metrics</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">1.2s</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                Fast
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">Average page load time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="ci-cd">CI/CD</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Launch Readiness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Launch Readiness
                </CardTitle>
                <CardDescription>
                  Overall system readiness for production launch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Excellent
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Security</span>
                    <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">
                      In Progress
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Testing</span>
                    <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                      82% Complete
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Documentation</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Complete
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compliance</span>
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Verified
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Launch Confidence</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <Progress value={87} />
                  <p className="text-xs text-gray-500">
                    Based on completion of critical tasks and quality metrics
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-4">
                    {[
                      {
                        time: '2 minutes ago',
                        action: 'Security audit 75% complete',
                        type: 'progress',
                        icon: Shield
                      },
                      {
                        time: '15 minutes ago',
                        action: 'Performance optimization completed',
                        type: 'success',
                        icon: Zap
                      },
                      {
                        time: '1 hour ago',
                        action: 'End-to-end tests updated',
                        type: 'info',
                        icon: CheckSquare
                      },
                      {
                        time: '3 hours ago',
                        action: 'API documentation published',
                        type: 'success',
                        icon: FileText
                      },
                      {
                        time: '5 hours ago',
                        action: 'Load testing scheduled',
                        type: 'info',
                        icon: Server
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                          activity.type === 'success' ? 'bg-green-100 text-green-600' :
                          activity.type === 'progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                System Health Overview
              </CardTitle>
              <CardDescription>
                Real-time monitoring of all environments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{deployment.environment}</h4>
                      <Badge 
                        variant={deployment.status === 'success' ? 'secondary' : 'outline'}
                        className={
                          deployment.status === 'success' ? 'text-green-600 bg-green-50' :
                          deployment.status === 'deploying' ? 'text-blue-600 bg-blue-50' :
                          'text-red-600 bg-red-50'
                        }
                      >
                        {deployment.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span>{deployment.health.cpu}%</span>
                      </div>
                      <Progress value={deployment.health.cpu} />
                      
                      <div className="flex justify-between text-sm">
                        <span>Memory</span>
                        <span>{deployment.health.memory}%</span>
                      </div>
                      <Progress value={deployment.health.memory} />
                      
                      <div className="flex justify-between text-sm">
                        <span>Disk</span>
                        <span>{deployment.health.disk}%</span>
                      </div>
                      <Progress value={deployment.health.disk} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="search">Search:</Label>
                  <Input
                    id="search"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="status">Status:</Label>
                  <Select value={checklistFilter} onValueChange={setChecklistFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="priority">Priority:</Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items */}
          <div className="space-y-4">
            {filteredChecklist.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Progress: {task.progress}%</span>
                      <span>Est. Time: {task.estimatedTime}</span>
                      {task.assignee && <span>Assignee: {task.assignee}</span>}
                      <span>Updated: {task.lastUpdated.toLocaleDateString()}</span>
                    </div>
                    
                    {task.dependencies.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Dependencies:</p>
                        <div className="flex gap-1">
                          {task.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              Task #{dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-16">
                      <Progress value={task.progress} />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <NavigationIcons.Settings className="h-4 w-4 mr-2" />
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{metric.metric}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={getMetricStatusColor(metric.status)}
                    >
                      {metric.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                    <span className="text-xs text-gray-400">
                      Target: {metric.target} {metric.unit}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>vs Target</span>
                      <span className={metric.value <= metric.target ? 'text-green-600' : 'text-red-600'}>
                        {metric.value <= metric.target ? 'Within Target' : 'Above Target'}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.target) * 100, 100)}
                      className={metric.value <= metric.target ? '' : 'bg-red-100'}
                    />
                  </div>
                  
                  <div className="mt-4 h-32 bg-gray-50 rounded flex items-center justify-center text-sm text-gray-500">
                    Performance Chart (24h)
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-6">
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        {deployment.environment}
                      </CardTitle>
                      <CardDescription>
                        Version {deployment.version}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={deployment.status === 'success' ? 'secondary' : 'outline'}
                      className={
                        deployment.status === 'success' ? 'text-green-600 bg-green-50' :
                        deployment.status === 'deploying' ? 'text-blue-600 bg-blue-50' :
                        deployment.status === 'failed' ? 'text-red-600 bg-red-50' :
                        'text-yellow-600 bg-yellow-50'
                      }
                    >
                      {deployment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deployment Progress</span>
                      <span>{deployment.progress}%</span>
                    </div>
                    <Progress value={deployment.progress} />
                  </div>
                  
                  {/* Timing */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Started: {deployment.startTime.toLocaleTimeString()}</span>
                    {deployment.endTime && (
                      <span>Completed: {deployment.endTime.toLocaleTimeString()}</span>
                    )}
                  </div>
                  
                  {/* Health Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(deployment.health).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-gray-500 uppercase">{key}</p>
                        <p className="text-lg font-semibold">{value}%</p>
                        <Progress value={value} className="h-1" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Logs */}
                  <div>
                    <h4 className="font-medium mb-2">Recent Logs</h4>
                    <ScrollArea className="h-32 bg-gray-50 rounded p-3">
                      <div className="space-y-1 font-mono text-xs">
                        {deployment.logs.map((log, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="text-gray-500">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                            <span className={
                              log.level === 'error' ? 'text-red-600' :
                              log.level === 'warning' ? 'text-yellow-600' :
                              'text-gray-700'
                            }>
                              [{log.level.uppercase}]
                            </span>
                            <span>{log.message}</span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {qualityMetrics.map((quality) => (
              <Card key={quality.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      {quality.category}
                    </CardTitle>
                    <Badge 
                      variant="outline"
                      className={
                        quality.trend === 'improving' ? 'text-green-600' :
                        quality.trend === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }
                    >
                      {quality.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{quality.score}</span>
                    <span className="text-lg text-gray-500">/ {quality.maxScore}</span>
                  </div>
                  
                  <Progress value={(quality.score / quality.maxScore) * 100} />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Issues ({quality.issues.length})</h4>
                    {quality.issues.length === 0 ? (
                      <p className="text-sm text-gray-500">No issues found</p>
                    ) : (
                      <div className="space-y-2">
                        {quality.issues.map((issue, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant="outline"
                                className={
                                  issue.severity === 'critical' ? 'text-red-600 border-red-200' :
                                  issue.severity === 'high' ? 'text-orange-600 border-orange-200' :
                                  issue.severity === 'medium' ? 'text-yellow-600 border-yellow-200' :
                                  'text-gray-600 border-gray-200'
                                }
                              >
                                {issue.severity}
                              </Badge>
                              <span className="font-medium">{issue.type}</span>
                            </div>
                            <p className="text-gray-600 mb-1">{issue.message}</p>
                            {issue.file && (
                              <p className="text-xs text-gray-500">
                                {issue.file}{issue.line && `:${issue.line}`}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ci-cd" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                CI/CD Pipeline Status
              </CardTitle>
              <CardDescription>
                Continuous integration and deployment pipeline overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pipeline Stages */}
              <div className="space-y-4">
                {[
                  { name: 'Source', status: 'success', time: '1m 23s', icon: GitCommit },
                  { name: 'Build', status: 'success', time: '3m 45s', icon: Code },
                  { name: 'Test', status: 'success', time: '2m 18s', icon: CheckSquare },
                  { name: 'Security Scan', status: 'in-progress', time: '1m 12s', icon: Shield },
                  { name: 'Deploy Staging', status: 'pending', time: '—', icon: Upload },
                  { name: 'Integration Tests', status: 'pending', time: '—', icon: Activity },
                  { name: 'Deploy Production', status: 'pending', time: '—', icon: Rocket }
                ].map((stage, index) => (
                  <div key={stage.name} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      stage.status === 'success' ? 'bg-green-100 text-green-600' :
                      stage.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                      stage.status === 'failed' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      <stage.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-gray-500">Duration: {stage.time}</p>
                    </div>
                    
                    <Badge 
                      variant={stage.status === 'success' ? 'secondary' : 'outline'}
                      className={
                        stage.status === 'success' ? 'text-green-600 bg-green-50' :
                        stage.status === 'in-progress' ? 'text-blue-600 bg-blue-50' :
                        stage.status === 'failed' ? 'text-red-600 bg-red-50' :
                        'text-gray-600 bg-gray-50'
                      }
                    >
                      {stage.status}
                    </Badge>
                    
                    {index < 6 && (
                      <UIIcons.ArrowRight className="h-4 w-4 text-gray-300 ml-2" />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Pipeline Actions */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Run Pipeline
                </Button>
                <Button variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}