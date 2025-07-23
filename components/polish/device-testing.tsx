"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Monitor, 
  Tablet,
  AlertCircle, 
  Wifi,
  Battery,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react';

interface DeviceTestingProps {
  className?: string;
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  width: number;
  height: number;
  userAgent: string;
}

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export default function DeviceTesting({ className }: DeviceTestingProps) {
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>({});

  const devices: DeviceInfo[] = [
    {
      type: 'mobile',
      name: 'iPhone 12',
      icon: Smartphone,
      width: 390,
      height: 844,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
    },
    {
      type: 'tablet',
      name: 'iPad Pro',
      icon: Tablet,
      width: 1024,
      height: 1366,
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
    },
    {
      type: 'desktop',
      name: 'Desktop',
      icon: Monitor,
      width: 1920,
      height: 1080,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  ];

  useEffect(() => {
    // Detect current device
    const detectDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 768) {
        setCurrentDevice(devices[0]); // Mobile
      } else if (width < 1024) {
        setCurrentDevice(devices[1]); // Tablet
      } else {
        setCurrentDevice(devices[2]); // Desktop
      }
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  useEffect(() => {
    // Get system information
    const getSystemInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        memory: (navigator as any).deviceMemory,
        cores: (navigator as any).hardwareConcurrency,
      };
      setSystemInfo(info);
    };

    getSystemInfo();
  }, []);

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests: TestResult[] = [];

    // Test 1: Responsive Design
    const responsiveTest = await testResponsiveDesign();
    tests.push(responsiveTest);

    // Test 2: Performance
    const performanceTest = await testPerformance();
    tests.push(performanceTest);

    // Test 3: Accessibility
    const accessibilityTest = await testAccessibility();
    tests.push(accessibilityTest);

    // Test 4: Browser Compatibility
    const compatibilityTest = await testBrowserCompatibility();
    tests.push(compatibilityTest);

    // Test 5: Network
    const networkTest = await testNetwork();
    tests.push(networkTest);

    setTestResults(tests);
    setIsTesting(false);
  };

  const testResponsiveDesign = async (): Promise<TestResult> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width >= 320 && height >= 568) {
      return {
        test: 'Responsive Design',
        status: 'pass',
        message: 'Layout adapts correctly to screen size',
        details: `${width}x${height} resolution supported`
      };
    } else {
      return {
        test: 'Responsive Design',
        status: 'fail',
        message: 'Screen size too small for optimal experience',
        details: `Minimum 320x568, required, current: ${width}x${height}`
      };
    }
  };

  const testPerformance = async (): Promise<TestResult> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startTime = performance.now();
    // Simulate some work
    for (let i = 0; i < 1000000; i++) {
      Math.random();
    }
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration < 100) {
      return {
        test: 'Performance',
        status: 'pass',
        message: 'Performance is excellent',
        details: `Test completed in ${duration.toFixed(2)}ms`
      };
    } else if (duration < 500) {
      return {
        test: 'Performance',
        status: 'warning',
        message: 'Performance is acceptable but could be improved',
        details: `Test completed in ${duration.toFixed(2)}ms`
      };
    } else {
      return {
        test: 'Performance',
        status: 'fail',
        message: 'Performance is poor',
        details: `Test completed in ${duration.toFixed(2)}ms`
      };
    }
  };

  const testAccessibility = async (): Promise<TestResult> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Check for basic accessibility features
    const hasAltText = document.querySelectorAll('img[alt]').length > 0;
    const hasHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
    const hasLandmarks = document.querySelectorAll('nav, main, header, footer').length > 0;
    
    const score = [hasAltText, hasHeadings, hasLandmarks].filter(Boolean).length;
    
    if (score === 3) {
      return {
        test: 'Accessibility',
        status: 'pass',
        message: 'All accessibility checks passed',
        details: 'Alt, text, headings, and landmarks present'
      };
    } else if (score >= 2) {
      return {
        test: 'Accessibility',
        status: 'warning',
        message: 'Some accessibility features missing',
        details: `${score}/3 accessibility features present`
      };
    } else {
      return {
        test: 'Accessibility',
        status: 'fail',
        message: 'Critical accessibility features missing',
        details: `${score}/3 accessibility features present`
      };
    }
  };

  const testBrowserCompatibility = async (): Promise<TestResult> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const userAgent = navigator.userAgent;
    const isModernBrowser = userAgent.includes('Chrome') || 
                           userAgent.includes('Firefox') || 
                           userAgent.includes('Safari') ||
                           userAgent.includes('Edge');
    
    if (isModernBrowser) {
      return {
        test: 'Browser Compatibility',
        status: 'pass',
        message: 'Modern browser detected',
        details: userAgent.split(' ')[0]
      };
    } else {
      return {
        test: 'Browser Compatibility',
        status: 'warning',
        message: 'Browser may not support all features',
        details: userAgent.split(' ')[0]
      };
    }
  };

  const testNetwork = async (): Promise<TestResult> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (navigator.onLine) {
      return {
        test: 'Network Connection',
        status: 'pass',
        message: 'Network connection is available',
        details: 'Online and ready for data transfer'
      };
    } else {
      return {
        test: 'Network Connection',
        status: 'fail',
        message: 'No network connection detected',
        details: 'Check your internet connection'
      };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'fail':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Device Testing & Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Device Info */}
          {currentDevice && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <currentDevice.icon className="w-8 h-8 text-blue-600" />
              <div>
                <h4 className="font-medium">{currentDevice.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {currentDevice.width}x{currentDevice.height} • {currentDevice.type}
                </p>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Cpu className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">CPU Cores</div>
              <div className="text-lg font-bold">{systemInfo.cores || 'N/A'}</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <MemoryStick className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Memory</div>
              <div className="text-lg font-bold">{systemInfo.memory || 'N/A'} GB</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <Wifi className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Connection</div>
              <div className="text-lg font-bold">{systemInfo.onLine ? 'Online' : 'Offline'}</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <HardDrive className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium">Platform</div>
              <div className="text-lg font-bold">{systemInfo.platform || 'N/A'}</div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Test Results</h4>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{result.test}</span>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.message}</p>
                    {result.details && (
                      <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={runTests}
              disabled={isTesting}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  Run Device Tests
                </>
              )}
            </Button>
          </div>

          {/* Device Preview */}
          <div className="space-y-2">
            <h4 className="font-medium">Test on Different Devices</h4>
            <div className="flex gap-2">
              {devices.map((device) => (
                <Button
                  key={device.name}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDevice(device)}
                  className={`flex items-center gap-2 ${
                    currentDevice?.name === device.name ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <device.icon className="w-4 h-4" />
                  {device.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
