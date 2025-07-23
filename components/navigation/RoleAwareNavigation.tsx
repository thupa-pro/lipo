"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  BarChart3,
  Calendar,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Crown,
  Shield,
  User,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { getUserRole, getUserSubscriptionTier } from '@/lib/rbac/utils';
import { User as UserType } from '@/hooks/useAuth';

interface RoleAwareNavigationProps {
  user?: UserType | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: Array<'guest' | 'consumer' | 'provider' | 'admin'>;
  requiresSubscription?: Array<'starter' | 'professional' | 'enterprise'>;
}

// Base navigation items (will be prefixed with locale)
const NAVIGATION_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: Sparkles,
    roles: ['guest', 'consumer', 'provider', 'admin']
  },
  {
    href: '/browse',
    label: 'Browse Services',
    icon: MapPin,
    roles: ['guest', 'consumer', 'provider', 'admin']
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    roles: ['consumer']
  },
  {
    href: '/provider/dashboard',
    label: 'Provider Dashboard',
    icon: BarChart3,
    roles: ['provider', 'admin']
  },
  {
    href: '/provider/listings',
    label: 'My Listings',
    icon: Calendar,
    roles: ['provider', 'admin']
  },
  {
    href: '/provider/analytics',
    label: 'Analytics',
    icon: BarChart3,
    badge: 'Pro',
    roles: ['provider', 'admin'],
    requiresSubscription: ['professional', 'enterprise']
  },
  {
    href: '/messages',
    label: 'Messages',
    icon: MessageSquare,
    roles: ['consumer', 'provider', 'admin']
  },
  {
    href: '/admin',
    label: 'Admin Panel',
    icon: Shield,
    roles: ['admin']
  }
];

export function RoleAwareNavigation({ user }: RoleAwareNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';

  const userRole = getUserRole(user);
  const subscriptionTier = getUserSubscriptionTier(user);

  // ✅ Function definitions moved inside component
  const getRoleDisplayName = (role: typeof userRole) => {
    const names = {
      guest: 'Guest',
      consumer: 'Customer',
      provider: 'Service Provider',
      admin: 'Administrator'
    };
    return names[role];
  };

  const getSubscriptionColor = (tier: typeof subscriptionTier) => {
    const colors = {
      starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      professional: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      enterprise: 'bg-gold-100 text-gold-700 dark:bg-gold-900 dark:text-gold-300'
    };
    return colors[tier] || 'bg-gray-100 text-gray-700';
  };

  // Create locale-aware navigation items
  const localeAwareNavItems = NAVIGATION_ITEMS.map(item => ({
    ...item,
    href: `/${locale}${item.href === '/' ? '' : item.href}`
  }));

  // Filter navigation items based on user role and subscription
  const visibleNavItems = localeAwareNavItems.filter(item => {
    // Check role access
    if (!item.roles.includes(userRole)) {
      return false;
    }

    // Check subscription requirements
    if (item.requiresSubscription && user) {
      return item.requiresSubscription.includes(subscriptionTier);
    }

    return true;
  });

  const getRoleDisplayName = (role: typeof userRole) => {
    const names = {
      guest: 'Guest',
      consumer: 'Customer',
      provider: 'Service Provider',
      admin: 'Administrator'
    };
    return names[role];
  };

  const getSubscriptionColor = (tier: typeof subscriptionTier) => {
    const colors = {
      starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      professional: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      enterprise: 'bg-gold-100 text-gold-700 dark:bg-gold-900 dark:text-gold-300'
    };
    return colors[tier] || 'bg-gray-100 text-gray-700';
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Loconomy</span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Right side: User menu or auth buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu 
                user={user} 
                userRole={userRole} 
                subscriptionTier={subscriptionTier}
                locale={locale}
              />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/auth/signin`}>Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/${locale}/auth/signup`}>Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="space-y-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// User menu component for authenticated users
function UserMenu({ 
  user, 
  userRole, 
  subscriptionTier,
  locale 
}: { 
  user: UserType; 
  userRole: ReturnType<typeof getUserRole>;
  subscriptionTier: ReturnType<typeof getUserSubscriptionTier>;
  locale: string;
}) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}/auth/signin`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-9">
          <div className="w-7 h-7 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium">{user.firstName || 'User'}</span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {getRoleDisplayName(userRole)}
              </span>
              {subscriptionTier !== 'starter' && (
                <Badge variant="secondary" className={`text-xs ${getSubscriptionColor(subscriptionTier)}`}>
                  {subscriptionTier === 'professional' && <Crown className="w-3 h-3 mr-1" />}
                  {subscriptionTier === 'enterprise' && <Zap className="w-3 h-3 mr-1" />}
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`} className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/settings`} className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {userRole === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/admin`} className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-red-600">
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
