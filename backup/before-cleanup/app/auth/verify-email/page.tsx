"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Mail, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          // Redirect to sign in after 3 seconds
          setTimeout(() => {
            router.push('/auth/signin');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-emerald-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Verification Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              {status === 'loading' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
              {status === 'success' && <CheckCircle className="w-8 h-8 text-white" />}
              {status === 'error' && <XCircle className="w-8 h-8 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === 'loading' && (
              <div className="text-center">
                <p className="text-slate-600 dark:text-gray-400 mb-4">
                  Please wait while we verify your email address...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm text-blue-600">Processing verification</span>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-400">
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-slate-600 dark:text-gray-400">
                  Your account is now active! You'll be redirected to the sign-in page in a few seconds.
                </p>
                <div className="flex flex-col gap-3">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
                    asChild
                  >
                    <Link href="/auth/signin">
                      Continue to Sign In
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/landing">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <Alert variant="destructive">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription>
                    {message}
                  </AlertDescription>
                </Alert>
                <p className="text-slate-600 dark:text-gray-400 text-sm">
                  This could happen if the verification link has expired or has already been used.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/auth/signup">
                      Try Registering Again
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/landing">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>Need help? Contact support@servicehub.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}