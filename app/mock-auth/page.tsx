"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MockAuthProvider, useMockAuth } from "@/lib/mock/auth-provider";
import { Shield, User, Settings, AlertCircle } from "lucide-react";

function AuthForm() {
  const { user, signIn, signOut, signUp, updateRole, loading, error } =
    useMockAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    const success = await signIn({ email, password, rememberMe });
    if (success) {
      // Redirect based on role after successful sign in
      const dashboardPath = role === "admin" ? "/admin" : "/dashboard";
      router.push(dashboardPath);
    }
  };

  const handleSignUp = async () => {
    const success = await signUp({ email, password, role });
    if (success) {
      router.push("/dashboard");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (user) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Welcome back!</h2>
              <p className="text-gray-600">You are signed in as {user.email}</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Badge variant={user.role === "admin" ? "destructive" : "default"}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
            {user.metadata?.isVerified && (
              <Badge variant="secondary">Verified</Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="roleSwitch">Change Role (Development Only)</Label>
            <div className="mt-2">
              <Select value={user.role} onValueChange={updateRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="provider">Provider</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => router.push("/admin")} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </div>

          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TabsContent value="signin" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="remember"
            checked={rememberMe}
            onCheckedChange={setRememberMe}
          />
          <Label htmlFor="remember">Remember me</Label>
        </div>

        <Button onClick={handleSignIn} disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>
            <strong>Customer:</strong> customer@demo.com / password
          </p>
          <p>
            <strong>Provider:</strong> provider@demo.com / password
          </p>
          <p>
            <strong>Admin:</strong> admin@demo.com / password
          </p>
        </div>
      </TabsContent>

      <TabsContent value="signup" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSignUp} disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </TabsContent>
    </Tabs>
  );
}

export default function MockAuthPage() {
  return (
    <MockAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-2xl">Mock Authentication</CardTitle>
            </div>
            <CardDescription>
              Development environment authentication system
            </CardDescription>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Development Only
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                This is a mock authentication system for development purposes
                only. Do not use in production.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </MockAuthProvider>
  );
}
