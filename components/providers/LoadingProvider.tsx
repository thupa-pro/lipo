"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { EliteLoadingScreen } from "@/components/ui/elite-loading-screen";

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  progress?: number;
  showLoading: (message?: string, progress?: number) => void;
  hideLoading: () => void;
  showPageLoading: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Loading your experience...");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [isAppLaunching, setIsAppLaunching] = useState(true);

  // App launch sequence
  useEffect(() => {
    const launchSequence = async () => {
      // Check if this is the first visit or app launch
      const hasLaunched = sessionStorage.getItem("app-launched");
      
      if (!hasLaunched) {
        // Simulate app initialization
        const steps = [
          { message: "Initializing Loconomy...", duration: 800 },
          { message: "Loading AI systems...", duration: 600 },
          { message: "Connecting to services...", duration: 500 },
          { message: "Preparing your experience...", duration: 400 },
        ];

        for (let i = 0; i < steps.length; i++) {
          setMessage(steps[i].message);
          setProgress((i + 1) / steps.length * 100);
          await new Promise(resolve => setTimeout(resolve, steps[i].duration));
        }

        // Mark as launched for this session
        sessionStorage.setItem("app-launched", "true");
        
        // Complete launch
        setTimeout(() => {
          setIsAppLaunching(false);
        }, 500);
      } else {
        // Quick launch for returning users
        setTimeout(() => {
          setIsAppLaunching(false);
        }, 300);
      }
    };

    launchSequence();
  }, []);

  const showLoading = (newMessage = "Loading...", newProgress?: number) => {
    setMessage(newMessage);
    setProgress(newProgress);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setProgress(undefined);
  };

  const showPageLoading = (newMessage = "Loading page...") => {
    setMessage(newMessage);
    setProgress(undefined);
    setIsLoading(true);
    
    // Auto-hide after reasonable time
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        message,
        progress,
        showLoading,
        hideLoading,
        showPageLoading,
      }}
    >
      {/* App Launch Loading Screen */}
      <EliteLoadingScreen
        isVisible={isAppLaunching}
        message={message}
        progress={progress}
        variant="launch"
        onComplete={() => setIsAppLaunching(false)}
      />

      {/* Page/Action Loading Screen */}
      <EliteLoadingScreen
        isVisible={isLoading && !isAppLaunching}
        message={message}
        progress={progress}
        variant="page"
        onComplete={hideLoading}
      />

      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

// Higher-order component for automatic page loading
export function withPageLoading<T extends object>(
  Component: React.ComponentType<T>,
  loadingMessage = "Loading page..."
) {
  return function WrappedComponent(props: T) {
    const { showPageLoading } = useLoading();
    const [isComponentLoading, setIsComponentLoading] = useState(true);

    useEffect(() => {
      showPageLoading(loadingMessage);
      
      // Simulate component loading
      const timer = setTimeout(() => {
        setIsComponentLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, [showPageLoading]);

    if (isComponentLoading) {
      return null; // Loading screen will be shown by provider
    }

    return <Component {...props} />;
  };
}

export default LoadingProvider;
