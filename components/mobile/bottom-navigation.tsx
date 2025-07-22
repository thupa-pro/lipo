"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  Search,
  User,
  Settings,
  Bell,
  Compass,
  LifeBuoy,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  color?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    href: "/",
    color: "text-blue-600 dark:text-cyan-400",
  },
  {
    id: "explore",
    label: "Explore",
    icon: Search,
    href: "/browse",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/dashboard?tab=messages",
    badge: 2,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    href: "/profile",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-600 dark:text-gray-400",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const currentItem = navigationItems.find((item) => {
      if (item.href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(item.href);
    });
    if (currentItem) {
      setActiveTab(currentItem.id);
    }
  }, [pathname]);

  const handleNavigation = (item: NavigationItem) => {
    setActiveTab(item.id);
    router.push(item.href);

    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div className="glass-ultra border-t border-border/20 px-2 py-2">
          <nav className="flex items-center justify-around max-w-lg mx-auto">
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-3 py-2 h-auto min-w-0 transition-all duration-300",
                    isActive
                      ? "text-primary scale-110"
                      : "text-muted-foreground hover:text-primary/80",
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-all duration-300",
                        isActive && "drop-shadow-sm",
                      )}
                    />
                    {item.badge && item.badge > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-sm -z-10" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-70",
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full" />
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom padding to prevent content overlap */}
      <div className="h-20 md:h-0" />
    </>
  );
}
