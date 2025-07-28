import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface RealtimeIndicatorProps {
  isActive: boolean;
  lastUpdated: Date;
}

export function RealtimeIndicator({
  isActive,
  lastUpdated,
}: RealtimeIndicatorProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={`flex items-center gap-1 ${
          isActive
            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400"
        }`}
      >
        {isActive ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Wifi className="w-3 h-3" />
            Live
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            Static
          </>
        )}
      </Badge>

      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <OptimizedIcon name="Clock" className="w-3 h-3" />
        {formatTime(lastUpdated)}
      </div>
    </div>
  );
}
