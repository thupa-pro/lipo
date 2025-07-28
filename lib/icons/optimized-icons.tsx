import { lazy, ComponentType, SVGProps } from 'react';
import { LucideProps } from 'lucide-react';

// Type for Lucide icon components
type IconComponent = ComponentType<LucideProps>;

// Lazy-loaded icon map for better tree-shaking
const iconMap = {
  // Common icons
  ArrowRight: lazy(() => import('lucide-react').then(mod => ({ default: mod.ArrowRight }))),
  ArrowLeft: lazy(() => import('lucide-react').then(mod => ({ default: mod.ArrowLeft }))),
  Search: lazy(() => import('lucide-react').then(mod => ({ default: mod.Search }))),
  Menu: lazy(() => import('lucide-react').then(mod => ({ default: mod.Menu }))),
  X: lazy(() => import('lucide-react').then(mod => ({ default: mod.X }))),
  Plus: lazy(() => import('lucide-react').then(mod => ({ default: mod.Plus }))),
  Minus: lazy(() => import('lucide-react').then(mod => ({ default: mod.Minus }))),
  
  // Navigation icons
  Home: lazy(() => import('lucide-react').then(mod => ({ default: mod.Home }))),
  User: lazy(() => import('lucide-react').then(mod => ({ default: mod.User }))),
  Users: lazy(() => import('lucide-react').then(mod => ({ default: mod.Users }))),
  Settings: lazy(() => import('lucide-react').then(mod => ({ default: mod.Settings }))),
  
  // Business icons
  Briefcase: lazy(() => import('lucide-react').then(mod => ({ default: mod.Briefcase }))),
  MapPin: lazy(() => import('lucide-react').then(mod => ({ default: mod.MapPin }))),
  Calendar: lazy(() => import('lucide-react').then(mod => ({ default: mod.Calendar }))),
  Clock: lazy(() => import('lucide-react').then(mod => ({ default: mod.Clock }))),
  
  // UI icons
  CheckCircle: lazy(() => import('lucide-react').then(mod => ({ default: mod.CheckCircle }))),
  AlertTriangle: lazy(() => import('lucide-react').then(mod => ({ default: mod.AlertTriangle }))),
  Info: lazy(() => import('lucide-react').then(mod => ({ default: mod.Info }))),
  Loader2: lazy(() => import('lucide-react').then(mod => ({ default: mod.Loader2 }))),
  
  // Social icons
  Mail: lazy(() => import('lucide-react').then(mod => ({ default: mod.Mail }))),
  Phone: lazy(() => import('lucide-react').then(mod => ({ default: mod.Phone }))),
  MessageSquare: lazy(() => import('lucide-react').then(mod => ({ default: mod.MessageSquare }))),
  
  // Business specific
  DollarSign: lazy(() => import('lucide-react').then(mod => ({ default: mod.DollarSign }))),
  TrendingUp: lazy(() => import('lucide-react').then(mod => ({ default: mod.TrendingUp }))),
  BarChart3: lazy(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 }))),
  
  // Special effects
  Sparkles: lazy(() => import('lucide-react').then(mod => ({ default: mod.Sparkles }))),
  Star: lazy(() => import('lucide-react').then(mod => ({ default: mod.Star }))),
  Heart: lazy(() => import('lucide-react').then(mod => ({ default: mod.Heart }))),
  
  // Security
  Shield: lazy(() => import('lucide-react').then(mod => ({ default: mod.Shield }))),
  Lock: lazy(() => import('lucide-react').then(mod => ({ default: mod.Lock }))),
  
  // Media
  Upload: lazy(() => import('lucide-react').then(mod => ({ default: mod.Upload }))),
  Download: lazy(() => import('lucide-react').then(mod => ({ default: mod.Download }))),
  Image: lazy(() => import('lucide-react').then(mod => ({ default: mod.Image }))),
  
  // Actions
  Save: lazy(() => import('lucide-react').then(mod => ({ default: mod.Save }))),
  Copy: lazy(() => import('lucide-react').then(mod => ({ default: mod.Copy }))),
  Edit: lazy(() => import('lucide-react').then(mod => ({ default: mod.Edit }))),
  Trash: lazy(() => import('lucide-react').then(mod => ({ default: mod.Trash }))),
} as const;

export type IconName = keyof typeof iconMap;

interface OptimizedIconProps extends LucideProps {
  name: IconName;
  fallback?: ComponentType<SVGProps<SVGSVGElement>>;
}

// Loading fallback component
const IconSkeleton = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    className={`animate-pulse ${className}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <rect width="24" height="24" rx="2" fill="currentColor" opacity="0.2" />
  </svg>
);

// Optimized icon component with lazy loading
export const OptimizedIcon = ({ 
  name, 
  fallback: Fallback = IconSkeleton, 
  ...props 
}: OptimizedIconProps) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in optimized icon map`);
    return <Fallback {...props} />;
  }

  return (
    <IconComponent 
      {...props}
      // Add default loading state
      onError={() => console.warn(`Failed to load icon: ${name}`)}
    />
  );
};

// Pre-built icon sets for common use cases
export const NavigationIcons = {
  Home: (props: LucideProps) => <OptimizedIcon name="Home" {...props} />,
  User: (props: LucideProps) => <OptimizedIcon name="User" {...props} />,
  Search: (props: LucideProps) => <OptimizedIcon name="Search" {...props} />,
  Menu: (props: LucideProps) => <OptimizedIcon name="Menu" {...props} />,
  Settings: (props: LucideProps) => <OptimizedIcon name="Settings" {...props} />,
};

export const BusinessIcons = {
  MapPin: (props: LucideProps) => <OptimizedIcon name="MapPin" {...props} />,
  Calendar: (props: LucideProps) => <OptimizedIcon name="Calendar" {...props} />,
  Briefcase: (props: LucideProps) => <OptimizedIcon name="Briefcase" {...props} />,
  DollarSign: (props: LucideProps) => <OptimizedIcon name="DollarSign" {...props} />,
};

export const UIIcons = {
  ArrowRight: (props: LucideProps) => <OptimizedIcon name="ArrowRight" {...props} />,
  ArrowLeft: (props: LucideProps) => <OptimizedIcon name="ArrowLeft" {...props} />,
  CheckCircle: (props: LucideProps) => <OptimizedIcon name="CheckCircle" {...props} />,
  AlertTriangle: (props: LucideProps) => <OptimizedIcon name="AlertTriangle" {...props} />,
  Loader2: (props: LucideProps) => <OptimizedIcon name="Loader2" {...props} />,
};

// Utility function to preload icons
export const preloadIcons = (iconNames: IconName[]) => {
  iconNames.forEach(name => {
    if (iconMap[name]) {
      // Trigger the lazy import
      iconMap[name];
    }
  });
};

// Hook for commonly used icons (preload on mount)
export const useCommonIcons = () => {
  const commonIcons: IconName[] = [
    'ArrowRight', 'ArrowLeft', 'Search', 'Menu', 'X',
    'Home', 'User', 'CheckCircle', 'Loader2'
  ];
  
  // Preload common icons
  preloadIcons(commonIcons);
  
  return {
    NavigationIcons,
    BusinessIcons,
    UIIcons,
  };
};

export default OptimizedIcon;