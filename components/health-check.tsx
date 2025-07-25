"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle
} from "lucide-react";

export function HealthCheck() {
  const [mounted, setMounted] = useState(false);
  const [hydrationError, setHydrationError] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Listen, for hydration, errors
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes("hydration") ||
        event.message.includes("Hydration")
      ) {
        setHydrationError(true);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
          hydrationError
            ? "bg-red-100 text-red-700 border border-red-200"
            : "bg-green-100 text-green-700 border border-green-200"
        }`}
      >
        {hydrationError ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        <span className="font-medium">
          {hydrationError ? "Hydration Error" : "App Healthy"}
        </span>
      </div>
    </div>
  );
}
