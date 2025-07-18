"use client";

import { StickyBottomNav, useShouldShowBottomNav } from "./sticky-bottom-nav";

export function MobileNavWrapper() {
  const shouldShow = useShouldShowBottomNav();
  
  if (!shouldShow) return null;
  
  return (
    <StickyBottomNav 
      unreadMessages={3}
      pendingBookings={1}
      userRole="seeker"
    />
  );
}