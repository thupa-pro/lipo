"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const { user, isLoading, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Still loading session

    if (isSignedIn && user) {
      // User is authenticated, redirect to loading page which will route to appropriate dashboard
      router.push(`/${locale}/auth/loading`);
    } else {
      // User is not authenticated, redirect to landing page
      router.push(`/${locale}/landing`);
    }
  }, [user, isLoading, isSignedIn, router, locale]);

  // Show loading spinner while checking authentication
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
