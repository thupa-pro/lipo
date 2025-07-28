import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
;

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale as string || 'en';

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          router.push(`/${locale}/auth/signin?error=oauth_failed`);
          return;
        }

        // Send the OAuth code to our backend API
        const response = await fetch('/api/auth/oauth-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        const data = await response.json();

        if (data.success) {
          router.push(`/${locale}/dashboard`);
        } else {
          router.push(`/${locale}/auth/signin?error=oauth_failed`);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.push(`/${locale}/auth/signin?error=oauth_failed`);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
      <div className="text-center">
        <UIIcons.Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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