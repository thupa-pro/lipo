"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  ArrowRight,
  Star,
  Users,
  Shield,
  Zap,
  Globe,
  Heart
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't redirect immediately - let users see the homepage
  const handleGetStarted = () => {
    if (isSignedIn && user) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}/auth/signup`);
    }
  };

  const handleSignIn = () => {
    router.push(`/${locale}/auth/signin`);
  };

  const handleBrowseServices = () => {
    router.push(`/${locale}/browse`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Loconomy...</h2>
          <p className="text-gray-600">Preparing your elite service experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Logo and Title */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Loconomy
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                The world's most advanced AI-powered local services marketplace.<br />
                <span className="font-semibold text-violet-600 dark:text-violet-400">Elite professionals meet intelligent matching in under 90 seconds.</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isSignedIn ? (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => router.push(`/${locale}/dashboard`)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleBrowseServices}
                    className="px-8 py-4 text-lg"
                  >
                    Browse Services
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleSignIn}
                    className="px-8 py-4 text-lg"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Quick Browse */}
            <div className="mb-16">
              <p className="text-gray-600 dark:text-gray-400 mb-6">Popular Services:</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { name: "House Cleaning", emoji: "🧹" },
                  { name: "Plumbing", emoji: "🔧" },
                  { name: "Electrical", emoji: "⚡" },
                  { name: "Gardening", emoji: "🌱" },
                  { name: "Beauty & Wellness", emoji: "💆‍♀️" },
                  { name: "Home Security", emoji: "🔒" }
                ].map((service) => (
                  <Button
                    key={service.name}
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/${locale}/browse?category=${service.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  >
                    {service.emoji} {service.name}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get matched with verified professionals in under 90 seconds with our AI-powered system."
              },
              {
                icon: Shield,
                title: "Verified & Secure",
                description: "All service providers are background-checked and verified for your peace of mind."
              },
              {
                icon: Star,
                title: "Premium Quality",
                description: "Only elite professionals with 4.5+ ratings join our exclusive marketplace."
              },
              {
                icon: Globe,
                title: "Global Ready",
                description: "Available in 9 languages with local professionals worldwide."
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Join thousands of satisfied customers and top-rated service providers."
              },
              {
                icon: Heart,
                title: "Love Guaranteed",
                description: "100% satisfaction guarantee or we'll make it right - no questions asked."
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-20"
          >
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Experience Elite Service?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join thousands of satisfied customers who trust Loconomy for their service needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => router.push(`/${locale}/about`)}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
