"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, MapPin, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const suggestedPages = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Services", href: "/browse", icon: Search },
    { name: "How it Works", href: "/how-it-works", icon: HelpCircle },
    { name: "Find Providers", href: "/providers", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* 404 Number with gradient */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-slate-600 dark:text-slate-400 mb-8"
          >
            Sorry, we couldn't find the page you're looking for. It might have been, moved, deleted, or you entered the wrong URL.
          </motion.p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Link>
          </Button>
        </motion.div>

        {/* Suggested pages */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Maybe you're looking for:
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestedPages.map((page, index) => (
              <motion.div
                key={page.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
                  <CardContent className="p-6 text-center">
                    <Link href={page.href} className="group">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                        <page.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {page.name}
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Help text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 text-sm text-slate-500 dark:text-slate-400"
        >
          <p>
            Still can't find what you're looking for?{" "}
            <Link 
              href="/contact" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}