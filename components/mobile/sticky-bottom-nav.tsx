import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  activePattern?: RegExp;
}

interface StickyBottomNavProps {
  className?: string;
  unreadMessages?: number;
  pendingBookings?: number;
  userRole?: "seeker" | "provider" | "admin";
}

export function StickyBottomNav({ 
  className, 
  unreadMessages = 0, 
  pendingBookings = 0,
  userRole = "seeker" 
}: StickyBottomNavProps) {
  const pathname = usePathname();

  // Different nav items based on user role
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      {
        id: "home",
        label: "Home",
        href: "/",
        icon: Home,
        activePattern: /^\/$/
      },
      {
        id: "explore",
        label: "Explore",
        href: "/browse",
        icon: Search,
        activePattern: /^\/browse/
      },
      {
        id: "inbox",
        label: "Inbox",
        href: "/chat",
        icon: MessageCircle,
        badge: unreadMessages,
        activePattern: /^\/chat|\/messages/
      }
    ];

    if (userRole === "provider") {
      baseItems.splice(2, 0, {
        id: "bookings",
        label: "Bookings",
        href: "/dashboard/bookings",
        icon: Calendar,
        badge: pendingBookings,
        activePattern: /^\/dashboard\/bookings/
      });
    }

    baseItems.push({
      id: "profile",
      label: "Profile",
      href: "/profile",
      icon: User,
      activePattern: /^\/profile|\/settings/
    });

    return baseItems;
  };

  const navItems = getNavItems();

  const isActive = (item: NavItem) => {
    if (item.activePattern) {
      return item.activePattern.test(pathname);
    }
    return pathname === item.href;
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border",
      "safe-area-bottom", // For devices with home indicator
      className
    )}>
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const active = isActive(item);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                "min-w-0 flex-1 max-w-[80px]", // Prevent items from being too wide
                "active:scale-95", // Touch feedback
                active 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {/* Badge for notifications */}
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-5"
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </Badge>
              )}

              {/* Icon */}
              <item.icon className={cn(
                "w-6 h-6 transition-all duration-200",
                active && "scale-110"
              )} />

              {/* Label */}
              <span className={cn(
                "text-xs font-medium truncate w-full text-center",
                active && "font-semibold"
              )}>
                {item.label}
              </span>

              {/* Active indicator */}
              {active && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}

// Hook to determine if bottom nav should be shown
export function useShouldShowBottomNav() {
  const pathname = usePathname();
  
  // Hide on certain pages
  const hiddenRoutes = [
    '/auth/',
    '/onboarding',
    '/admin',
    '/error',
    '/404'
  ];

  return !hiddenRoutes.some(route => pathname.startsWith(route));
}