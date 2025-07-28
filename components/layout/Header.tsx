"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  ChevronDown,
  Grid3X3,
  Star,
  MapPin,
  TrendingUp,
  Zap,
  Shield,
  ArrowRight,
  Plus,
  Bookmark,
  CreditCard,
  Users,
  Bot,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSub
} from "@/components/ui/dropdown-menu";
import AgentCommandInput from "@/components/ai/AgentCommandInput";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

interface HeaderProps {
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
}

const mainNavigation = [
  { 
    name: "Home", 
    href: "/", 
    icon: Home,
    description: "Return to homepage"
  },
  { 
    name: "Browse", 
    href: "/browse", 
    icon: Grid3X3,
    description: "Explore all services",
    submenu: [
      { name: "All Categories", href: "/browse", icon: Grid3X3 },
      { name: "Top Rated", href: "/browse?filter=top-rated", icon: Star },
      { name: "Trending", href: "/browse?filter=trending", icon: TrendingUp },
      { name: "Near You", href: "/browse?location=nearby", icon: MapPin },
    ]
  },
  { 
    name: "Services", 
    href: "#", 
    icon: Briefcase,
    description: "Service management",
    submenu: [
      { name: "Dashboard", href: "/dashboard", icon: Briefcase },
      { name: "My Bookings", href: "/bookings", icon: Calendar },
      { name: "Favorites", href: "/favorites", icon: Heart },
      { name: "Reviews", href: "/reviews", icon: Star },
    ]
  },
  { 
    name: "AI Tools", 
    href: "#", 
    icon: Bot,
    description: "AI-powered features",
    badge: "New",
    submenu: [
      { name: "AI Agents", href: "/agents", icon: Bot },
      { name: "Smart Search", href: "/ai-search", icon: Search },
      { name: "Auto Booking", href: "/ai-booking", icon: Zap },
      { name: "Price Optimizer", href: "/ai-pricing", icon: TrendingUp },
    ]
  },
];

const quickActions = [
  { name: "Book Service", href: "/booking", icon: Plus, gradient: "from-blue-500 to-purple-500" },
  { name: "Find Provider", href: "/providers", icon: Search, gradient: "from-green-500 to-teal-500" },
  { name: "AI Assistant", href: "/ai-chat", icon: Bot, gradient: "from-orange-500 to-red-500" },
];

export default function Header({ onSidebarToggle, isSidebarOpen }: HeaderProps) {
  const { user, isSignedIn, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 100], [16, 24]);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavItem = ({ item, index }: { item: typeof mainNavigation[0], index: number }) => {
    const isActive = pathname === item.href || 
      (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href));

    if (item.submenu) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 interactive-lift focus-visible-ring
                ${isActive
                  ? "glass-strong shadow-glow-ai text-ai-700 dark:text-ai-300 border border-ai-300 dark:border-ai-600"
                  : "glass-subtle hover:glass-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-glass-border-medium"
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs px-1.5 py-0.5">
                  {item.badge}
                </Badge>
              )}
              <ChevronDown className="w-3 h-3 opacity-50" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 glass-ultra border border-glass-border-strong shadow-glass-lg animate-spring-in"
            align="start"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                {item.description}
              </div>
              {item.submenu.map((subItem, subIndex) => (
                <DropdownMenuItem key={subIndex} asChild>
                  <Link 
                    href={subItem.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                      <subItem.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{subItem.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        href={item.href}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 interactive-lift focus-visible-ring
          ${isActive
            ? "glass-strong shadow-glow-ai text-ai-700 dark:text-ai-300 border border-ai-300 dark:border-ai-600"
            : "glass-subtle hover:glass-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-transparent hover:border-glass-border-medium"
          }
        `}
      >
        <item.icon className="w-4 h-4" />
        <span>{item.name}</span>
        {item.badge && (
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs px-1.5 py-0.5">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const ThemeToggle = () => {
    if (!mounted) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 neural-button interactive-lift focus-visible-ring opacity-50"
          disabled
        >
          <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />
        </Button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 neural-button interactive-lift focus-visible-ring"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="glass-ultra border border-glass-border-strong shadow-glass-lg animate-spring-in"
        >
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

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          backdropFilter: `blur(${headerBlur}px) saturate(1.4)`,
          WebkitBackdropFilter: `blur(${headerBlur}px) saturate(1.4)`,
        }}
        className={`
          fixed top-0 left-0 right-0 z-banner transition-all duration-300 theme-adaptive
          ${isScrolled
            ? 'glass-nav shadow-glass-lg border-b border-glass-border-medium'
            : 'glass-subtle border-b border-glass-border-subtle'
          }
        `}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo & Mobile Menu */}
            <div className="flex items-center gap-6">
              {/* Enhanced Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 lg:hidden neural-button interactive-lift focus-visible-ring"
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

              {/* Enhanced Premium Logo */}
              <Link href="/" className="flex items-center gap-3 group interactive-lift focus-visible-ring">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 8 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-2xl bg-gradient-ai neural-raised flex items-center justify-center shadow-glow-ai group-hover:shadow-glow-lg transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-gradient-holographic">
                    Loconomy
                  </span>
                  <div className="text-xs text-ai-600 dark:text-ai-400 -mt-1 font-medium">
                    Elite AI Services
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-2">
                {mainNavigation.map((item, index) => (
                  <NavItem key={item.name} item={item} index={index} />
                ))}
              </nav>
            </div>

            {/* Center Section: Search (Desktop) */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <AgentCommandInput
                placeholder="Search services, providers, or use AI commands..."
                currentPage={pathname}
                className="h-10 bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
              />
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-2">
              {/* Quick Actions (Desktop) */}
              <div className="hidden xl:flex items-center gap-1 mr-2">
                {quickActions.slice(0, 2).map((action, index) => (
                  <Button
                    key={action.name}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-9 px-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Link href={action.href} className="flex items-center gap-2">
                      <action.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{action.name}</span>
                    </Link>
                  </Button>
                ))}
              </div>

              {/* Search Toggle (Mobile) */}
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0 md:hidden rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              {isSignedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 relative rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    >
                      <Bell className="h-4 w-4" />
                      {notificationCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-5"
                        >
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-80 glass-ultra border border-glass-border-strong shadow-glass-lg animate-spring-in"
                  >
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2 space-y-2">
                      <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Booking Confirmed</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Your home cleaning is scheduled for tomorrow</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Star className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New Review</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">You received a 5-star review!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="w-full text-center justify-center">
                        View All Notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Theme Controls */}
              <div className="flex items-center gap-1">
                <ThemeToggle />
                {mounted && <ThemeSwitcher />}
              </div>

              {/* User Menu */}
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-xl">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.name || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-72 glass-ultra border border-glass-border-strong shadow-glass-lg animate-spring-in"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="" alt={user?.name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-medium">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name}</p>
                          <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                          <Badge variant="secondary" className="w-fit mt-1">
                            {user?.role || 'Consumer'}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="p-2 space-y-1">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <Briefcase className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          <span>My Bookings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <Heart className="w-4 h-4" />
                          <span>Favorites</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/billing" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <CreditCard className="w-4 h-4" />
                          <span>Billing</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />
                    
                    <div className="p-2 space-y-1">
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/help" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                          <HelpCircle className="w-4 h-4" />
                          <span>Help & Support</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />
                    
                    <div className="p-2">
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 px-3 py-2 rounded-lg"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="glass-interactive neural-button focus-visible-ring">
                    <Link href="/auth/signin">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild className="btn-ai-primary interactive-lift focus-visible-ring shadow-glow-ai">
                    <Link href="/auth/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-glass-border-medium glass-ultra p-4 md:hidden shadow-glass-sm"
            >
              <AgentCommandInput
                placeholder="Search services, providers, or use AI commands..."
                currentPage={pathname}
                onResponse={() => setIsSearchOpen(false)}
                className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content overlap */}
      <div className="h-16" />
    </>
  );
}
