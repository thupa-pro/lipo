// Role-Aware Navigation for Loconomy Platform
// Adapts navigation based on user role and subscription tier

import Link from 'next/link';
import { User } from '@/types/rbac';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Sparkles, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Crown,
  Shield,
  BarChart3,
  Calendar,
  MapPin,
  MessageSquare,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { getUserRole, getUserSubscriptionTier, getInitials } from '@/lib/rbac/utils';

interface RoleAwareNavigationProps {
  user: User | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: Array<'guest' | 'consumer' | 'provider' | 'admin'>;
  requiresSubscription?: Array<'starter' | 'professional' | 'enterprise'>;
}

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
  const userRole = getUserRole(user);
  const subscriptionTier = getUserSubscriptionTier(user);

  // Filter navigation items based on user role and subscription
  const visibleNavItems = NAVIGATION_ITEMS.filter(item => {
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
      free: 'bg-gray-100 text-gray-700',
      starter: 'bg-blue-100 text-blue-700',
      professional: 'bg-purple-100 text-purple-700',
      enterprise: 'bg-gold-100 text-gold-700'
    };
    return colors[tier] || colors.free;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Loconomy
                </span>
                <div className="text-xs text-muted-foreground -mt-1">
                  AI-Powered Platform
                </div>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-6 ml-6">
              {visibleNavItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications (for authenticated users) */}
            {user && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            )}

            {/* User menu or auth buttons */}
            {user ? (
              <UserMenu user={user} userRole={userRole} subscriptionTier={subscriptionTier} />
            ) : (
              <GuestActions />
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
  subscriptionTier 
}: { 
  user: User; 
  userRole: ReturnType<typeof getUserRole>;
  subscriptionTier: ReturnType<typeof getUserSubscriptionTier>;
}) {
  const getRoleIcon = (role: typeof userRole) => {
    const icons = {
      guest: UserIcon,
      consumer: UserIcon,
      provider: Crown,
      admin: Shield
    };
    return icons[role];
  };

  const RoleIcon = getRoleIcon(userRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.email} alt={user.email} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <RoleIcon className="w-4 h-4" />
              <p className="text-sm font-medium leading-none">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
              {subscriptionTier !== 'free' && (
                <Badge className={`text-xs ${subscriptionTier === 'enterprise' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>
        
        {userRole === 'provider' && (
          <DropdownMenuItem asChild>
            <Link href="/subscription" className="flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Subscription
              {subscriptionTier === 'free' && (
                <Badge variant="outline" className="text-xs ml-auto">
                  Upgrade
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="text-red-600 focus:text-red-600" asChild>
          <Link href="/auth/signout" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Guest actions component for unauthenticated users
function GuestActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
        <Link href="/auth/signup">Get Started</Link>
      </Button>
    </div>
  );
}
