"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import {
  Bell,
  Search,
  Menu,
  Shield,
  Zap,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title?: string;
  showProfile?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  transparent?: boolean;
  className?: string;
}

export function MobileHeader({
  title,
  showProfile = true,
  showNotifications = true,
  showSearch = true,
  transparent = false,
  className,
}: MobileHeaderProps) {
  const [notifications, setNotifications] = useState(3);
  const [isOnline, setIsOnline] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("Mobile.header");

  // Use translation for default title
  const displayTitle = title || t("app_name");

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(20, prev - Math.random() * 2));
      setSignalStrength(Math.floor(Math.random() * 5));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 safe-area-pt",
        transparent
          ? "bg-transparent"
          : "glass-ultra border-b border-border/20",
        className,
      )}
    >
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-0.5 h-2 rounded-full",
                    i < signalStrength ? "bg-current" : "bg-current/30",
                  )}
                />
              ))}
            </div>
          </div>
          <Wifi
            className={cn(
              "w-3 h-3",
              isOnline ? "text-emerald-500" : "text-red-500",
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span className="text-xs">{t("secure")}</span>
          </div>
          <div className="flex items-center gap-1" title={t("battery_level")}>
            <Battery className="w-3 h-3" />
            <span className="text-xs">{batteryLevel}%</span>
          </div>
          <span className="text-xs">9:41 AM</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            {isOnline && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              {displayTitle}
            </h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Elite Network</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/browse")}
              className="relative p-2 rounded-xl hover:bg-accent transition-all duration-300"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {showNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard?tab=notifications")}
              className="relative p-2 rounded-xl hover:bg-accent transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
                  {notifications}
                </Badge>
              )}
            </Button>
          )}

          {showProfile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/profile")}
              className="relative p-1 rounded-xl hover:bg-accent transition-all duration-300"
            >
              <Avatar className="h-8 w-8 border-2 border-gradient-to-r from-cyan-400 to-blue-600">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
