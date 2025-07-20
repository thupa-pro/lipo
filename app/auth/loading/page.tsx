"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle, Loader2 } from "lucide-react";

export default function LoadingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Authenticating user...",
    "Loading your profile...",
    "Preparing your dashboard...",
    "Almost ready...",
  ];

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Simulate loading steps
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Redirect based on role after loading
          setTimeout(() => {
            switch (session.user.role) {
              case "CUSTOMER":
                router.push("/customer/dashboard");
                break;
              case "PROVIDER":
                router.push("/provider/dashboard");
                break;
              case "ADMIN":
                router.push("/admin/dashboard");
                break;
              case "SUPER_ADMIN":
                router.push("/admin/dashboard");
                break;
              default:
                router.push("/customer/dashboard");
            }
          }, 1000);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-white animate-spin" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            ServiceHub
          </h1>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Welcome back{session?.user.name ? `, ${session.user.name}` : ""}!
          </h2>
          <p className="text-slate-600 dark:text-gray-400">
            Setting up your personalized experience...
          </p>
        </div>

        {/* Loading Steps */}
        <div className="max-w-md mx-auto space-y-4">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                index <= loadingStep
                  ? "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 text-slate-800 dark:text-white"
                  : "text-slate-400 dark:text-gray-600"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {index < loadingStep ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : index === loadingStep ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-gray-600" />
                )}
              </div>
              <span className="text-sm font-medium">{step}</span>
            </div>
          ))}
        </div>

        {/* Role Badge */}
        {session?.user.role && (
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-gray-300">
                {session.user.role === "CUSTOMER" && "Customer Dashboard"}
                {session.user.role === "PROVIDER" && "Provider Dashboard"}
                {session.user.role === "ADMIN" && "Admin Dashboard"}
                {session.user.role === "SUPER_ADMIN" && "Super Admin Dashboard"}
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8 max-w-xs mx-auto">
          <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
            {Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}% Complete
          </p>
        </div>
      </div>
    </div>
  );
}