"use client";

import { useEffect, useState } from "react";

interface HydrationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      fallback || (
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
