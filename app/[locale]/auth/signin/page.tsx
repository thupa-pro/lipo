import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Lock, Eye, EyeOff, Fingerprint, Globe, Chrome, Github, Zap } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: password, 3: success
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setError("");
    setStep(2);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(3);
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
        
        // Redirect after successful sign-in
        setTimeout(() => {
          router.push(`/${locale}/dashboard`);
        }, 1500);
      } else {
        setError(data.error || "Invalid credentials. Please check your email and password.");
        toast({
          title: "Authentication Failed",
          description: data.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    try {
      if (provider.toLowerCase() === 'google') {
        // Get Google OAuth URL from our backend
        const response = await fetch('/api/auth/google-oauth');
        const data = await response.json();
        
        if (data.success && data.url) {
          // Redirect to Google OAuth
          window.location.href = data.url;
        } else {
          throw new Error('Failed to get OAuth URL');
        }
      } else {
        toast({
          title: "Coming Soon",
          description: `${provider} sign-in will be available soon!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Back to Landing */}
      <Link
        href={`/${locale}`}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
      >
        <UIIcons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" / />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl">
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center mb-6 shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent mb-3">
                        Welcome Back
                      </h1>
                      <p className="text-slate-600 dark:text-gray-400">
                        Sign in to your Loconomy account
                      </p>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <OptimizedIcon name="Mail" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/50">
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        Continue
                      </Button>
                    </form>

                    {/* Social Sign In */}
                    <div className="mt-8">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-slate-200 dark:border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white/70 dark:bg-black/30 px-2 text-slate-500 dark:text-gray-400">
                            Or continue with
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleSocialSignIn('google')}
                          className="h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all"
                        >
                          <Chrome className="w-5 h-5 mr-2" />
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSocialSignIn('github')}
                          className="h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all"
                        >
                          <Github className="w-5 h-5 mr-2" />
                          GitHub
                        </Button>
                      </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link
                          href={`/${locale}/auth/signup`}
                          className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                        >
                          Sign up for free
                        </Link>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl">
                  <CardContent className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 flex items-center justify-center mb-6 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <OptimizedIcon name="Shield" className="w-8 h-8 text-white" />
                      </motion.div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent mb-3">
                        Enter Password
                      </h1>
                      <p className="text-slate-600 dark:text-gray-400">
                        Welcome, back, {email}
                      </p>
                    </div>

                    {/* Password Form */}
                    <form onSubmit={handleSignIn} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="pl-12 pr-12 h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/50">
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-between text-sm">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          ← Change email
                        </button>
                        <Link
                          href={`/${locale}/auth/forgot-password`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      >
                        {isLoading ? (
                          <>
                            <UIIcons.Loader2 className="w-5 h-5 mr-2 animate-spin" / />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-5 h-5 mr-2" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mb-6 shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6, repeat: 1 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Zap className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.h1
                      className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Welcome Back!
                    </motion.h1>
                    
                    <motion.p
                      className="text-slate-600 dark:text-gray-400 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Successfully signed in. Redirecting you to your dashboard...
                    </motion.p>
                    
                    <motion.div
                      className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features showcase */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <OptimizedIcon name="Shield" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Secure</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Global</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <NavigationIcons.Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" / />
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">Trusted</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
