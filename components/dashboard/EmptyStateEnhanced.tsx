import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Heart, Award, Gift, Zap, TrendingUp, Crown, Target, Bot, Lightbulb, Link } from "lucide-react";
importfrom "next/link";
import { motion } from "framer-motion";
import { COPY } from "@/lib/content/copy";

interface EmptyStateProps {
  type: "bookings" | "providers" | "payments" | "messages" | "search" | "notifications";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
  userType?: "customer" | "provider";
  context?: any;
}

const getEmptyStateConfig = (type: string, userType: "customer" | "provider" = "customer") => {
  const configs = {
    bookings: {
      icon: Calendar,
      gradient: "from-blue-500 to-purple-600",
      title: COPY.emptyStates.bookings.title,
      description: COPY.emptyStates.bookings.description,
      actionText: COPY.emptyStates.bookings.action,
      actionHref: "/browse",
      benefits: COPY.emptyStates.bookings.benefits,
      stats: [
        { value: "2.1M+", label: "Happy customers", icon: Users },
        { value: "98%", label: "Satisfaction rate", icon: Star },
        { value: "24/7", label: "Elite support", icon: Shield },
      ],
      aiSuggestion: "💡 I can help you find the perfect service. Try asking me 'Find me a house cleaner' or 'I need a plumber'"
    },
    
    providers: userType === "customer" ? {
      icon: Users,
      gradient: "from-emerald-500 to-blue-600",
      title: "Discover Elite Providers",
      description: "Connect with verified professionals in your neighborhood",
      actionText: "Browse Elite Network",
      actionHref: "/browse",
      benefits: [
        "🛡️ 100% background checked",
        "⭐ 5-star rated professionals",
        "🚀 90-second response time",
        "🎯 AI-matched to your needs"
      ],
      stats: [
        { value: "50K+", label: "Elite providers", icon: Crown },
        { value: "500+", label: "Service types", icon: Sparkles },
        { value: "90s", label: "Avg response", icon: Zap },
      ],
      aiSuggestion: "🔍 Looking for specific skills? I can search by specialty, location, or availability"
    } : {
      icon: Crown,
      gradient: "from-purple-500 to-pink-600",
      title: COPY.emptyStates.providers.title,
      description: COPY.emptyStates.providers.description,
      actionText: COPY.emptyStates.providers.action,
      actionHref: "/become-provider",
      benefits: COPY.emptyStates.providers.benefits,
      stats: [
        { value: "3x", label: "Higher earnings", icon: TrendingUp },
        { value: "90%", label: "Provider retention", icon: Heart },
        { value: "<5min", label: "Support response", icon: Phone },
      ],
      aiSuggestion: "🚀 Ready to start earning? I can guide you through the elite provider setup process"
    },

    messages: {
      icon: MessageSquare,
      gradient: "from-cyan-500 to-blue-600",
      title: COPY.emptyStates.messages.title,
      description: COPY.emptyStates.messages.description,
      actionText: COPY.emptyStates.messages.action,
      actionHref: "/browse",
      benefits: [
        "💬 Real-time messaging",
        "🔒 Secure communication",
        "📱 Mobile notifications",
        "🤝 Direct provider contact"
      ],
      stats: [
        { value: "1.2M", label: "Messages daily", icon: MessageSquare },
        { value: "30s", label: "Avg response", icon: Clock },
        { value: "99%", label: "Delivery rate", icon: Shield },
      ],
      aiSuggestion: "💬 Tip: Most elite connections start with a personalized introduction"
    },

    search: {
      icon: Search,
      gradient: "from-orange-500 to-red-600",
      title: "No Results Found",
      description: "Our AI couldn't find providers matching your exact criteria",
      actionText: "Refine Search",
      actionHref: "/browse",
      benefits: [
        "🎯 Try broader terms",
        "📍 Expand search radius",
        "📅 Check different dates",
        "🤖 Ask our AI for suggestions"
      ],
      stats: [
        { value: "50K+", label: "Total providers", icon: Users },
        { value: "500+", label: "Services available", icon: Sparkles },
        { value: "Daily", label: "New providers", icon: TrendingUp },
      ],
      aiSuggestion: "🔍 Let me suggest alternatives or notify you when matching providers become available"
    },

    notifications: {
      icon: Bell,
      gradient: "from-indigo-500 to-purple-600",
      title: "Stay Connected",
      description: "Enable notifications for instant updates on bookings and messages",
      actionText: "Enable Notifications",
      actionHref: "/settings",
      benefits: [
        "🔔 Instant booking alerts",
        "💬 Message notifications",
        "📅 Appointment reminders",
        "🏆 Elite status updates"
      ],
      stats: [
        { value: "5s", label: "Avg notification", icon: Zap },
        { value: "100%", label: "Delivery rate", icon: Target },
        { value: "Smart", label: "Timing logic", icon: Brain },
      ],
      aiSuggestion: "🔔 I can customize notification preferences based on your usage patterns"
    },

    payments: {
      icon: CreditCard,
      gradient: "from-green-500 to-emerald-600",
      title: "Secure Payment History",
      description: "All transactions are protected by our elite-grade escrow system",
      actionText: "Make Your First Booking",
      actionHref: "/browse",
      benefits: [
        "🔒 Bank-level security",
        "💳 Secure escrow system",
        "🛡️ 100% money-back guarantee",
        "📊 Detailed transaction history"
      ],
      stats: [
        { value: "$50M+", label: "Secure transactions", icon: Shield },
        { value: "0%", label: "Fraud rate", icon: Award },
        { value: "24/7", label: "Protection active", icon: Clock },
      ],
      aiSuggestion: "💳 I can explain our secure payment process and answer any questions"
    }
  };

  return configs[type as keyof typeof configs] || configs.bookings;
};

export function EmptyStateEnhanced({
  type,
  title: customTitle,
  description: customDescription,
  actionText: customActionText,
  actionHref: customActionHref,
  className = "",
  userType = "customer",
  context
}: EmptyStateProps) {
  const config = getEmptyStateConfig(type, userType);
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center justify-center min-h-[400px] p-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-xl shadow-xl">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-5`} />
          
          <CardContent className="relative z-10 p-12">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 mx-auto mb-8 bg-gradient-to-br ${config.gradient} rounded-3xl flex items-center justify-center shadow-lg`}
            >
              <IconComponent className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title & Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {customTitle || config.title}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {customDescription || config.description}
              </p>
            </motion.div>

            {/* AI Suggestion */}
            {config.aiSuggestion && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                      AI Assistant
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {config.aiSuggestion}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <UIIcons.CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-3 gap-6 mb-8"
            >
              {config.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Button
                asChild
                size="lg"
                className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <Link href={customActionHref || config.actionHref}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {customActionText || config.actionText}
                  <UIIcons.ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            {/* Secondary Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex justify-center gap-4 mt-6"
            >
              <Button variant="ghost" size="sm" asChild>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Get Help
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <OptimizedIcon name="MessageSquare" className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default EmptyStateEnhanced;
