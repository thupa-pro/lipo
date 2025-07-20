"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Mail, Lock, User, ArrowLeft, Loader2, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully! Please sign in.",
        });
        router.push("/auth/signin");
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred");
        toast({
          title: "Error",
          description: data.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Back to Landing */}
      <Link
        href="/landing"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Sign Up Form */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Join ServiceHub
            </CardTitle>
            <p className="text-slate-600 dark:text-gray-400">
              Create your account and start your journey
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>I want to join as</Label>
                <RadioGroup value={role} onValueChange={setRole}>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <RadioGroupItem value="CUSTOMER" id="customer" />
                    <Label htmlFor="customer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Customer</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">
                          Find and book services
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <RadioGroupItem value="PROVIDER" id="provider" />
                    <Label htmlFor="provider" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Briefcase className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium">Service Provider</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">
                          Offer and manage services
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl h-12 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:text-blue-500 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-gray-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
