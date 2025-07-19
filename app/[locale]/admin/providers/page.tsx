import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  UserCheck,
  Shield,
  ArrowUpRight,
  Star,
  Award,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Provider Management - Admin Dashboard",
  description: "Manage service providers and their verification status",
};

export default function AdminProvidersPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Animated Background - Same as Homepage */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(139,92,246,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-violet-400 rounded-full animate-pulse opacity-30 dark:opacity-40" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-emerald-400 dark:bg-blue-400 rounded-full animate-ping opacity-20 dark:opacity-30" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-purple-400 dark:bg-emerald-400 rounded-full animate-bounce opacity-15 dark:opacity-20" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-cyan-400 dark:bg-pink-400 rounded-full animate-pulse opacity-20 dark:opacity-30" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-cyan-400 rounded-full animate-ping opacity-15 dark:opacity-25" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-8">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Admin Panel • Provider Management
            </span>
            <UserCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              Provider
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Management
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Review and manage service providers with
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              verification tools{" "}
            </span>
            and quality monitoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl px-8 py-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25"
              asChild
            >
              <Link href="/admin">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </section>

        {/* Coming Soon Message */}
        <section className="text-center">
          <Card className="bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-8">
                <UserCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-xl text-slate-600 dark:text-gray-300 mb-8">
                Advanced provider management features are under development.
                You'll soon be able to review applications, manage
                verifications, and monitor service quality.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Background Checks
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Identity Verification
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-emerald-500" />
                  Quality Monitoring
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Performance Analytics
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
