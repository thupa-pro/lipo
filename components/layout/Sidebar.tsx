"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Briefcase,
  MessageCircle,
  Calendar,
  Heart,
  Settings,
  HelpCircle,
  Users,
  TrendingUp,
  MapPin,
  CreditCard,
  FileText,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Zap,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  // Dynamic navigation based on user role
  const getNavigation = (): NavItem[] => {
    const baseNavigation: NavItem[] = [
      { name: "Home", href: "/", icon: Home },
      { name: "Search", href: "/search", icon: Search },
    ];

    if (!isSignedIn) {
      return [
        ...baseNavigation,
        { name: "Sign In", href: "/auth/signin", icon: Users },
        { name: "Sign Up", href: "/auth/signup", icon: Users },
      ];
    }

    const userRole = user?.role?.toLowerCase();
    
    if (userRole === "customer") {
      return [
        ...baseNavigation,
        { name: "Dashboard", href: "/customer/dashboard", icon: Briefcase },
        { name: "My Bookings", href: "/customer/bookings", icon: Calendar, badge: 2 },
        { name: "Messages", href: "/messages", icon: MessageCircle, badge: 3 },
        { name: "Favorites", href: "/favorites", icon: Heart },
        {
          name: "Account",
          href: "#",
          icon: Settings,
          children: [
            { name: "Profile", href: "/profile", icon: Users },
            { name: "Payment Methods", href: "/payment-methods", icon: CreditCard },
            { name: "Security", href: "/security", icon: Shield },
            { name: "Notifications", href: "/notification-settings", icon: Settings },
          ],
        },
        { name: "Help & Support", href: "/help", icon: HelpCircle },
      ];
    }

    if (userRole === "provider") {
      return [
        ...baseNavigation,
        { name: "Dashboard", href: "/provider/dashboard", icon: Briefcase },
        {
          name: "Business",
          href: "#",
          icon: TrendingUp,
          children: [
            { name: "My Services", href: "/provider/services", icon: Star },
            { name: "Bookings", href: "/provider/bookings", icon: Calendar, badge: 5 },
            { name: "Availability", href: "/provider/availability", icon: Calendar },
            { name: "Analytics", href: "/provider/analytics", icon: BarChart3 },
          ],
        },
        { name: "Messages", href: "/messages", icon: MessageCircle, badge: 7 },
        {
          name: "Financials",
          href: "#",
          icon: CreditCard,
          children: [
            { name: "Earnings", href: "/provider/earnings", icon: TrendingUp },
            { name: "Payouts", href: "/provider/payouts", icon: CreditCard },
            { name: "Tax Documents", href: "/provider/tax", icon: FileText },
          ],
        },
        {
          name: "Account",
          href: "#",
          icon: Settings,
          children: [
            { name: "Profile", href: "/profile", icon: Users },
            { name: "Verification", href: "/verification", icon: Shield },
            { name: "Settings", href: "/settings", icon: Settings },
          ],
        },
        { name: "Help & Support", href: "/help", icon: HelpCircle },
      ];
    }

    if (userRole === "admin") {
      return [
        ...baseNavigation,
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: Briefcase },
        {
          name: "Platform Management",
          href: "#",
          icon: Settings,
          children: [
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Providers", href: "/admin/providers", icon: Star },
            { name: "Services", href: "/admin/services", icon: MapPin },
            { name: "Bookings", href: "/admin/bookings", icon: Calendar },
            { name: "Disputes", href: "/admin/disputes", icon: Shield },
          ],
        },
        {
          name: "Analytics",
          href: "#",
          icon: BarChart3,
          children: [
            { name: "Revenue", href: "/admin/revenue", icon: TrendingUp },
            { name: "Platform Metrics", href: "/admin/metrics", icon: BarChart3 },
            { name: "User Insights", href: "/admin/insights", icon: Users },
          ],
        },
        { name: "AI Management", href: "/admin/ai", icon: Zap },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ];
    }

    return baseNavigation;
  };

  const navigation = getNavigation();

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const isActive = pathname === item.href || 
      (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href));
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;

    const handleClick = () => {
      if (hasChildren) {
        toggleExpanded(item.name);
      } else if (onClose) {
        onClose();
      }
    };

    return (
      <div>
        {hasChildren ? (
          <Button
            variant="ghost"
            className={`w-full justify-start h-10 px-3 ${
              level > 0 ? "ml-4" : ""
            } ${isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
            onClick={handleClick}
          >
            <item.icon className={`h-4 w-4 ${level > 0 ? "mr-2" : "mr-3"}`} />
            <span className="flex-1 text-left">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto mr-2 h-5 px-1.5 text-xs">
                {item.badge}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={`w-full justify-start h-10 px-3 ${
              level > 0 ? "ml-4" : ""
            } ${isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
            asChild
            onClick={handleClick}
          >
            <Link href={item.href}>
              <item.icon className={`h-4 w-4 ${level > 0 ? "mr-2" : "mr-3"}`} />
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </Button>
        )}

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children?.map((child) => (
                  <NavItemComponent key={child.name} item={child} level={level + 1} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:relative md:top-0 md:h-[calc(100vh-4rem)] md:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* User Info Section */}
          {isSignedIn && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.role?.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navigation.map((item, index) => (
                <div key={item.name}>
                  <NavItemComponent item={item} />
                  {/* Add separator after main sections */}
                  {(index === 1 || 
                    (isSignedIn && (index === navigation.length - 2))) && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium">Loconomy v2.0</p>
              <p>AI-First Local Economy</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
