import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Palette,
  Globe,
  Lock,
  ArrowUpRight,
  Save,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "System Settings - Admin Dashboard",
  description: "Configure system settings and preferences",
};

export default function AdminSettingsPage() {
  const settingsCategories = [
    {
      title: "Security Settings",
      description:
        "Manage authentication, access control, and security policies",
      icon: Shield,
      color: "from-emerald-500 to-teal-600",
      items: [
        "Two-Factor Authentication",
        "Password Policies",
        "API Keys",
        "Access Logs",
      ],
    },
    {
      title: "Notification Settings",
      description:
        "Configure system alerts, email notifications, and messaging",
      icon: Bell,
      color: "from-blue-500 to-cyan-600",
      items: [
        "Email Alerts",
        "SMS Notifications",
        "Push Notifications",
        "Admin Alerts",
      ],
    },
    {
      title: "Database Configuration",
      description: "Database connections, backups, and performance settings",
      icon: Database,
      color: "from-purple-500 to-violet-600",
      items: [
        "Connection Settings",
        "Backup Schedule",
        "Performance Tuning",
        "Monitoring",
      ],
    },
    {
      title: "Theme & Appearance",
      description: "Customize the platform's visual appearance and branding",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      items: ["Brand Colors", "Logo Settings", "Typography", "Custom CSS"],
    },
    {
      title: "Localization",
      description: "Language settings, regional preferences, and currency",
      icon: Globe,
      color: "from-indigo-500 to-blue-600",
      items: [
        "Supported Languages",
        "Currency Settings",
        "Date Formats",
        "Time Zones",
      ],
    },
    {
      title: "Privacy & Compliance",
      description: "GDPR, data retention, and privacy policy configurations",
      icon: Lock,
      color: "from-teal-500 to-cyan-600",
      items: [
        "Data Retention",
        "Privacy Controls",
        "Cookie Policies",
        "Compliance Reports",
      ],
    },
  ];

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
              Admin Panel • System Settings
            </span>
            <Settings className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-none">
            <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
              System
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Settings
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Configure platform settings and preferences with
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
              {" "}
              advanced controls{" "}
            </span>
            and security options.
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
            <Button
              variant="outline"
              className="rounded-2xl px-8 py-3 font-semibold border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </section>

        {/* Settings Categories */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {settingsCategories.map((category, index) => (
              <Card
                key={index}
                className="relative bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl p-8 group hover:bg-blue-50/50 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                />
                <CardContent className="p-0 relative z-10">
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    {category.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-6">
                    {category.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400"
                      >
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-blue-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all duration-300"
                  >
                    Configure
                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
