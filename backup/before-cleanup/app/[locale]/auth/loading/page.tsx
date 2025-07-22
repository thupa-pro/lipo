"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthLoadingPage() {
  const router = useRouter();
  const { user, isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Still loading

    if (isSignedIn && user) {
      // Route based on user role
      switch (user.role) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "PROVIDER":
          router.push("/provider/dashboard");
          break;
        case "CUSTOMER":
          router.push("/customer/dashboard");
          break;
        default:
          router.push("/dashboard");
          break;
      }
    } else {
      // Not authenticated, redirect to landing
      router.push("/landing");
    }
  }, [user, isLoading, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
            Loconomy
          </h1>
        </div>

        <div className="space-y-6 animate-fade-in-delay">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 rounded-full mx-auto">
              <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium animate-fade-in-delay">
              Loading your experience...
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              AI-powered local services at your fingertips
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}