import { Metadata } from "next";
import EnhancedDashboard from "@/components/dashboard/EnhancedDashboard";

export const metadata: Metadata = {
  title: "Elite Dashboard - Loconomy",
  description: "Comprehensive dashboard with real-time analytics, mobile components, and premium features",
  keywords: "dashboard, analytics, mobile app, real-time, business intelligence",
};

export default function EnhancedDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-float-delayed"></div>
      <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-float-slow"></div>

      <div className="relative">
        <EnhancedDashboard />
      </div>
    </div>
  );
}
