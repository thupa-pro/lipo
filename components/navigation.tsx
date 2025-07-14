"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  Home,
  Briefcase,
  CreditCard,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  MapPin,
  Sparkles,
  Zap,
  Brain,
  Shield,
  Activity,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to close mobile menu
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/browse", label: "Services", icon: Search },
    { href: "/request-service", label: "Request", icon: Briefcase },
  ];

  // Mock user data
  const user = {
    name: "Alex Chen",
    email: "alex@neural.com",
    avatar: "/placeholder.svg?height=32&width=32",
    isAdmin: true,
    plan: "Neural Pro",
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const ThemeToggle = () => {
    if (!mounted) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
          disabled
        >
          <Sun className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      );
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
      >
        <Sun className="h-4 w-4 text-slate-600 dark:text-slate-300 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 text-slate-600 dark:text-slate-300 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };

  const handleLogout = async () => {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      variant: "default",
    });
    router.push("/auth/signin");
  };

  const handleNotificationsClick = () => {
    setNotifications(0);
    toast({
      title: "Notifications",
      description: "Viewing your latest notifications.",
      variant: "default",
    });
  };

  return (
    <header
      role="banner"
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-area-inset-top ${
        isScrolled
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-xl shadow-2xl border-b border-slate-200/50 dark:border-white/10"
          : "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200/30 dark:border-white/5"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F9b6a94f5ad4e4f5da77763a1b642522a%2F3e1a76e9d75d4b80aa493462f16bc984?format=webp&width=800"
                alt="Loconomy"
                className="w-10 h-10 rounded-2xl shadow-lg group-hover:shadow-violet-500/50 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse status-neural-active"></div>
            </div>
            <div>
              <span className="font-black text-xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Loconomy
              </span>
              <div className="flex items-center gap-1 -mt-1">
                <Sparkles className="w-3 h-3 text-blue-500 dark:text-violet-400 animate-pulse" />
                <span className="text-xs text-blue-600 dark:text-violet-300 font-medium">
                  AI-Powered
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                asChild
                className={`h-10 px-6 rounded-2xl transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 text-white shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-violet-500/30 hover:scale-105"
                    : "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105"
                }`}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
            {user.isAdmin && (
              <Button
                variant={isActive("/admin") ? "default" : "ghost"}
                size="sm"
                asChild
                className={`h-10 px-6 rounded-2xl transition-all duration-300 ${
                  isActive("/admin")
                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-105"
                    : "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105"
                }`}
              >
                <Link href="/admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Location */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex items-center gap-2 h-10 px-4 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 rounded-2xl"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Global
              </span>
            </Button>

            <ThemeToggle />

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
              onClick={handleNotificationsClick}
            >
              <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-violet-500 to-purple-500 text-white border-2 border-black animate-pulse shadow-lg">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-2xl p-0 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Avatar className="h-8 w-8 border-2 border-violet-500/50 shadow-lg">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black animate-pulse" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-3xl border-slate-200/50 dark:border-white/20 shadow-2xl"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-violet-500/50">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {user.name}
                        </p>
                        <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs">
                          {user.plan}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {[
                  { href: "/dashboard", label: "Dashboard", icon: Activity },
                  { href: "/profile", label: "Profile", icon: User },
                  {
                    href: "/my-bookings",
                    label: "My Bookings",
                    icon: Briefcase,
                  },
                  { href: "/payments", label: "Payments", icon: CreditCard },
                  { href: "/settings", label: "Settings", icon: Settings },
                  { href: "/help", label: "Help Center", icon: HelpCircle },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-slate-700 dark:text-white cursor-pointer hover:bg-slate-500/10 dark:hover:bg-white/10 transition-colors m-1 rounded-2xl p-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-slate-200/50 dark:border-white/10"
              >
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b border-white/10">
                    <Avatar className="h-12 w-12 border-2 border-violet-500/50">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs">
                        {user.plan}
                      </Badge>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={`justify-start h-12 rounded-2xl transition-all duration-300 ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-violet-600 dark:to-purple-600 text-white shadow-lg"
                            : "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                        }`}
                        asChild
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </Button>
                    ))}

                    <div className="border-t border-white/10 pt-4">
                      {[
                        {
                          href: "/dashboard",
                          label: "Dashboard",
                          icon: Activity,
                        },
                        { href: "/profile", label: "Profile", icon: User },
                        {
                          href: "/my-bookings",
                          label: "My Bookings",
                          icon: Briefcase,
                        },
                        {
                          href: "/payments",
                          label: "Payments",
                          icon: CreditCard,
                        },
                        {
                          href: "/settings",
                          label: "Settings",
                          icon: Settings,
                        },
                        {
                          href: "/help",
                          label: "Help Center",
                          icon: HelpCircle,
                        },
                      ].map((item) => (
                        <Button
                          key={item.href}
                          variant="ghost"
                          className="justify-start h-12 w-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 rounded-2xl mb-2"
                          asChild
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        </Button>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <Button
                        variant="ghost"
                        className="justify-start text-slate-700 dark:text-white w-full hover:bg-slate-500/10 dark:hover:bg-white/10 transition-colors rounded-2xl h-12"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
