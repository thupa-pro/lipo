import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams  } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Lock, Eye, EyeOff, Chrome, Github, Users, Briefcase, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: role, selection, 2: info, form, 3: success
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const roleOptions = [
    {
      value: "CUSTOMER",
      title: "Customer",
      description: "Find and book trusted local services",
      icon: Users,
      gradient: "from-blue-600 to-cyan-600",
      features: ["Browse services", "Book appointments", "Rate providers", "24/7 Support"]
    },
    {
      value: "PROVIDER",
      title: "Service Provider",
      description: "Grow your business and serve your community",
      icon: Briefcase,
      gradient: "from-purple-600 to-pink-600",
      features: ["List services", "Manage bookings", "Earn money", "Business analytics"]
    }
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
          name: name.trim(),
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep(3);
        toast({
          title: "Account Created!",
          description: data.message || "Welcome to Loconomy!",
        });
        
        if (data.needsVerification) {
          setTimeout(() => {
            router.push(`/${locale}/auth/verify-email`);
          }, 3000);
        } else {
          setTimeout(() => {
            router.push(`/${locale}/dashboard`);
          }, 2000);
        }
      } else {
        setError(data.error || "Registration failed");
        toast({
          title: "Registration Failed",
          description: data.error || "An error occurred during registration",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: string) => {
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
        // Implement other OAuth providers here
        const response = await fetch(`/api/auth/${provider.toLowerCase()}-oauth`);
        const data = await response.json();

        if (data.success && data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(`${provider} OAuth not yet configured`);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to sign up with ${provider}`,
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
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Back to Landing */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group"
      >
        <UIIcons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
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
                        className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center mb-6 shadow-lg"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-slate-800 dark:from-white dark:via-purple-400 dark:to-white bg-clip-text text-transparent mb-3">
                        Join Loconomy
                      </h1>
                      <p className="text-slate-600 dark:text-gray-400">
                        Choose how you'd like to get started
                      </p>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-4">
                      {roleOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <motion.div
                            key={option.value}
                            className="relative cursor-pointer group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRoleSelect(option.value)}
                          >
                            <div className="p-6 rounded-2xl border border-white/30 dark:border-white/20 bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-all duration-300 group-hover:shadow-lg">
                              <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${option.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
                                  <IconComponent className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                                    {option.title}
                                  </h3>
                                  <p className="text-slate-600 dark:text-gray-400 mb-4">
                                    {option.description}
                                  </p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {option.features.map((feature, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <UIIcons.CheckCircle className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm text-slate-600 dark:text-gray-400">
                                          {feature}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                      <p className="text-sm text-slate-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                          href="/auth/signin"
                          className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
                        >
                          Sign in here
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
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <button
                          onClick={() => setStep(1)}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <UIIcons.ArrowLeft className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                        </button>
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${roleOptions.find(r => r.value === role)?.gradient} flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {React.createElement(roleOptions.find(r => r.value === role)?.icon || User, {
                            className: "w-8 h-8 text-white"
                          })}
                        </motion.div>
                      </div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-slate-800 dark:from-white dark:via-purple-400 dark:to-white bg-clip-text text-transparent mb-3">
                        Create Account
                      </h1>
                      <p className="text-slate-600 dark:text-gray-400">
                        Join as a {roleOptions.find(r => r.value === role)?.title}
                      </p>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                          Full Name
                        </Label>
                        <div className="relative">
                          <NavigationIcons.User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all"
                            required
                          />
                        </div>
                      </div>

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
                            className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all"
                            required
                          />
                        </div>
                      </div>

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
                            placeholder="Create a password (min. 6 characters)"
                            className="pl-12 pr-12 h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all"
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

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="pl-12 pr-12 h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500/20 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/30 border-red-200/50 dark:border-red-800/50">
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      >
                        {isLoading ? (
                          <>
                            <UIIcons.Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <OptimizedIcon name="Star" className="w-5 h-5 mr-2" />
                            Create Account
                          </>
                        )}
                      </Button>
                    </form>

                    {/* Social Sign Up */}
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
                          onClick={() => handleSocialSignUp('Google')}
                          className="h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all"
                        >
                          <Chrome className="w-5 h-5 mr-2" />
                          Google
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleSocialSignUp('GitHub')}
                          className="h-12 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-all"
                        >
                          <Github className="w-5 h-5 mr-2" />
                          GitHub
                        </Button>
                      </div>
                    </div>
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
                        <UIIcons.CheckCircle className="w-10 h-10 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.h1
                      className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Welcome to Loconomy!
                    </motion.h1>
                    
                    <motion.p
                      className="text-slate-600 dark:text-gray-400 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Account created successfully! Please check your email to verify your account and complete the setup.
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
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                    </motion.div>

                    <motion.p
                      className="text-sm text-slate-500 dark:text-gray-500 mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      Redirecting to sign in page...
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
