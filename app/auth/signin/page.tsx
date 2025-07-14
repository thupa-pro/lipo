"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  AlertCircle,
  Chrome,
  Facebook,
  Sparkles,
  Shield,
  Zap,
  Heart,
  Star,
  Users,
  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (
      formData.email === "test@example.com" &&
      formData.password === "password123"
    ) {
      toast({
        title: "Sign In Successful!",
        description: "You have been successfully logged in.",
        variant: "default",
      });
      router.push("/dashboard"); // Redirect to dashboard on success
    } else {
      setError("Invalid email or password.");
      toast({
        title: "Sign In Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    setError("");

    // Simulate social login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (provider === "google") {
      toast({
        title: "Google Login Successful!",
        description: "You have been successfully logged in with Google.",
        variant: "default",
      });
      router.push("/dashboard");
    } else if (provider === "facebook") {
      toast({
        title: "Facebook Login Successful!",
        description: "You have been successfully logged in with Facebook.",
        variant: "default",
      });
      router.push("/dashboard");
    } else {
      setError("Social login failed. Please try again.");
      toast({
        title: "Social Login Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
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
        <div className="w-full max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-8 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Branding & Features */}
            <div className="text-center lg:text-left">
              {/* Logo & Brand */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Loconomy
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                  Welcome Back to
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 leading-relaxed">
                Access your personalized dashboard with
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text font-semibold">
                  {" "}
                  AI-powered insights{" "}
                </span>
                and premium local services.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: Shield,
                    text: "Secure Login",
                    desc: "Military-grade security",
                  },
                  {
                    icon: Users,
                    text: "2.1M+ Users",
                    desc: "Trusted globally",
                  },
                  { icon: Zap, text: "Instant Access", desc: "Lightning fast" },
                  {
                    icon: Brain,
                    text: "AI-Powered",
                    desc: "Smart recommendations",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">
                        {item.text}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-2 opacity-70">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-emerald-400 border-2 border-white dark:border-gray-800"
                    />
                  ))}
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    <span className="font-semibold text-sm">4.9</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    From 50K+ reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 dark:from-violet-500 dark:via-purple-500 dark:to-pink-500 rounded-3xl blur opacity-20 dark:opacity-30" />
                <Card className="relative bg-white/90 dark:bg-white/10 backdrop-blur-xl border-blue-200/50 dark:border-white/20 shadow-2xl rounded-3xl">
                  <CardHeader className="text-center pb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-blue-200/50 dark:border-white/10 mb-4 mx-auto">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Secure Access Portal
                      </span>
                      <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    </div>

                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Sign In to Continue
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-gray-300">
                      Access your personalized experience
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 px-8 pb-8">
                    {error && (
                      <Alert
                        variant="destructive"
                        className="border-red-200 bg-red-50/50 dark:bg-red-950/20"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-slate-700 dark:text-gray-300 font-medium"
                        >
                          Email Address
                        </Label>
                        <div className="relative">
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

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-slate-700 dark:text-gray-300 font-medium"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 dark:from-pink-500 dark:to-violet-500 flex items-center justify-center absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
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
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
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
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="remember"
                            checked={formData.rememberMe}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                rememberMe: !!checked,
                              }))
                            }
                            disabled={isLoading}
                            className="rounded-md"
                          />
                          <Label
                            htmlFor="remember"
                            className="text-sm text-slate-600 dark:text-gray-300"
                          >
                            Remember me
                          </Label>
                        </div>
                        <Link
                          href="/auth/forgot-password"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-violet-500/25 transition-all duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In Securely
                            <Sparkles className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="bg-slate-200 dark:bg-white/20" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-black px-4 text-slate-500 dark:text-gray-400 font-medium">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("google")}
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      >
                        <Chrome className="w-5 h-5 mr-2" />
                        Google
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSocialLogin("facebook")}
                        disabled={isLoading}
                        className="h-12 rounded-2xl border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
                      >
                        <Facebook className="w-5 h-5 mr-2" />
                        Facebook
                      </Button>
                    </div>

                    <div className="text-center text-sm">
                      <span className="text-slate-600 dark:text-gray-300">
                        Don't have an account?{" "}
                      </span>
                      <Link
                        href="/auth/signup"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                      >
                        Sign up free
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-gray-400">
                By signing in, you agree to our{" "}
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
