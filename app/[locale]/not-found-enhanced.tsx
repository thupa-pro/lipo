import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, Zap, Brain, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COPY } from "@/lib/content/copy";

export default function EnhancedNotFound() {
  const router = useRouter();

  const helpOptions = [
    {
      icon: Search,
      title: "Search Services",
      description: "Find what you're looking for in our service directory",
      href: "/browse",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Bot,
      title: "Ask AI Assistant",
      description: "Our intelligent concierge can help navigate the platform",
      href: "/chat",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageSquare,
      title: "Contact Support",
      description: "Get personalized help from our elite support team",
      href: "/contact",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Phone,
      title: "Call Concierge",
      description: "Speak directly with our customer success team",
      href: "tel:+1-555-0123",
      color: "from-orange-500 to-red-500"
    }
  ];

  const popularPages = [
    { name: "Browse Services", href: "/browse" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Become a Provider", href: "/become-provider" },
    { name: "Help Center", href: "/help" },
    { name: "Safety & Trust", href: "/safety" },
    { name: "Pricing", href: "/pricing" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Error Code */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative mb-8"
          >
            <div className="text-[200px] md:text-[300px] font-black text-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 bg-clip-text leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <HelpCircle className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Elite Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-lg font-semibold mb-4">
              <Sparkles className="w-5 h-5 mr-2" />
              Elite Network Error
            </Badge>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-blue-600 dark:from-white dark:to-violet-200 bg-clip-text text-transparent">
                {COPY.errors.notFound.title}
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {COPY.errors.notFound.description}
            </p>

            {/* AI Assistant Offer */}
            <Card className="max-w-md mx-auto mb-8 bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/50 dark:border-blue-800/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      AI Assistant
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">Online & Ready</span>
                    </div>
                  </div>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                  {COPY.errors.notFound.help}
                </p>
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                >
                  <Link href="/chat">
                    <OptimizedIcon name="MessageSquare" className="w-4 h-4 mr-2" />
                    Get AI Help
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button 
              onClick={() => router.back()}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 rounded-2xl border-2 border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10"
            >
              <UIIcons.ArrowLeft className="w-5 h-5 mr-2" / />
              Go Back
            </Button>
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-lg px-8 py-4 rounded-2xl"
            >
              <Link href="/">
                <NavigationIcons.Home className="w-5 h-5 mr-2" / />
                {COPY.errors.notFound.action}
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Help Options Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {helpOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                    {option.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
                    {option.description}
                  </p>
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    <Link href={option.href}>
                      Get Help
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Popular Pages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Or explore these popular pages:
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularPages.map((page, index) => (
              <Button 
                key={index}
                asChild
                variant="ghost" 
                size="sm"
                className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Link href={page.href}>
                  {page.name}
                </Link>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Support Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center mt-12 p-6 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <OptimizedIcon name="Shield" className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-900 dark:text-white">Elite Support Available</span>
          </div>
          <p className="text-slate-600 dark:text-gray-400 mb-4">
            Our concierge team responds in under 5 minutes • Available 24/7
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="mailto:support@loconomy.com" className="flex items-center gap-2">
                <OptimizedIcon name="Mail" className="w-4 h-4" />
                Email Support
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/chat" className="flex items-center gap-2">
                <OptimizedIcon name="MessageSquare" className="w-4 h-4" />
                Live Chat
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
