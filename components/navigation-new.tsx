"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Search,
  Home,
  Briefcase,
  Sun,
  Moon,
  BarChart3,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Add authenticated nav items
  const authenticatedNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const ThemeToggle = () => {
    if (!mounted) return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  };

  // Don't render until Clerk is loaded
  if (!isLoaded) {
    return null;
  }

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
          <Link
            href="/"
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black rounded-2xl"
            aria-label="Loconomy home"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-violet-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-black text-lg">L</span>
              </div>
            </div>
            <div>
              <span className="font-black text-xl bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:via-violet-200 dark:to-white bg-clip-text text-transparent">
                Loconomy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-2"
            role="navigation"
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                size="sm"
                asChild
                className={`h-10 px-6 rounded-2xl transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                    : "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105"
                }`}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2"
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </Link>
              </Button>
            ))}
            {isSignedIn &&
              authenticatedNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={`h-10 px-6 rounded-2xl transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                      : "bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2"
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                </Button>
              ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {/* User Authentication */}
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-10 w-10 border-2 border-violet-500/50 shadow-lg rounded-2xl",
                    userButtonPopoverCard:
                      "bg-white/95 dark:bg-black/95 backdrop-blur-xl border-slate-200/50 dark:border-white/20 shadow-2xl rounded-3xl",
                  },
                }}
                afterSignOutUrl="/"
              />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-4 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 rounded-2xl"
                  asChild
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="h-10 px-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 border-slate-800 text-white"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-violet-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-xl">L</span>
                      </div>
                      <div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
                          Loconomy
                        </span>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 space-y-2" role="navigation">
                      {navItems.map((item) => (
                        <Button
                          key={item.href}
                          variant="ghost"
                          className="justify-start h-12 w-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 rounded-2xl mb-2"
                          asChild
                          onClick={() => setIsMenuOpen(false)}
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
                      {isSignedIn &&
                        authenticatedNavItems.map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="justify-start h-12 w-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 rounded-2xl mb-2"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
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

                      {!isSignedIn && (
                        <div className="border-t border-white/10 pt-4 space-y-2">
                          <Button
                            variant="ghost"
                            className="justify-start h-12 w-full bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 rounded-2xl mb-2"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/auth/signin">Sign In</Link>
                          </Button>
                          <Button
                            className="justify-start h-12 w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl"
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link href="/auth/signup">Sign Up</Link>
                          </Button>
                        </div>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
