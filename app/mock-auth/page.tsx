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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Users,
  User,
  Crown,
  Shield,
  Info,
  LogOut,
  ArrowLeftRight,
  Settings,
  Eye,
} from "lucide-react";
import { useMockAuth } from "@/lib/mock/use-mock-auth";

export default function MockAuthPage() {
  const { user, role, signIn, signOut, switchRole } = useMockAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<
    "consumer" | "provider" | "admin"
  >("consumer");

  const handleSignIn = (newRole: "consumer" | "provider" | "admin") => {
    signIn(newRole);
    toast({
      title: "Signed In",
      description: `Signed in as ${newRole}`,
      variant: "default",
    });
  };

  const handleSwitchRole = (newRole: "consumer" | "provider" | "admin") => {
    switchRole(newRole);
    toast({
      title: "Role Switched",
      description: `Switched to ${newRole} role`,
      variant: "default",
    });
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "Successfully signed out",
      variant: "default",
    });
  };

  const roleData = {
    consumer: {
      icon: User,
      color: "bg-blue-500",
      description: "Regular user who books services",
      permissions: [
        "Book services",
        "View dashboard",
        "Manage bookings",
        "Leave reviews",
      ],
    },
    provider: {
      icon: Users,
      color: "bg-green-500",
      description: "Service provider who offers services",
      permissions: [
        "Manage listings",
        "View bookings",
        "Provider dashboard",
        "Analytics",
      ],
    },
    admin: {
      icon: Crown,
      color: "bg-purple-500",
      description: "Administrator with full access",
      permissions: [
        "User management",
        "Content moderation",
        "System monitoring",
        "Analytics",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Mock Authentication System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Test different user roles and permissions without real
            authentication
          </p>
        </div>

        {user ? (
          <div className="space-y-6">
            {/* Current User Status */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full ${roleData[role].color} flex items-center justify-center`}
                    >
                      {React.createElement(roleData[role].icon, {
                        className: "w-6 h-6 text-white",
                      })}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Signed in as{" "}
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Mock User
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {roleData[role].permissions.map((permission, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSignOut} variant="outline">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Switching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5" />
                  Switch Role
                </CardTitle>
                <CardDescription>
                  Test different user roles to see how the app behaves
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={role}
                  onValueChange={(value) => handleSwitchRole(value as any)}
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="consumer">Consumer</TabsTrigger>
                    <TabsTrigger value="provider">Provider</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>

                  {Object.entries(roleData).map(([roleKey, data]) => (
                    <TabsContent key={roleKey} value={roleKey} className="mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-full ${data.color} flex items-center justify-center`}
                            >
                              {React.createElement(data.icon, {
                                className: "w-5 h-5 text-white",
                              })}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {roleKey.charAt(0).toUpperCase() +
                                  roleKey.slice(1)}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {data.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {data.permissions.map((permission, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Navigation Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Test Navigation
                </CardTitle>
                <CardDescription>
                  Visit different pages to see role-based content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {role === "consumer" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/dashboard")}
                      >
                        Consumer Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/bookings")}
                      >
                        My Bookings
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/browse")}
                      >
                        Browse Services
                      </Button>
                    </>
                  )}
                  {role === "provider" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/provider/dashboard")
                        }
                      >
                        Provider Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/provider/listings")
                        }
                      >
                        My Listings
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/provider/analytics")
                        }
                      >
                        Analytics
                      </Button>
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/admin")}
                      >
                        Admin Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/admin/users")}
                      >
                        User Management
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          (window.location.href = "/admin/content-moderation")
                        }
                      >
                        Content Moderation
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Choose Your Role
              </CardTitle>
              <CardDescription className="text-center">
                Select a role to sign in and test the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(roleData).map(([roleKey, data]) => (
                <Button
                  key={roleKey}
                  onClick={() => handleSignIn(roleKey as any)}
                  variant="outline"
                  className="w-full p-4 h-auto justify-start"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${data.color} flex items-center justify-center`}
                    >
                      {React.createElement(data.icon, {
                        className: "w-5 h-5 text-white",
                      })}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">
                        {roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {data.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}

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
