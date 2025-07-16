"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMockAuth } from "@/lib/mock/use-mock-auth";
import { UserRole } from "@/lib/mock/types";
import {
  User,
  LogOut,
  Crown,
  ShoppingBag,
  Store,
  Shield,
  CheckCircle,
  Info,
} from "lucide-react";

const roleConfig = {
  guest: {
    icon: User,
    label: "Guest",
    description: "Browse listings and view public content",
    color: "bg-gray-100 text-gray-800",
  },
  consumer: {
    icon: ShoppingBag,
    label: "Consumer",
    description: "Book services and manage your appointments",
    color: "bg-blue-100 text-blue-800",
  },
  provider: {
    icon: Store,
    label: "Service Provider",
    description: "Create listings and manage your services",
    color: "bg-green-100 text-green-800",
  },
  admin: {
    icon: Shield,
    label: "Administrator",
    description: "Full platform access and management tools",
    color: "bg-purple-100 text-purple-800",
  },
};

export default function MockAuthPage() {
  const { user, isLoading, signIn, signOut, switchRole } = useMockAuth();
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("consumer");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) return;

    setIsSigningIn(true);
    try {
      await signIn(email, selectedRole);
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
  };

  const handleSignOut = () => {
    signOut();
    setEmail("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loconomy Mock Authentication
          </h1>
          <p className="text-gray-600">
            Experience the platform from different user perspectives
          </p>
        </div>

        {user ? (
          <div className="space-y-6">
            {/* Current User Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {user.name}
                        <Badge className={roleConfig[user.role].color}>
                          {roleConfig[user.role].label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Signed in as <strong>{roleConfig[user.role].label}</strong>.
                    {roleConfig[user.role].description}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Plan
                    </Label>
                    <p className="text-lg font-semibold capitalize">
                      {user.subscription.plan}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Status
                    </Label>
                    <p className="text-lg font-semibold capitalize">
                      {user.subscription.status}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Renews
                    </Label>
                    <p className="text-lg font-semibold">
                      {user.subscription.currentPeriodEnd.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">
                    Features
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      Listings: {user.subscription.features.maxListings}
                    </div>
                    <div>
                      Bookings: {user.subscription.features.maxBookings}
                    </div>
                    <div>
                      AI Support:{" "}
                      {user.subscription.features.aiSupport ? "✓" : "✗"}
                    </div>
                    <div>
                      Analytics:{" "}
                      {user.subscription.features.analytics ? "✓" : "✗"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Switcher */}
            <Card>
              <CardHeader>
                <CardTitle>Switch Roles</CardTitle>
                <CardDescription>
                  Experience the platform from different user perspectives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                    const config = roleConfig[role];
                    const Icon = config.icon;
                    const isCurrentRole = user.role === role;

                    return (
                      <Card
                        key={role}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isCurrentRole ? "ring-2 ring-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => !isCurrentRole && handleRoleSwitch(role)}
                      >
                        <CardContent className="p-4 text-center">
                          <Icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                          <h3 className="font-semibold">{config.label}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {config.description}
                          </p>
                          {isCurrentRole && (
                            <Badge className="mt-2" variant="default">
                              Current
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Navigate to key areas of the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <ShoppingBag className="h-6 w-6" />
                    <span>View Dashboard</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Store className="h-6 w-6" />
                    <span>Browse Listings</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Crown className="h-6 w-6" />
                    <span>Billing Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Sign In Form */
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Mock Sign In</CardTitle>
              <CardDescription>
                Choose a role and email to simulate authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter any email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                />
              </div>

              <div className="space-y-3">
                <Label>Select Role</Label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                    const config = roleConfig[role];
                    const Icon = config.icon;

                    return (
                      <Card
                        key={role}
                        className={`cursor-pointer transition-all hover:shadow-sm ${
                          selectedRole === role
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : ""
                        }`}
                        onClick={() => setSelectedRole(role)}
                      >
                        <CardContent className="p-3 flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <h4 className="font-medium">{config.label}</h4>
                            <p className="text-xs text-gray-500">
                              {config.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleSignIn}
                disabled={!email.trim() || isSigningIn}
                className="w-full"
              >
                {isSigningIn ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a mock authentication system. Any email will work, and
                  you can switch between roles at any time.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
