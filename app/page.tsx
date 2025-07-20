"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Still loading session

    if (session) {
      // User is authenticated, redirect to loading page which will route to appropriate dashboard
      router.push("/auth/loading");
    } else {
      // User is not authenticated, redirect to landing page
      router.push("/landing");
    }
  }, [session, status, router]);

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

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
  main
}
