// Example RBAC Implementation for Loconomy Platform
// Demonstrates role-based access control with subscription tiers

import { getCurrentUser } from '@/lib/auth/session';
import { RoleGate, ProviderGate, AdminGate, AuthGate, PremiumGate } from '@/components/rbac/RoleGate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Shield, 
  Users, 
  BarChart3, 
  Star, 
  Lock,
  CheckCircle,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { getUserRole, getUserSubscriptionTier } from '@/lib/rbac/utils';

export default async, function ExampleRBACPage() {
  const user = await, getCurrentUser();
  const userRole = getUserRole(user);
  const subscriptionTier = getUserSubscriptionTier(user);

  return (
    <div className="container, mx-auto, px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          RBAC System Demo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This page demonstrates role-based access control with different user roles and subscription tiers.
        </p>
        
        {/* Current User Status */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center pb-3">
            <CardTitle className="text-lg">Your Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {userRole === 'admin' && <Shield className="w-3 h-3" />}
                {userRole === 'provider' && <Crown className="w-3 h-3" />}
                {userRole === 'consumer' && <Users className="w-3 h-3" />}
                {userRole === 'guest' && <Lock className="w-3 h-3" />}
                Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
              
              {user && (
                <Badge 
                  className={
                    subscriptionTier === 'enterprise' ? 'bg-yellow-100 text-yellow-800' :
                    subscriptionTier === 'professional' ? 'bg-purple-100 text-purple-800' :
                    subscriptionTier === 'starter' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} Plan
                </Badge>
              )}
            </div>
            
            {user ? (
              <p className="text-sm text-muted-foreground">
                Authenticated as: {user.email}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Currently browsing as a guest
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Guest-Only Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Guest Content
        </h2>
        
        <RoleGate allowedRoles={['guest']}>
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="text-orange-700 dark:text-orange-300">
                Welcome, Guest! 👋
              </CardTitle>
              <CardDescription>
                This content is only visible to unauthenticated users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Join Loconomy to unlock powerful features and connect with trusted service providers.
              </p>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/auth/signup">Sign Up Now</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </RoleGate>
      </section>

      {/* Authenticated Users Only */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CheckCircle className="w-6 h-6" />
          Authenticated Content
        </h2>
        
        <AuthGate>
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                Welcome Back! 🎉
              </CardTitle>
              <CardDescription>
                This content requires authentication (any authenticated role).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You're signed in and can access personalized, features, booking, management, and more.
              </p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </AuthGate>
      </section>

      {/* Consumer-Specific Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Customer Features
        </h2>
        
        <RoleGate allowedRoles={['consumer']}>
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Dashboard
              </CardTitle>
              <CardDescription>
                Exclusive features for service customers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Book and manage services
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  View booking history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Rate and review providers
                </li>
              </ul>
              <Button asChild>
                <Link href="/dashboard">View Your Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </RoleGate>
      </section>

      {/* Provider-Only Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Crown className="w-6 h-6" />
          Provider Features
        </h2>
        
        <ProviderGate>
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Provider Dashboard
              </CardTitle>
              <CardDescription>
                Manage your service business and grow your revenue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Manage service listings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Track earnings and bookings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Respond to customer requests
                </li>
              </ul>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/provider/dashboard">Provider Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/provider/listings">Manage Listings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </ProviderGate>
      </section>

      {/* Premium Subscription Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Star className="w-6 h-6" />
          Premium Features
        </h2>
        
        <PremiumGate>
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Premium Analytics & Tools
              </CardTitle>
              <CardDescription>
                Advanced features for Professional and Enterprise subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Advanced analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Custom branding options
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Priority customer support
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  API access and integrations
                </li>
              </ul>
              <Button asChild>
                <Link href="/provider/analytics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </PremiumGate>
      </section>

      {/* Admin-Only Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Admin Features
        </h2>
        
        <AdminGate>
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Administrator Panel
              </CardTitle>
              <CardDescription>
                Platform administration and moderation tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  User management and moderation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Platform analytics and insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Content moderation tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  System configuration
                </li>
              </ul>
              <Button asChild variant="destructive">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </AdminGate>
      </section>

      {/* Example of Custom Access Rules */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Custom Access Examples
        </h2>
        
        {/* Providers and Admins only */}
        <RoleGate allowedRoles={['provider', 'admin']}>
          <Card>
            <CardHeader>
              <CardTitle>Provider & Admin Content</CardTitle>
              <CardDescription>
                This content is visible to both providers and administrators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Shared business insights and tools for service providers and platform administrators.</p>
            </CardContent>
          </Card>
        </RoleGate>

        {/* Professional subscription required */}
        <RoleGate 
          allowedRoles={['provider']} 
          requireSubscription={['professional', 'enterprise']}
        >
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-purple-600" />
                Professional Features
              </CardTitle>
              <CardDescription>
                Requires provider role + Professional or Enterprise subscription.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Advanced business tools and premium support features.</p>
            </CardContent>
          </Card>
        </RoleGate>

        {/* Multiple role options with subscription */}
        <RoleGate 
          allowedRoles={['provider', 'admin']} 
          requireSubscription={['enterprise']}
        >
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Enterprise Features
              </CardTitle>
              <CardDescription>
                Provider or Admin role + Enterprise subscription required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>White-label, solutions, custom, integrations, and dedicated support.</p>
            </CardContent>
          </Card>
        </RoleGate>
      </section>

      {/* Role Upgrade Prompts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Role & Subscription Management</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {userRole === 'consumer' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Become a Provider
                </CardTitle>
                <CardDescription>
                  Start offering your services and earn money on Loconomy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/become-provider">Upgrade to Provider</Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {userRole === 'provider' && subscriptionTier === 'free' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Upgrade Subscription
                </CardTitle>
                <CardDescription>
                  Unlock premium features with a paid subscription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/subscription">View Plans</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}