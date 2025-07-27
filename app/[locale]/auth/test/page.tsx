"use client";

import { useState, useEffect } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, Calendar, CheckCircle, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AuthTestPage() {
  const { user, isLoading, isAuthenticated, signOut } = useSecureAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const demoCredentials = [
    {
      role: 'Admin',
      email: 'admin@loconomy.com',
      password: 'Admin123!',
      description: 'Full access to admin features',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    },
    {
      role: 'Provider',
      email: 'provider@loconomy.com',
      password: 'Provider123!',
      description: 'Service provider account',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      role: 'Consumer',
      email: 'user@loconomy.com',
      password: 'User123!',
      description: 'Regular user account',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Authentication Test Center</h1>
          <p className="text-muted-foreground">
            Test the authentication system with demo accounts or Google OAuth
          </p>
        </div>

        {/* Current User Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Checking authentication...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-600">Authenticated</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                                      user.role === 'provider' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-green-100 text-green-800'}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                  <Button asChild size="sm">
                    <Link href={user.role === 'admin' ? '/admin/dashboard' : 
                               user.role === 'provider' ? '/provider/dashboard' : 
                               '/dashboard'}>
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Not authenticated</p>
                <div className="flex gap-2 justify-center">
                  <Button asChild size="sm">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Test Accounts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use these pre-created accounts to test different user roles and permissions
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoCredentials.map((cred, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{cred.role} Account</h3>
                    <Badge className={cred.color}>{cred.role}</Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Email:</span>
                      <br />
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {cred.email}
                      </code>
                    </div>
                    <div>
                      <span className="font-medium">Password:</span>
                      <br />
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {cred.password}
                      </code>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {cred.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Email/Password Authentication:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Go to the <Link href="/auth/signin" className="text-primary hover:underline">Sign In page</Link></li>
                <li>Use any of the demo credentials above</li>
                <li>Test different user roles and their access levels</li>
              </ol>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">Google OAuth Authentication:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Click "Continue with Google" on sign in or sign up pages</li>
                <li>Complete Google OAuth flow (demo mode creates test account)</li>
                <li>Automatically signed in with consumer role</li>
              </ol>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">Registration Testing:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Go to the <Link href="/auth/signup" className="text-primary hover:underline">Sign Up page</Link></li>
                <li>Create a new account with email/password</li>
                <li>Choose consumer or provider role</li>
                <li>Test password requirements and validation</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
