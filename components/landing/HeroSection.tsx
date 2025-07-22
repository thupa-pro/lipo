import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Gem, CircuitBoard, Rocket, ArrowRight, Play } from "lucide-react";
import React from "react";

export function HeroSection({ socialProof }: { socialProof: { company: string; quote: string; logo: string }[] }) {
  return (
    <section className="relative z-40 px-6 py-20 md:py-32">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-100/80 to-purple-100/80 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200/50 dark:border-violet-700/50 backdrop-blur-sm"
          >
            <Gem className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              Revolutionary AI-Powered Marketplace
            </span>
            <CircuitBoard className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Loconomy
            </span>
            <br />
            <span className="bg-gradient-to-r from-slate-900 via-violet-700 to-slate-900 dark:from-white dark:via-violet-400 dark:to-white bg-clip-text text-transparent">
              is Here
            </span>
          </h1>

          {/* Premium Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 font-medium max-w-4xl mx-auto leading-relaxed">
            Experience the world's most advanced AI marketplace where{" "}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">elite professionals</span>{" "}
            meet intelligent matching in under{" "}
            <span className="text-violet-600 dark:text-violet-400 font-semibold">90 seconds</span>.
          </p>

          {/* Premium CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Button
              size="lg"
              className="h-16 px-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-2xl shadow-violet-500/25 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/request-service" className="flex items-center gap-3">
                <Rocket className="w-6 h-6" />
                Start Elite Experience
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-12 text-lg font-semibold border-2 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 transform hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link href="/demo" className="flex items-center gap-3">
                <Play className="w-6 h-6" />
                Watch 2-Min Demo
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-12"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-wider font-semibold">
              Featured In
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {socialProof.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-2xl">{item.logo}</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {item.company}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}