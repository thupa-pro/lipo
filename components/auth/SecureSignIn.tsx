"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SecureSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, error, clearError } = useSecureAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const authError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      const result = await signIn(formData);
      
      if (result.success) {
        // Redirect handled by hook
      } else {
        // Error message handled by hook
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);

      // Get Google OAuth URL
      const response = await fetch('/api/auth/google-oauth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Redirect to Google OAuth
        window.location.href = result.url;
      } else {
        console.error('Google OAuth URL generation failed:', result.error);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center theme-ai glass-subtle bg-gradient-holographic p-4">
      <Card className="w-full max-w-md glass-ultra shadow-glass-lg border border-glass-border-strong neural-card animate-spring-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-gradient-ai">
            Welcome to Elite Network
          </CardTitle>
          <CardDescription className="text-center text-ai-600 dark:text-ai-400">
            Access your premium AI-powered service platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Display authentication errors */}
          {(error || authError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 
                 (authError === 'auth_failed' ? 'Authentication failed. Please try again.' : 
                  'An error occurred. Please try again.')}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="elite@loconomy.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full neural-input focus:shadow-glow-ai transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-ai-600 dark:text-ai-400 hover:text-ai-700 dark:hover:text-ai-300 hover:underline transition-colors focus-visible-ring"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !formData.email || !formData.password}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link 
              href="/auth/signup" 
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>

          {/* Security notice */}
          <div className="text-xs text-center text-muted-foreground mt-6 p-3 bg-muted/50 rounded-lg">
            🔒 Your data is protected with enterprise-grade security
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
