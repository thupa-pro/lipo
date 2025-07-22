"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SSOCallbackPage() {
  const router = useRouter();
  const clerk = useClerk();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if the user is now signed in
        if (clerk.user) {
          router.push('/dashboard');
        } else {
          // If not signed in, redirect to sign in page
          router.push('/auth/signin');
        }
      } catch (error) {
        console.error('SSO callback error:', error);
        router.push('/auth/signin');
      }
    };

    // Small delay to ensure Clerk has processed the callback
    const timer = setTimeout(handleCallback, 1000);
    return () => clearTimeout(timer);
  }, [clerk.user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
          Completing sign in...
        </h2>
        <p className="text-slate-600 dark:text-gray-400">
          Please wait while we set up your account.
        </p>
      </div>
    </div>
  );
}