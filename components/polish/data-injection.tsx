"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database,
  Upload,
  AlertCircle,
  RefreshCw,
  FileText,
  Users,
  Activity,
  CheckCircle
} from "lucide-react";

interface DataInjectionProps {
  className?: string;
}

export default function DataInjection({ className }: DataInjectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [stats, setStats] = useState({
    totalRecords: 0,
    processedRecords: 0,
    successCount: 0,
    errorCount: 0,
  });

  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'provider' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'provider' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'customer' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'provider' },
  ];

  const simulateDataInjection = async () => {
    setIsLoading(true);
    setStatus('running');
    setProgress(0);
    setStats({
      totalRecords: mockData.length,
      processedRecords: 0,
      successCount: 0,
      errorCount: 0,
    });

    for (let i = 0; i < mockData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProgress = ((i + 1) / mockData.length) * 100;
      setProgress(newProgress);
      
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      setStats(prev => ({
        ...prev,
        processedRecords: i + 1,
        successCount: prev.successCount + (isSuccess ? 1 : 0),
        errorCount: prev.errorCount + (isSuccess ? 0 : 1),
      }));
    }

    setStatus('completed');
    setIsLoading(false);
  };

  const resetData = () => {
    setStatus('idle');
    setProgress(0);
    setStats({
      totalRecords: 0,
      processedRecords: 0,
      successCount: 0,
      errorCount: 0,
    });
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Injection System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalRecords}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.successCount}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.errorCount}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.processedRecords}</div>
              <div className="text-sm text-muted-foreground">Processed</div>
            </div>
          </div>

          {/* Progress Bar */}
          {status === 'running' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing data...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Status Messages */}
          {status === 'completed' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Data injection completed successfully! {stats.successCount} records processed.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                An error occurred during data injection. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={simulateDataInjection}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isLoading ? 'Processing...' : 'Inject Test Data'}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetData}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>

          {/* Sample Data Preview */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Sample Data Preview
            </h4>
            <div className="bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <pre className="text-xs">
                {JSON.stringify(mockData.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
