import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, Package, Code, Database, Globe, TrendingUp, TrendingDown, CheckCircle2, Play, Pause, Download, Upload, Minimize2, Maximize2, RotateCcw
  BarChart3, PieChart, Activity, Gauge, Filter, RefreshCw, ExternalLink, Copy, Eye, EyeOff, Plus, Minus, MoreVertical, Monitor, Smartphone, Tablet, Laptop, Server, HardDrive, Cpu, MemoryStick, Network, Wifi, Signal, Target, Zap } from "lucide-react";
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

interface OptimizationResult {
  id: string;
  category: string;
  type: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  savingsPercent: number;
  savingsValue: number;
  unit: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  estimatedTime: string;
  dependencies?: string[];
  recommendations: string[];
}

interface BundleAnalysis {
  id: string;
  name: string;
  size: number;
  gzipped: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: number;
  }>;
  dependencies: Array<{
    name: string;
    size: number;
    version: string;
    treeshakeable: boolean;
  }>;
  duplicates: Array<{
    name: string;
    count: number;
    totalSize: number;
  }>;
}

interface ImageOptimization {
  id: string;
  path: string;
  originalSize: number;
  optimizedSize: number;
  format: string;
  newFormat?: string;
  compressionRatio: number;
  quality: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  metadata: {
    width: number;
    height: number;
    colorDepth: number;
    hasAlpha: boolean;
  };
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  suggestions: string[];
}

const mockOptimizations: OptimizationResult[] = [
  {
    id: '1',
    category: 'Bundle',
    type: 'Tree Shaking',
    description: 'Remove unused code from vendor libraries',
    impact: 'high',
    savingsPercent: 35,
    savingsValue: 125,
    unit: 'KB',
    status: 'completed',
    estimatedTime: '2 minutes',
    recommendations: [
      'Enable tree shaking for lodash',
      'Use specific imports instead of default imports',
      'Remove unused React components'
    ]
  },
  {
    id: '2',
    category: 'Images',
    type: 'Format Conversion',
    description: 'Convert PNG images to WebP format',
    impact: 'medium',
    savingsPercent: 60,
    savingsValue: 2.4,
    unit: 'MB',
    status: 'running',
    estimatedTime: '5 minutes',
    recommendations: [
      'Convert 24 PNG files to WebP',
      'Implement responsive images',
      'Add lazy loading for below-fold images'
    ]
  },
  {
    id: '3',
    category: 'Code',
    type: 'Minification',
    description: 'Minify JavaScript and CSS files',
    impact: 'medium',
    savingsPercent: 25,
    savingsValue: 85,
    unit: 'KB',
    status: 'completed',
    estimatedTime: '1 minute',
    recommendations: [
      'Enable advanced minification',
      'Remove comments and whitespace',
      'Optimize variable names'
    ]
  },
  {
    id: '4',
    category: 'Caching',
    type: 'Browser Caching',
    description: 'Optimize cache headers for static assets',
    impact: 'high',
    savingsPercent: 80,
    savingsValue: 3.2,
    unit: 'seconds',
    status: 'pending',
    estimatedTime: '3 minutes',
    recommendations: [
      'Set long cache times for immutable assets',
      'Implement cache busting for dynamic content',
      'Configure service worker caching'
    ]
  },
  {
    id: '5',
    category: 'Database',
    type: 'Query Optimization',
    description: 'Optimize slow database queries',
    impact: 'critical',
    savingsPercent: 70,
    savingsValue: 1.5,
    unit: 'seconds',
    status: 'pending',
    estimatedTime: '15 minutes',
    dependencies: ['1', '3'],
    recommendations: [
      'Add indexes for frequently queried columns',
      'Optimize N+1 query patterns',
      'Implement query result caching'
    ]
  }
];

const mockBundleAnalysis: BundleAnalysis = {
  id: '1',
  name: 'main',
  size: 485000,
  gzipped: 142000,
  chunks: [
    { name: 'vendor', size: 285000, modules: 45 },
    { name: 'main', size: 125000, modules: 23 },
    { name: 'polyfills', size: 75000, modules: 8 }
  ],
  dependencies: [
    { name: 'react', size: 45000, version: '18.2.0', treeshakeable: false },
    { name: 'lodash', size: 72000, version: '4.17.21', treeshakeable: true },
    { name: 'moment', size: 67000, version: '2.29.4', treeshakeable: false },
    { name: 'chart.js', size: 54000, version: '4.2.1', treeshakeable: true }
  ],
  duplicates: [
    { name: 'react', count: 2, totalSize: 90000 },
    { name: 'lodash/debounce', count: 3, totalSize: 15000 }
  ]
};

const mockImageOptimizations: ImageOptimization[] = [
  {
    id: '1',
    path: '/images/hero-banner.png',
    originalSize: 1250000,
    optimizedSize: 420000,
    format: 'PNG',
    newFormat: 'WebP',
    compressionRatio: 66,
    quality: 85,
    status: 'completed',
    metadata: { width: 1920, height: 1080, colorDepth: 24, hasAlpha: false }
  },
  {
    id: '2',
    path: '/images/product-gallery-1.jpg',
    originalSize: 875000,
    optimizedSize: 285000,
    format: 'JPEG',
    newFormat: 'WebP',
    compressionRatio: 67,
    quality: 80,
    status: 'processing',
    metadata: { width: 1200, height: 800, colorDepth: 24, hasAlpha: false }
  },
  {
    id: '3',
    path: '/images/avatar-default.png',
    originalSize: 45000,
    optimizedSize: 12000,
    format: 'PNG',
    compressionRatio: 73,
    quality: 90,
    status: 'completed',
    metadata: { width: 256, height: 256, colorDepth: 32, hasAlpha: true }
  }
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: '1',
    name: 'First Contentful Paint',
    value: 1.2,
    target: 1.8,
    unit: 'seconds',
    category: 'Loading',
    status: 'good',
    trend: 'improving',
    suggestions: [
      'Preload critical fonts',
      'Optimize above-fold CSS',
      'Use resource hints'
    ]
  },
  {
    id: '2',
    name: 'Largest Contentful Paint',
    value: 2.1,
    target: 2.5,
    unit: 'seconds',
    category: 'Loading',
    status: 'good',
    trend: 'stable',
    suggestions: [
      'Optimize largest image',
      'Remove render-blocking resources',
      'Implement lazy loading'
    ]
  },
  {
    id: '3',
    name: 'Time to Interactive',
    value: 3.8,
    target: 3.8,
    unit: 'seconds',
    category: 'Interactivity',
    status: 'warning',
    trend: 'declining',
    suggestions: [
      'Reduce JavaScript execution time',
      'Split large bundles',
      'Defer non-critical scripts'
    ]
  },
  {
    id: '4',
    name: 'Cumulative Layout Shift',
    value: 0.08,
    target: 0.1,
    unit: 'score',
    category: 'Visual Stability',
    status: 'good',
    trend: 'improving',
    suggestions: [
      'Reserve space for images',
      'Use CSS aspect-ratio',
      'Avoid dynamically injected content'
    ]
  }
];

export function OptimizationTools() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [runningOptimizations, setRunningOptimizations] = useState<string[]>([]);
  const [optimizations, setOptimizations] = useState(mockOptimizations);
  const [bundleAnalysis, setBundleAnalysis] = useState(mockBundleAnalysis);
  const [imageOptimizations, setImageOptimizations] = useState(mockImageOptimizations);
  const [performanceMetrics, setPerformanceMetrics] = useState(mockPerformanceMetrics);

  // Calculate overall savings
  const totalSavingsKB = optimizations
    .filter(opt => opt.status === 'completed' && opt.unit === 'KB')
    .reduce((sum, opt) => sum + opt.savingsValue, 0);
  
  const totalSavingsMB = optimizations
    .filter(opt => opt.status === 'completed' && opt.unit === 'MB')
    .reduce((sum, opt) => sum + opt.savingsValue, 0);

  const overallPerformanceScore = Math.round(
    performanceMetrics.reduce((sum, metric) => {
      const score = metric.value <= metric.target ? 100 : (metric.target / metric.value) * 100;
      return sum + score;
    }, 0) / performanceMetrics.length
  );

  // Filter optimizations
  const filteredOptimizations = optimizations.filter(opt => {
    const matchesCategory = selectedCategory === 'all' || opt.category.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || opt.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      opt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const runOptimization = (id: string) => {
    setRunningOptimizations(prev => [...prev, id]);
    setOptimizations(prev => prev.map(opt => 
      opt.id === id ? { ...opt, status: 'running' } : opt
    ));

    // Simulate optimization completion
    setTimeout(() => {
      setOptimizations(prev => prev.map(opt => 
        opt.id === id ? { ...opt, status: 'completed' } : opt
      ));
      setRunningOptimizations(prev => prev.filter(optId => optId !== id));
    }, 3000);
  };

  const runAllOptimizations = () => {
    const pendingOptimizations = optimizations.filter(opt => opt.status === 'pending');
    pendingOptimizations.forEach(opt => runOptimization(opt.id));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'running':
        return <OptimizedIcon name="Clock" className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <UIIcons.AlertTriangle className="h-4 w-4 text-red-500" / />;
      default:
        return <OptimizedIcon name="Clock" className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Optimization Tools</h1>
          <p className="text-gray-600 mt-1">Analyze and optimize application performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button
            onClick={runAllOptimizations}
            className="flex items-center gap-2"
            disabled={runningOptimizations.length > 0}
          >
            <Zap className="h-4 w-4" />
            Run All Optimizations
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Performance Score</p>
                <p className="text-2xl font-bold text-gray-900">{overallPerformanceScore}/100</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Gauge className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={overallPerformanceScore} className="mt-3" />
            <p className="text-xs text-gray-500 mt-2">Based on Core Web Vitals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bundle Size</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(bundleAnalysis.size)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                Gzipped: {formatFileSize(bundleAnalysis.gzipped)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">JavaScript bundle size</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Size Saved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSavingsKB > 0 && `${totalSavingsKB}KB`}
                  {totalSavingsMB > 0 && ` ${totalSavingsMB}MB`}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                <TrendingDown className="h-3 w-3 mr-1" />
                Reduced
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total size reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Optimizations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {optimizations.filter(o => o.status === 'completed').length}/{optimizations.length}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <Progress 
              value={(optimizations.filter(o => o.status === 'completed').length / optimizations.length) * 100} 
              className="mt-3" 
            />
            <p className="text-xs text-gray-500 mt-2">Completed optimizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
          <TabsTrigger value="bundle">Bundle Analysis</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Core Web Vitals and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <Badge 
                        variant="outline"
                        className={
                          metric.status === 'good' ? 'text-green-600 border-green-200' :
                          metric.status === 'warning' ? 'text-yellow-600 border-yellow-200' :
                          'text-red-600 border-red-200'
                        }
                      >
                        {metric.value} {metric.unit}
                      </Badge>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.target) * 100, 100)}
                      className={metric.status === 'good' ? '' : 'bg-yellow-100'}
                    />
                    <p className="text-xs text-gray-500">
                      Target: {metric.target} {metric.unit}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Optimization Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Optimization Summary
                </CardTitle>
                <CardDescription>
                  Available performance improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Bundle', 'Images', 'Code', 'Caching', 'Database'].map((category) => {
                    const categoryOpts = optimizations.filter(opt => opt.category === category);
                    const completed = categoryOpts.filter(opt => opt.status === 'completed').length;
                    const total = categoryOpts.length;
                    const progress = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category}</span>
                          <span className="text-xs text-gray-500">{completed}/{total}</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Optimizations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <OptimizedIcon name="Clock" className="h-5 w-5" />
                Recent Optimizations
              </CardTitle>
              <CardDescription>
                Latest completed performance improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations
                  .filter(opt => opt.status === 'completed')
                  .slice(0, 5)
                  .map((optimization) => (
                    <div key={optimization.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{optimization.type}</h4>
                        <p className="text-sm text-gray-600">{optimization.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          -{optimization.savingsPercent}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {optimization.savingsValue} {optimization.unit} saved
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="search">Search:</Label>
                  <Input
                    id="search"
                    placeholder="Search optimizations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="category">Category:</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                      <SelectItem value="images">Images</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="caching">Caching</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="status">Status:</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization List */}
          <div className="space-y-4">
            {filteredOptimizations.map((optimization) => (
              <motion.div
                key={optimization.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(optimization.status)}
                      <h3 className="font-semibold text-gray-900">{optimization.type}</h3>
                      <Badge className={getImpactColor(optimization.impact)}>
                        {optimization.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {optimization.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{optimization.description}</p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Savings: {optimization.savingsPercent}%</span>
                      <span>Value: {optimization.savingsValue} {optimization.unit}</span>
                      <span>Est. Time: {optimization.estimatedTime}</span>
                    </div>
                    
                    {optimization.dependencies && optimization.dependencies.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Dependencies:</p>
                        <div className="flex gap-1">
                          {optimization.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              #{dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Recommendations:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {optimization.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {optimization.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => runOptimization(optimization.id)}
                        disabled={runningOptimizations.includes(optimization.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                    )}
                    {optimization.status === 'running' && (
                      <Button size="sm" variant="outline" disabled>
                        <OptimizedIcon name="Clock" className="h-4 w-4 mr-2 animate-spin" />
                        Running
                      </Button>
                    )}
                    {optimization.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    )}
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
                          <NavigationIcons.Settings className="h-4 w-4 mr-2" / />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Revert
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bundle" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bundle Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Bundle Analysis
                </CardTitle>
                <CardDescription>
                  JavaScript bundle composition and size
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Size</span>
                    <span>{formatFileSize(bundleAnalysis.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gzipped</span>
                    <span>{formatFileSize(bundleAnalysis.gzipped)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Compression Ratio</span>
                    <span>{Math.round((1 - bundleAnalysis.gzipped / bundleAnalysis.size) * 100)}%</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Chunks</h4>
                  {bundleAnalysis.chunks.map((chunk) => (
                    <div key={chunk.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{chunk.name}</span>
                        <span>{formatFileSize(chunk.size)}</span>
                      </div>
                      <Progress value={(chunk.size / bundleAnalysis.size) * 100} />
                      <p className="text-xs text-gray-500">{chunk.modules} modules</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dependencies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Dependencies
                </CardTitle>
                <CardDescription>
                  Third-party library analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bundleAnalysis.dependencies.map((dep) => (
                    <div key={dep.name} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{dep.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            v{dep.version}
                          </Badge>
                          {dep.treeshakeable && (
                            <Badge variant="secondary" className="text-xs text-green-600 bg-green-50">
                              Tree-shakeable
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{formatFileSize(dep.size)}</span>
                        <span className="text-gray-500">
                          {Math.round((dep.size / bundleAnalysis.size) * 100)}% of bundle
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Duplicates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UIIcons.AlertTriangle className="h-5 w-5" / />
                Duplicate Dependencies
              </CardTitle>
              <CardDescription>
                Modules included multiple times in the bundle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bundleAnalysis.duplicates.map((duplicate) => (
                  <div key={duplicate.name} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-yellow-800">{duplicate.name}</h4>
                        <p className="text-sm text-yellow-600">
                          Included {duplicate.count} times
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-yellow-800">
                          {formatFileSize(duplicate.totalSize)}
                        </p>
                        <p className="text-xs text-yellow-600">Total waste</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <div className="space-y-4">
            {imageOptimizations.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Image className="h-5 w-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">{image.path}</h3>
                        <Badge 
                          variant={image.status === 'completed' ? 'secondary' : 'outline'}
                          className={
                            image.status === 'completed' ? 'text-green-600 bg-green-50' :
                            image.status === 'processing' ? 'text-blue-600 bg-blue-50' :
                            image.status === 'error' ? 'text-red-600 bg-red-50' :
                            'text-gray-600 bg-gray-50'
                          }
                        >
                          {image.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Original Size</p>
                          <p className="font-medium">{formatFileSize(image.originalSize)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Optimized Size</p>
                          <p className="font-medium">{formatFileSize(image.optimizedSize)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Compression</p>
                          <p className="font-medium text-green-600">-{image.compressionRatio}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Format</p>
                          <p className="font-medium">
                            {image.format}
                            {image.newFormat && ` → ${image.newFormat}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Dimensions</p>
                          <p className="font-medium">{image.metadata.width} × {image.metadata.height}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Color Depth</p>
                          <p className="font-medium">{image.metadata.colorDepth}-bit</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Alpha Channel</p>
                          <p className="font-medium">{image.metadata.hasAlpha ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Quality</p>
                          <p className="font-medium">{image.quality}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {image.status === 'processing' && (
                        <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <NavigationIcons.Settings className="h-4 w-4 mr-2" / />
                            Adjust Quality
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{metric.name}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={
                        metric.status === 'good' ? 'text-green-600 border-green-200' :
                        metric.status === 'warning' ? 'text-yellow-600 border-yellow-200' :
                        'text-red-600 border-red-200'
                      }
                    >
                      {metric.status}
                    </Badge>
                  </div>
                  <CardDescription>{metric.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                    <span className="text-xs text-gray-400">
                      Target: {metric.target} {metric.unit}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>vs Target</span>
                      <span className={metric.value <= metric.target ? 'text-green-600' : 'text-red-600'}>
                        {metric.value <= metric.target ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((metric.value / metric.target) * 100, 100)}
                      className={metric.value <= metric.target ? '' : 'bg-red-100'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Suggestions</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {metric.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}