"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Settings,
  LogOut,
  Sparkles,
  Home,
  Briefcase,
  MessageCircle,
  Calendar,
  Heart,
  HelpCircle,
  User,
  ChevronRight,
  Zap,
  Brain,
  BarChart3,
  Shield,
  Globe,
  Star,
  CreditCard,
  Users,
  FileText,
  MapPin,
  Building,
  Award,
  Rocket,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import AgentCommandInput from "@/components/ai/AgentCommandInput";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  description?: string;
  category?: 'main' | 'ai' | 'business' | 'account';
  roles?: string[];
}

interface EnhancedNavigationProps {
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

const navigationItems: NavigationItem[] = [
  // Main Navigation
  { name: "Home", href: "/", icon: Home, category: 'main', description: "Dashboard and overview" },
  { name: "Browse Services", href: "/browse", icon: Search, category: 'main', description: "Find services and providers" },
  { name: "Book Services", href: "/booking", icon: Calendar, category: 'main', description: "Schedule appointments" },
  { name: "Messages", href: "/messages", icon: MessageCircle, category: 'main', badge: "3", description: "Chat with providers" },
  
  // AI Features
  { name: "AI Agents", href: "/agents", icon: Brain, category: 'ai', badge: "New", description: "Manage AI assistants" },
  { name: "AI Listing Generator", href: "/ai-listing-generator", icon: Sparkles, category: 'ai', description: "Create listings with AI" },
  { name: "Smart Analytics", href: "/analytics", icon: BarChart3, category: 'ai', description: "AI-powered insights" },
  
  // Business Tools
  { name: "Dashboard", href: "/dashboard", icon: Briefcase, category: 'business', description: "Business overview" },
  { name: "Become Provider", href: "/become-provider", icon: Building, category: 'business', description: "Join as service provider" },
  { name: "Provider Dashboard", href: "/provider", icon: Award, category: 'business', roles: ['provider'], description: "Manage your services" },
  { name: "Payments", href: "/payments", icon: CreditCard, category: 'business', description: "Payment management" },
  { name: "Growth Engine", href: "/growth-engine", icon: Rocket, category: 'business', description: "Business growth tools" },
  
  // Account
  { name: "Profile", href: "/profile", icon: User, category: 'account', description: "Personal information" },
  { name: "Settings", href: "/settings", icon: Settings, category: 'account', description: "Account preferences" },
  { name: "Bookings", href: "/bookings", icon: Calendar, category: 'account', description: "Your appointments" },
  { name: "Favorites", href: "/favorites", icon: Heart, category: 'account', description: "Saved services" },
  { name: "Help", href: "/help", icon: HelpCircle, category: 'account', description: "Support and guides" }
];

export default function EnhancedNavigation({ onSidebarToggle, isSidebarOpen }: EnhancedNavigationProps) {
  const { user, isSignedIn, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter navigation items based on user role and context
  const getFilteredNavigation = () => {
    const userRole = user?.role?.toLowerCase();
    return navigationItems.filter(item => {
      if (item.roles && userRole) {
        return item.roles.includes(userRole);
      }
      return true;
    });
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', href: '/' }];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const navItem = navigationItems.find(item => item.href === currentPath);
      breadcrumbs.push({
        name: navItem?.name || path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' '),
        href: currentPath
      });
    });
    
    return breadcrumbs;
  };

  // Get current page info
  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find(item => 
      pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
    );
    return currentItem || { name: 'Page', icon: FileText, description: 'Current page' };
  };

  const categorizedNavigation = {
    main: getFilteredNavigation().filter(item => item.category === 'main'),
    ai: getFilteredNavigation().filter(item => item.category === 'ai'),
    business: getFilteredNavigation().filter(item => item.category === 'business'),
    account: getFilteredNavigation().filter(item => item.category === 'account'),
  };

  const breadcrumbs = generateBreadcrumbs();
  const currentPage = getCurrentPageInfo();

  const ThemeToggle = () => {
    if (!mounted) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 glass-subtle border-white/40">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-ultra border-white/40">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const QuickMenu = () => (
    <DropdownMenu open={isQuickMenuOpen} onOpenChange={setIsQuickMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="glass-subtle border-white/40 hover:border-blue-300/50">
          <Zap className="w-4 h-4 mr-2" />
          Quick Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 glass-ultra border-white/40" align="end">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Quick Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(categorizedNavigation).map(([category, items]) => {
          if (items.length === 0) return null;
          
          const categoryIcons = {
            main: Home,
            ai: Brain,
            business: Building,
            account: User
          };
          
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          
          return (
            <DropdownMenuGroup key={category}>
              <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <CategoryIcon className="w-3 h-3" />
                {category}
              </DropdownMenuLabel>
              {items.slice(0, 4).map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full glass-ultra border-b border-white/20 backdrop-blur-xl"
      >
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
          {/* Left Section: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 md:hidden glass-subtle border-white/40"
              onClick={onSidebarToggle}
            >
              <AnimatePresence mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Loconomy
              </span>
              <Badge variant="outline" className="glass-subtle border-white/40 text-xs">
                Elite
              </Badge>
            </Link>
          </div>

          {/* Center Section: Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {categorizedNavigation.main.slice(0, 4).map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href));
              
              return (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "glass-strong text-blue-700 shadow-md"
                        : "glass-subtle hover:glass-strong text-gray-700 dark:text-gray-300 hover:text-blue-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Right Section: Search, Actions, Profile */}
          <div className="flex items-center gap-3">
            {/* Search Toggle (Mobile) */}
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 lg:hidden glass-subtle border-white/40"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:block w-80">
              <AgentCommandInput
                placeholder="Search or use /commands..."
                currentPage={pathname}
                className="h-9 glass-subtle border-white/40"
              />
            </div>

            {/* Quick Menu */}
            <div className="hidden md:block">
              <QuickMenu />
            </div>

            {/* Notifications */}
            {isSignedIn && (
              <div className="relative">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 glass-subtle border-white/40">
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs text-white font-bold">{notificationCount}</span>
                    </motion.div>
                  )}
                </Button>
              </div>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                      <AvatarImage src="" alt={user?.name || ""} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 glass-ultra border-white/40" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <Badge variant="outline" className="w-fit mt-2">
                        {user?.role || 'User'}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    {categorizedNavigation.account.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href} className="w-full flex items-center gap-3">
                          <item.icon className="mr-2 h-4 w-4" />
                          <div className="flex-1">
                            <span>{item.name}</span>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="glass-subtle border-white/40">
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/20 glass-ultra p-4 lg:hidden"
            >
              <AgentCommandInput
                placeholder="Search or use /commands..."
                currentPage={pathname}
                onResponse={() => setIsSearchOpen(false)}
                className="glass-subtle border-white/40"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 1 && (
        <motion.div
          className="glass-subtle border-b border-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="container max-w-screen-2xl px-6 py-3">
            <div className="flex items-center justify-between">
              <nav className="flex items-center space-x-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-medium text-gray-900 dark:text-white">
                        {crumb.name}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              
              <div className="flex items-center gap-2">
                <currentPage.icon className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentPage.description}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
