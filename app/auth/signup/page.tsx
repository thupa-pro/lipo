"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  AlertCircle,
  Chrome,
  Github,
  Apple,
  CheckCircle,
  Users,
  Briefcase,
  Sparkles,
  Shield,
  Brain,
  Star,
  Zap,
  Gift,
  Crown,
  Heart,
  Target,
  Award,
} from "lucide-react";

export default function PremiumSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    accountType: "customer",
    agreeToTerms: false,
    agreeToMarketing: true,
    subscribeToNewsletter: true,
  });

  const router = useRouter();
  const { toast } = useToast();

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData((prev) => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-blue-500";
    if (passwordStrength <= 2) return "bg-blue-500";
    if (passwordStrength <= 3) return "bg-blue-500";
    if (passwordStrength <= 4) return "bg-blue-600";
    return "bg-emerald-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    if (passwordStrength <= 4) return "Strong";
    return "Excellent";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Enhanced validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (!formData.email.includes("@") || !formData.email.includes(".")) {
        throw new Error("Please enter a valid email address");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      if (passwordStrength < 3) {
        throw new Error("Please choose a stronger password");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!formData.agreeToTerms) {
        throw new Error("Please agree to the Terms of Service");
      }

      // Simulate AI-powered signup process
      await new Promise((resolve) => setTimeout(resolve, 2500));

      toast({
        title: "🎉 Welcome to Loconomy!",
        description:
          "Your account has been created successfully. Get ready for an amazing experience!",
        variant: "default",
      });

      // Simulate AI preference setup
      setTimeout(() => {
        router.push("/onboarding");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      toast({
        title: "Sign Up Failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (
    provider: "google" | "github" | "apple",
  ) => {
    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const providerNames = {
      google: "Google",
      github: "GitHub",
      apple: "Apple",
    };

    toast({
      title: `${providerNames[provider]} Sign Up Successful!`,
      description:
        "Welcome to Loconomy! Setting up your personalized experience...",
      variant: "default",
    });

    setTimeout(() => {
      router.push("/onboarding");
    }, 1000);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-hidden relative">
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all group"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Branding & Benefits */}
            <div className="text-center lg:text-left">
              {/* Logo & Brand */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    Loconomy
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400">
                    <Brain className="w-3 h-3" />
                    AI-Powered Platform
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                  Join the Future of
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Local Services
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                Connect with verified professionals and unlock
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
                  {" "}
                  AI-powered matching{" "}
                </span>
                that finds your perfect service provider.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: Brain,
                    title: "AI Matching",
                    desc: "Smart recommendations",
                  },
                  {
                    icon: Shield,
                    title: "Verified Pros",
                    desc: "100% background checked",
                  },
                  {
                    icon: Zap,
                    title: "Instant Booking",
                    desc: "Book in seconds",
                  },
                  {
                    icon: Heart,
                    title: "Love Guarantee",
                    desc: "100% satisfaction",
                  },
                  {
                    icon: Target,
                    title: "Best Prices",
                    desc: "AI-optimized rates",
                  },
                  {
                    icon: Award,
                    title: "5-Star Quality",
                    desc: "Exceptional service",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-white/10">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 border-2 border-white dark:border-gray-800"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      <span className="font-bold text-lg">4.9</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      From 2.1M+ users
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-300 italic">
                  "Loconomy changed how I find local services. The AI matching
                  is incredible!"
                </p>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full max-w-lg mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30" />
                <Card className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-2xl rounded-3xl">
                  <CardHeader className="text-center pb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-4 mx-auto">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Free to Join • Premium Features
                      </span>
                      <Gift className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>

                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Create Your Account
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-300">
                      Start your journey with AI-powered local services
                    </CardDescription>

                    {/* Quick Benefits */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-emerald-500" />
                        AI Matching
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-blue-500" />
                        Verified Providers
                      </div>
                      <div className="flex items-center gap-1">
                        <Gift className="w-3 h-3 text-purple-500" />
                        Free to Join
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 px-8 pb-8">
                    {error && (
                      <Alert
                        variant="destructive"
                        className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Account Type Selection */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                          I want to:
                        </Label>
                        <RadioGroup
                          value={formData.accountType}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              accountType: value,
                            }))
                          }
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="relative overflow-hidden border-2 border-slate-200 dark:border-white/20 rounded-2xl p-4 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-300 cursor-pointer">
                            <RadioGroupItem
                              value="customer"
                              id="customer"
                              className="absolute top-3 right-3"
                            />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <Label
                                  htmlFor="customer"
                                  className="cursor-pointer font-medium text-slate-800 dark:text-white"
                                >
                                  Find Services
                                </Label>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-gray-400">
                                Book trusted local service providers
                              </p>
                            </div>
                          </div>
                          <div className="relative overflow-hidden border-2 border-slate-200 dark:border-white/20 rounded-2xl p-4 hover:border-emerald-300 dark:hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all duration-300 cursor-pointer">
                            <RadioGroupItem
                              value="provider"
                              id="provider"
                              className="absolute top-3 right-3"
                            />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg">
                                  <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <Label
                                  htmlFor="provider"
                                  className="cursor-pointer font-medium text-slate-800 dark:text-white"
                                >
                                  Offer Services
                                </Label>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-gray-400">
                                Grow your business with AI tools
                              </p>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="firstName"
                            className="text-sm font-medium text-slate-700 dark:text-gray-300"
                          >
                            First Name *
                          </Label>
                          <div className="relative group">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <Input
                              id="firstName"
                              placeholder="First name"
                              value={formData.firstName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  firstName: e.target.value,
                                }))
                              }
                              className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                              disabled={isLoading}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="lastName"
                            className="text-sm font-medium text-slate-700 dark:text-gray-300"
                          >
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            className="h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-slate-700 dark:text-gray-300"
                        >
                          Email Address *
                        </Label>
                        <div className="relative group">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-violet-500 dark:to-purple-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Mail className="w-3 h-3 text-white" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-slate-700 dark:text-gray-300"
                        >
                          Phone Number
                        </Label>
                        <div className="relative group">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-pink-500 dark:to-violet-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Phone className="w-3 h-3 text-white" />
                          </div>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="pl-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Password with strength indicator */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-slate-700 dark:text-gray-300"
                        >
                          Password *
                        </Label>
                        <div className="relative group">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-cyan-500 dark:to-blue-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) =>
                              handlePasswordChange(e.target.value)
                            }
                            className="pl-12 pr-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            disabled={isLoading}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-500" />
                            )}
                          </Button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                  style={{
                                    width: `${(passwordStrength / 5) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-slate-600 dark:text-gray-300">
                                {getPasswordStrengthText()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-slate-700 dark:text-gray-300"
                        >
                          Confirm Password *
                        </Label>
                        <div className="relative group">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-cyan-500 dark:to-blue-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="pl-12 pr-12 h-12 bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all"
                            disabled={isLoading}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 text-slate-500" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Agreements */}
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="terms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                agreeToTerms: !!checked,
                              }))
                            }
                            disabled={isLoading}
                            className="mt-1 rounded-md"
                          />
                          <Label
                            htmlFor="terms"
                            className="text-sm leading-relaxed text-slate-600 dark:text-gray-300"
                          >
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-blue-600 dark:text-blue-400 hover:underline transition-colors font-medium"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy"
                              className="text-blue-600 dark:text-blue-400 hover:underline transition-colors font-medium"
                            >
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="marketing"
                            checked={formData.agreeToMarketing}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                agreeToMarketing: !!checked,
                              }))
                            }
                            disabled={isLoading}
                            className="mt-1 rounded-md"
                          />
                          <Label
                            htmlFor="marketing"
                            className="text-sm leading-relaxed text-slate-500 dark:text-gray-400"
                          >
                            Get updates about new features, tips, and exclusive
                            offers
                          </Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25 transition-all duration-300"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Create Account Free
                          </>
                        )}
                      </Button>
                    </form>

                    {/* Social Signup */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="bg-slate-200 dark:bg-white/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-black px-4 text-slate-500 dark:text-gray-400 font-medium">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleSocialSignup("google")}
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      >
                        <Chrome className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSocialSignup("github")}
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      >
                        <Github className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSocialSignup("apple")}
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      >
                        <Apple className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="text-center text-sm">
                      <span className="text-slate-600 dark:text-gray-300">
                        Already have an account?{" "}
                      </span>
                      <Link
                        href="/auth/signin"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors"
                      >
                        Sign in
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-gray-400">
                By creating an account, you agree to our{" "}
                <Link
                  href="/terms"
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
