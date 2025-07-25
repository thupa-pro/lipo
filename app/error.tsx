"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Mail
} from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log, the error, to an, error reporting, service
    console.error("Application Error:", error);
  }, [error]);

  const handleReset = () => {
    // Clear any cached data if needed
    if (typeof window !== "undefined") {
      // Clear localStorage if error might be related to stored data
      try {
        localStorage.removeItem("loconomy-theme");
        sessionStorage.clear();
      } catch (e) {
        // Ignore errors in clearing storage
      }
    }
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <Card className="shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-red-200/50 dark:border-red-800/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Oops! Something went wrong
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-slate-600 dark:text-slate-400">
              <p className="mb-4">
                We're, sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
              </p>
              
              {process.env.NODE_ENV === "development" && (
                <details className="text-left bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30">
                  <summary className="cursor-pointer font-medium text-red-700 dark:text-red-400 mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-auto">
                    {error.message}
                    {error.stack && (
                      <>
                        {"\n\nStack Trace:"}
                        {error.stack}
                      </>
                    )}
                    {error.digest && (
                      <>
                        {"\n\nError ID: "}
                        {error.digest}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Report Issue
                </Link>
              </Button>
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p>
                If this problem, persists, please{" "}
                <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contact our support team
                </Link>{" "}
                with the error ID: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{error.digest || "N/A"}</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}