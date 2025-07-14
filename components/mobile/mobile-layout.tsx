"use client";

import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./mobile-header";
import { BottomNavigation } from "./bottom-navigation";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  headerTitle?: string;
  headerTransparent?: boolean;
  className?: string;
}

export function MobileLayout({
  children,
  showHeader = true,
  showBottomNav = true,
  headerTitle,
  headerTransparent = false,
  className,
}: MobileLayoutProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Set viewport meta tag for mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
      );
    }

    // Set theme color for mobile browsers
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement("meta");
      themeColor.setAttribute("name", "theme-color");
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute("content", "#1A2A44");

    // Add mobile-specific CSS custom properties
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`,
    );

    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground overflow-x-hidden",
        "mobile-layout",
        className,
      )}
    >
      {/* Mobile Header */}
      {showHeader && (
        <MobileHeader title={headerTitle} transparent={headerTransparent} />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1",
          showHeader && "pt-safe-area-header",
          showBottomNav && "pb-safe-area-bottom",
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}

      {/* Mobile-specific styles */}
      <style jsx global>{`
        .mobile-layout {
          /* Safe area handling for iOS */
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        .safe-area-pt {
          padding-top: env(safe-area-inset-top);
        }

        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }

        .safe-area-header {
          margin-top: calc(env(safe-area-inset-top) + 4rem);
        }

        .safe-area-bottom {
          margin-bottom: calc(env(safe-area-inset-bottom) + 5rem);
        }

        /* Prevent overscroll bounce on iOS */
        .mobile-layout {
          overscroll-behavior: contain;
        }

        /* Hide scrollbars on mobile */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Enhanced touch targets */
        .mobile-layout button,
        .mobile-layout a {
          min-height: 44px;
          min-width: 44px;
        }

        /* Smooth scrolling */
        .mobile-layout {
          scroll-behavior: smooth;
        }

        /* Optimize for 60fps */
        .mobile-layout * {
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        /* High DPI support */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .mobile-layout {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Gesture handling */
        .mobile-layout {
          touch-action: manipulation;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Full height optimization */
        .mobile-layout {
          height: 100vh;
          height: calc(var(--vh, 1vh) * 100);
        }
      `}</style>
    </div>
  );
}
