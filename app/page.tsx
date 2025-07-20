"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Star, 
  Users, 
  MapPin,
  Shield,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const features = [
  {
    icon: Shield,
    title: "Trusted & Verified",
    description: "All service providers are background-checked and verified for your peace of mind.",
    color: "text-green-600 dark:text-green-400"
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Matching",
    description: "Our intelligent algorithm finds the perfect service provider for your specific needs.",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Book services in seconds with real-time availability and instant confirmation.",
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "100% satisfaction guarantee with our premium service quality assurance.",
    color: "text-orange-600 dark:text-orange-400"
  }
];

const stats = [
  { label: "Active Users", value: "10K+", icon: Users },
  { label: "Service Providers", value: "2.5K+", icon: Star },
  { label: "Cities Covered", value: "50+", icon: MapPin },
  { label: "Services Completed", value: "25K+", icon: CheckCircle }
];

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      resolvedTheme === "dark" 
        ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" 
        : "bg-gradient-to-b from-slate-50 via-white to-slate-50"
    }`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
            resolvedTheme === "dark" 
              ? "bg-gradient-to-r from-purple-600 to-blue-600" 
              : "bg-gradient-to-r from-blue-400 to-purple-400"
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
            resolvedTheme === "dark" 
              ? "bg-gradient-to-r from-green-600 to-blue-600" 
              : "bg-gradient-to-r from-green-400 to-blue-400"
          }`} />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loconomy
              </h1>
            </div>
            <ThemeToggle size="md" showLabel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge 
                  variant="secondary" 
                  className={`${
                    resolvedTheme === "dark" 
                      ? "bg-purple-900/30 text-purple-300 border-purple-700" 
                      : "bg-purple-100 text-purple-700 border-purple-200"
                  } px-4 py-2`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Local Services
                </Badge>
                
                <h1 className={`text-4xl lg:text-6xl font-bold leading-tight ${
                  resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  Find Perfect{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                    Local Services
                  </span>{" "}
                  in Minutes
                </h1>
                
                <p className={`text-xl leading-relaxed ${
                  resolvedTheme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}>
                  Connect with trusted, verified service providers in your area. 
                  From home cleaning to professional tutoring, find exactly what you need 
                  with our AI-powered matching system.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className={`${
                    resolvedTheme === "dark"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className={`${
                    resolvedTheme === "dark"
                      ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50"
                  } transition-all duration-300`}
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center space-y-2"
                  >
                    <stat.icon className={`w-8 h-8 mx-auto ${
                      resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`} />
                    <div className={`text-2xl font-bold ${
                      resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${
                      resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className={`rounded-2xl p-8 backdrop-blur-sm border ${
                resolvedTheme === "dark"
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white/70 border-slate-200"
              } shadow-2xl`}>
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className={`text-2xl font-semibold ${
                      resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                      Quick Service Search
                    </h3>
                    <p className={`${
                      resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                      Find what you need in seconds
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 border-dashed ${
                      resolvedTheme === "dark" 
                        ? "border-slate-600 bg-slate-700/30" 
                        : "border-slate-300 bg-slate-50"
                    }`}>
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                          resolvedTheme === "dark" 
                            ? "bg-blue-900/30 text-blue-400" 
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <p className={`text-sm ${
                          resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                          AI-powered service matching
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      Search Services
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${
        resolvedTheme === "dark" ? "bg-slate-800/50" : "bg-slate-100/50"
      }`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className={`text-3xl lg:text-4xl font-bold ${
              resolvedTheme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Why Choose Loconomy?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              resolvedTheme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}>
              Experience the future of local service discovery with our innovative platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  resolvedTheme === "dark"
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}>
                  <CardHeader className="text-center space-y-4">
                    <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                      resolvedTheme === "dark" 
                        ? "bg-slate-700" 
                        : "bg-slate-100"
                    }`}>
                      <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <CardTitle className={`text-xl ${
                      resolvedTheme === "dark" ? "text-white" : "text-slate-900"
                    }`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-center ${
                      resolvedTheme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={`rounded-2xl p-12 text-center space-y-8 ${
              resolvedTheme === "dark"
                ? "bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600"
                : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
            }`}
          >
            <h2 className={`text-3xl lg:text-4xl font-bold ${
              resolvedTheme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Ready to Get Started?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              resolvedTheme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}>
              Join thousands of satisfied customers who have found their perfect service providers through Loconomy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className={`${
                  resolvedTheme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className={`${
                  resolvedTheme === "dark"
                    ? "border-slate-600 text-slate-300 hover:bg-slate-800"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                } transition-all duration-300`}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
