"use client";

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RouteConfig {
  path: string;
  roles?: string[];
  redirectTo?: string;
  preload?: string[];
  analytics?: boolean;
  cache?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface UserFlow {
  from: string;
  to: string;
  count: number;
  avgTime: number;
}

class RouteOptimizerService {
  private static instance: RouteOptimizerService;
  private userFlows: Map<string, UserFlow> = new Map();
  private preloadedRoutes: Set<string> = new Set();
  private routeConfigs: RouteConfig[] = [];

  static getInstance(): RouteOptimizerService {
    if (!RouteOptimizerService.instance) {
      RouteOptimizerService.instance = new RouteOptimizerService();
    }
    return RouteOptimizerService.instance;
  }

  constructor() {
    this.initializeRouteConfigs();
    this.loadUserFlows();
  }

  private initializeRouteConfigs() {
    this.routeConfigs = [
      // High priority routes (most visited)
      { path: '/', priority: 'high', preload: ['/browse', '/booking'], analytics: true, cache: true },
      { path: '/browse', priority: 'high', preload: ['/booking'], analytics: true, cache: true },
      { path: '/booking', priority: 'high', analytics: true, cache: true },
      { path: '/dashboard', priority: 'high', analytics: true, cache: true },
      
      // AI features (growing in popularity)
      { path: '/agents', priority: 'medium', preload: ['/ai-listing-generator'], analytics: true },
      { path: '/ai-listing-generator', priority: 'medium', analytics: true },
      
      // User-specific routes
      { path: '/profile', priority: 'medium', analytics: true },
      { path: '/settings', priority: 'medium', analytics: true },
      { path: '/messages', priority: 'medium', analytics: true },
      { path: '/bookings', priority: 'medium', analytics: true },
      
      // Provider-only routes
      { 
        path: '/provider', 
        roles: ['provider'], 
        redirectTo: '/become-provider', 
        priority: 'medium',
        analytics: true 
      },
      { 
        path: '/provider/dashboard', 
        roles: ['provider'], 
        redirectTo: '/become-provider', 
        priority: 'medium' 
      },
      
      // Admin routes
      { 
        path: '/admin', 
        roles: ['admin'], 
        redirectTo: '/', 
        priority: 'low' 
      },
      
      // Authentication routes
      { path: '/auth/signin', priority: 'high', cache: true },
      { path: '/auth/signup', priority: 'high', cache: true },
      
      // Static/info pages
      { path: '/about', priority: 'low', cache: true },
      { path: '/help', priority: 'low', cache: true },
      { path: '/contact', priority: 'low', cache: true },
      { path: '/pricing', priority: 'medium', cache: true },
      { path: '/how-it-works', priority: 'medium', cache: true }
    ];
  }

  private loadUserFlows() {
    // Load from localStorage or analytics API
    try {
      const stored = localStorage.getItem('loconomy_user_flows');
      if (stored) {
        const flows = JSON.parse(stored);
        this.userFlows = new Map(flows);
      }
    } catch (error) {
      console.warn('Failed to load user flows:', error);
    }
  }

  private saveUserFlows() {
    try {
      localStorage.setItem('loconomy_user_flows', JSON.stringify([...this.userFlows]));
    } catch (error) {
      console.warn('Failed to save user flows:', error);
    }
  }

  // Track user navigation patterns
  trackNavigation(from: string, to: string, timeSpent: number) {
    const key = `${from}->${to}`;
    const existing = this.userFlows.get(key);
    
    if (existing) {
      existing.count++;
      existing.avgTime = (existing.avgTime + timeSpent) / 2;
    } else {
      this.userFlows.set(key, {
        from,
        to,
        count: 1,
        avgTime: timeSpent
      });
    }
    
    this.saveUserFlows();
  }

  // Get suggested next routes based on current path
  getSuggestedRoutes(currentPath: string, userRole?: string): string[] {
    const suggestions = new Set<string>();
    
    // Get routes from user flow patterns
    for (const [key, flow] of this.userFlows) {
      if (flow.from === currentPath && flow.count > 2) {
        suggestions.add(flow.to);
      }
    }
    
    // Get routes from config preloads
    const config = this.routeConfigs.find(c => c.path === currentPath);
    if (config?.preload) {
      config.preload.forEach(route => suggestions.add(route));
    }
    
    // Add role-based suggestions
    if (userRole) {
      const roleRoutes = this.routeConfigs
        .filter(c => c.roles?.includes(userRole))
        .map(c => c.path);
      roleRoutes.forEach(route => suggestions.add(route));
    }
    
    return Array.from(suggestions).slice(0, 5);
  }

  // Preload critical routes
  preloadRoutes(routes: string[]) {
    routes.forEach(route => {
      if (!this.preloadedRoutes.has(route)) {
        this.preloadedRoutes.add(route);
        
        // Create a link element for preloading
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
        
        // Preload route component if using dynamic imports
        this.preloadComponent(route);
      }
    });
  }

  private async preloadComponent(route: string) {
    try {
      // Map routes to component imports
      const componentMap: Record<string, () => Promise<any>> = {
        '/browse': () => import('@/app/[locale]/browse/page'),
        '/booking': () => import('@/app/[locale]/booking/page'),
        '/agents': () => import('@/app/[locale]/agents/page'),
        '/ai-listing-generator': () => import('@/app/[locale]/ai-listing-generator/page'),
        '/dashboard': () => import('@/app/[locale]/dashboard/page'),
        '/profile': () => import('@/app/[locale]/profile/page'),
        '/settings': () => import('@/app/[locale]/settings/page'),
      };
      
      const importFn = componentMap[route];
      if (importFn) {
        await importFn();
      }
    } catch (error) {
      console.warn(`Failed to preload component for ${route}:`, error);
    }
  }

  // Check if route is accessible for user
  canAccessRoute(path: string, userRole?: string): boolean {
    const config = this.routeConfigs.find(c => c.path === path);
    if (!config?.roles) return true;
    
    return userRole ? config.roles.includes(userRole) : false;
  }

  // Get redirect path for inaccessible routes
  getRedirectPath(path: string, userRole?: string): string | null {
    const config = this.routeConfigs.find(c => c.path === path);
    if (!config) return null;
    
    if (config.roles && (!userRole || !config.roles.includes(userRole))) {
      return config.redirectTo || '/';
    }
    
    return null;
  }

  // Get route priority for optimization
  getRoutePriority(path: string): 'high' | 'medium' | 'low' {
    const config = this.routeConfigs.find(c => c.path === path);
    return config?.priority || 'low';
  }

  // Get popular routes based on user flows
  getPopularRoutes(limit: number = 10): string[] {
    const routeCounts = new Map<string, number>();
    
    for (const flow of this.userFlows.values()) {
      routeCounts.set(flow.to, (routeCounts.get(flow.to) || 0) + flow.count);
    }
    
    return Array.from(routeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([route]) => route);
  }

  // Analytics: Get route performance metrics
  getRouteMetrics(path: string) {
    const flows = Array.from(this.userFlows.values()).filter(f => f.to === path);
    const totalVisits = flows.reduce((sum, f) => sum + f.count, 0);
    const avgTimeSpent = flows.length > 0 
      ? flows.reduce((sum, f) => sum + f.avgTime, 0) / flows.length 
      : 0;
    
    return {
      totalVisits,
      avgTimeSpent,
      commonSources: flows
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(f => ({ from: f.from, count: f.count }))
    };
  }
}

// React hook for route optimization
export function useRouteOptimizer() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const optimizer = useMemo(() => RouteOptimizerService.getInstance(), []);

  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Date.now() - startTime;
      if (timeSpent > 1000) { // Only track if user spent more than 1 second
        const previousPath = sessionStorage.getItem('loconomy_previous_path');
        if (previousPath && previousPath !== pathname) {
          optimizer.trackNavigation(previousPath, pathname, timeSpent);
        }
      }
      sessionStorage.setItem('loconomy_previous_path', pathname);
    };
  }, [pathname, optimizer]);

  // Preload suggested routes
  useEffect(() => {
    const suggestedRoutes = optimizer.getSuggestedRoutes(pathname, user?.role);
    if (suggestedRoutes.length > 0) {
      // Delay preloading to not interfere with current page load
      setTimeout(() => {
        optimizer.preloadRoutes(suggestedRoutes);
      }, 1000);
    }
  }, [pathname, user?.role, optimizer]);

  // Check route access and redirect if necessary
  useEffect(() => {
    if (!optimizer.canAccessRoute(pathname, user?.role)) {
      const redirectPath = optimizer.getRedirectPath(pathname, user?.role);
      if (redirectPath) {
        router.replace(redirectPath);
      }
    }
  }, [pathname, user?.role, router, optimizer]);

  return {
    getSuggestedRoutes: (path?: string) => 
      optimizer.getSuggestedRoutes(path || pathname, user?.role),
    preloadRoutes: (routes: string[]) => optimizer.preloadRoutes(routes),
    getPopularRoutes: () => optimizer.getPopularRoutes(),
    getRouteMetrics: (path?: string) => 
      optimizer.getRouteMetrics(path || pathname),
    canAccessRoute: (path: string) => 
      optimizer.canAccessRoute(path, user?.role),
    getRoutePriority: (path: string) => 
      optimizer.getRoutePriority(path)
  };
}

// React component for route optimization
export default function RouteOptimizer() {
  useRouteOptimizer();
  return null; // This component only handles route optimization logic
}
