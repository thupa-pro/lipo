// RoleGate Component for Loconomy Platform
// Provides role-based access control with subscription tier support

import { getCurrentUser } from '@/lib/auth/session';
import { 
  UserRole, 
  SubscriptionTier, 
  RoleGateProps,
  User 
} from '@/types/rbac';
import { 
  isRoleAllowed, 
  getUserRole, 
  getUserSubscriptionTier,
  canAccessFeature
} from '@/lib/rbac/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';

interface RoleGateServerProps extends RoleGateProps {
  user?: User | null;
}

/**
 * Server, Component version, of RoleGate
 * Use, this in, Server Components, for optimal, performance
 */
export async function RoleGate({
  allowedRoles,
  currentRole,
  fallback,
  requireSubscription,
  children
}: RoleGateProps) {
  const user = await getCurrentUser();
  const userRole = currentRole || getUserRole(user);
  
  return (
    <RoleGateContent
      allowedRoles={allowedRoles}
      currentRole={userRole}
      fallback={fallback}
      requireSubscription={requireSubscription}
      user={user}
    >
      {children}
    </RoleGateContent>
  );
}

/**
 * Client Component version of RoleGate
 * Use this when you need interactivity or have client-side user data
 */
export function ClientRoleGate({
  allowedRoles,
  currentRole,
  fallback,
  requireSubscription,
  user,
  children
}: RoleGateServerProps) {
  const userRole = currentRole || getUserRole(user);
  
  return (
    <RoleGateContent
      allowedRoles={allowedRoles}
      currentRole={userRole}
      fallback={fallback}
      requireSubscription={requireSubscription}
      user={user}
    >
      {children}
    </RoleGateContent>
  );
}

/**
 * Core RoleGate logic component
 */
function RoleGateContent({
  allowedRoles,
  currentRole,
  fallback,
  requireSubscription,
  user,
  children
}: RoleGateServerProps & { currentRole: UserRole }) {
  // Check if user can access based on role and subscription
  const hasAccess = canAccessFeature(
    user,
    allowedRoles,
    undefined,
    requireSubscription
  );

  if (hasAccess) {
    return <>{children}</>;
  }

  // Use custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Generate appropriate access denied message
  return <AccessDeniedFallback 
    userRole={currentRole}
    allowedRoles={allowedRoles}
    requireSubscription={requireSubscription}
    user={user}
  />;
}

/**
 * Default access denied fallback component
 */
function AccessDeniedFallback({
  userRole,
  allowedRoles,
  requireSubscription,
  user
}: {
  userRole: UserRole;
  allowedRoles: UserRole[];
  requireSubscription?: SubscriptionTier[];
  user: User | null;
}) {
  const isGuest = userRole === 'guest';
  const needsUpgrade = user && requireSubscription && !requireSubscription.includes(getUserSubscriptionTier(user));
  
  if (isGuest) {
    return <GuestAccessDenied allowedRoles={allowedRoles} />;
  }

  if (needsUpgrade) {
    return <SubscriptionUpgradeRequired 
      currentTier={getUserSubscriptionTier(user)}
      requiredTiers={requireSubscription!}
    />;
  }

  return <RoleAccessDenied 
    userRole={userRole}
    allowedRoles={allowedRoles}
  />;
}

/**
 * Guest user access denied component
 */
function GuestAccessDenied({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const needsAccount = allowedRoles.some(role => role !== 'guest');
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          <LogIn className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle>Authentication Required</CardTitle>
        <CardDescription>
          {needsAccount 
            ? "You need to sign in to access this feature."
            : "This content requires authentication."
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline">
            <Link href="/en/auth/signin">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Link>
          </Button>
          <Button asChild>
            <Link href="/en/auth/signup">
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Join thousands of users on Loconomy's trusted platform
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Role-based access denied component
 */
function RoleAccessDenied({ 
  userRole, 
  allowedRoles 
}: { 
  userRole: UserRole;
  allowedRoles: UserRole[];
}) {
  const getRoleDisplayName = (role: UserRole) => {
    const names = {
      guest: 'Guest',
      consumer: 'Consumer',
      provider: 'Service Provider',
      admin: 'Administrator'
    };
    return names[role];
  };

  const canUpgrade = userRole === 'consumer' && allowedRoles.includes('provider');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle>Access Restricted</CardTitle>
        <CardDescription>
          This feature is available to {allowedRoles.map(getRoleDisplayName).join(', ')} users only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Your current role:</span> {getRoleDisplayName(userRole)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Required role:</span> {allowedRoles.map(getRoleDisplayName).join(' or ')}
          </p>
        </div>
        
        {canUpgrade && (
          <Button asChild className="w-full">
            <Link href="/en/become-provider">
              <Crown className="w-4 h-4 mr-2" />
              Become a Provider
            </Link>
          </Button>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href="/en/contact">
            Contact Support
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Subscription upgrade required component
 */
function SubscriptionUpgradeRequired({
  currentTier,
  requiredTiers
}: {
  currentTier: SubscriptionTier;
  requiredTiers: SubscriptionTier[];
}) {
  const getTierDisplayName = (tier: SubscriptionTier) => {
    const names = {
      free: 'Free',
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise'
    };
    return names[tier];
  };

  const recommendedTier = requiredTiers.includes('professional') ? 'professional' : requiredTiers[0];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
          <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <CardTitle>Upgrade Required</CardTitle>
        <CardDescription>
          This feature requires a {requiredTiers.map(getTierDisplayName).join(' or ')} subscription.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Current plan:</span> {getTierDisplayName(currentTier)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Required plan:</span> {requiredTiers.map(getTierDisplayName).join(' or ')}
          </p>
        </div>
        
        <Button asChild className="w-full">
          <Link href={`/subscription/upgrade?plan=${recommendedTier}`}>
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to {getTierDisplayName(recommendedTier)}
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full">
          <Link href="/subscription">
            View All Plans
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Utility components for common use cases
 */

/**
 * Provider-only access gate
 */
export function ProviderGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGate allowedRoles={['provider', 'admin']} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

/**
 * Admin-only access gate
 */
export function AdminGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGate allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

/**
 * Authenticated user access gate
 */
export function AuthGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGate allowedRoles={['consumer', 'provider', 'admin']} fallback={fallback}>
      {children}
    </RoleGate>
  );
}

/**
 * Premium subscription access gate
 */
export function PremiumGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGate 
      allowedRoles={['provider', 'admin']} 
      requireSubscription={['professional', 'enterprise']}
      fallback={fallback}
    >
      {children}
    </RoleGate>
  );
}
