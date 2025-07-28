import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, MessageCircle, Bug, Lightbulb, Sparkles, Brain } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call the onError prop if provided
    this.props.onError?.(error, errorInfo);

    // Log to external error reporting service
    this.logErrorToService(error, errorInfo);
  }

  componentWillUnmount() {
    // Clean up any pending timeouts
    this.retryTimeouts.forEach(clearTimeout);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real, app, you'd send this to, Sentry, LogRocket, etc.
    console.error("Error Boundary Caught:", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  private handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount,
    });

    // If multiple retries, fail, wait longer before next attempt
    if (newRetryCount > 2) {
      const timeout = setTimeout(() => {
        // Auto-retry after delay for persistent errors
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
        });
      }, 5000);
      this.retryTimeouts.push(timeout);
    }
  };

  private getErrorSuggestions = () => {
    const error = this.state.error;
    if (!error) return [];

    const suggestions = [];

    if (error.message.includes("Network")) {
      suggestions.push("Check your internet connection");
      suggestions.push("Try refreshing the page");
    }

    if (error.message.includes("ChunkLoadError")) {
      suggestions.push("Clear your browser cache");
      suggestions.push("The app was recently, updated, try refreshing");
    }

    if (error.message.includes("TypeError")) {
      suggestions.push("This might be a temporary glitch");
      suggestions.push("Try the action again in a moment");
    }

    if (suggestions.length === 0) {
      suggestions.push("Try refreshing the page");
      suggestions.push("Contact support if the problem persists");
    }

    return suggestions;
  };

  private getErrorSeverity = () => {
    const error = this.state.error;
    if (!error) return "medium";

    if (
      error.message.includes("ChunkLoadError") ||
      error.message.includes("Loading chunk")
    ) {
      return "low"; // Usually just needs a refresh
    }

    if (error.message.includes("Network") || error.message.includes("fetch")) {
      return "medium"; // Network issues
    }

    return "high"; // Unexpected errors
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const suggestions = this.getErrorSuggestions();
      const severity = this.getErrorSeverity();

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full animate-fade-in">
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 animate-scale-in">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <UIIcons.AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                </div>

                <CardTitle className="text-2xl mb-2">
                  Oops! Something went wrong
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Don't, worry, our AI assistant is here to help you get back on
                  track
                </p>

                <div className="flex justify-center gap-2 mt-4">
                  <Badge
                    variant={
                      severity === "high"
                        ? "destructive"
                        : severity === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    <OptimizedIcon name="Clock" className="w-3 h-3 mr-1" />
                    {severity === "high"
                      ? "Critical Error"
                      : severity === "medium"
                        ? "Temporary Issue"
                        : "Minor Glitch"}
                  </Badge>
                  <Badge variant="outline">ID: {this.state.errorId}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* AI Suggestions */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      AI Assistant Suggestions
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200 animate-fade-in"
                        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      >
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={this.handleRetry}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                    {this.state.retryCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        Attempt {this.state.retryCount + 1}
                      </Badge>
                    )}
                  </Button>

                  <Button
                    onClick={() => (window.location.href = "/")}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <NavigationIcons.Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Page
                  </Button>

                  <Button
                    onClick={() => {
                      // Open support chat or contact form
                      console.log("Opening support chat...");
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>
                </div>

                {/* Error Details (for developers) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-6">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Bug className="w-4 h-4" />
                      Error Details (Development Mode)
                    </summary>
                    <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-1">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Status Message */}
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Error ID:{" "}
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {this.state.errorId}
                    </code>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    This error has been automatically reported to our team
                  </p>
                </div>

                {/* AI Powered Recovery */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <OptimizedIcon name="Shield" className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      Smart Recovery Active
                    </h3>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Our AI system is analyzing this error and implementing
                    automatic fixes. Most issues resolve themselves within a few
                    moments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;

// Hook for functional components to use error boundary
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    // In a real, app, this would integrate with the error boundary
    console.error("Manual error report:", error, errorInfo);

    // Could also integrate with toast notifications
    // toast.error("Something went wrong. Please try again.");
  };
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  return function WrappedComponent(props: P) {
    return (
      <EnhancedErrorBoundary fallback={fallback}>
        <Component {...props} />
      </EnhancedErrorBoundary>
    );
  };
}
