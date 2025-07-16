"use client";

import React from 'react';
import { MockAuthProvider } from '@/lib/mock/auth';
import AuthForm from '@/components/mock/AuthForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const MockAuthPage = () => {
  return (
    <MockAuthProvider>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mock Auth Control</CardTitle>
            <CardDescription>
              Sign in as different user roles to test the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </MockAuthProvider>
  );
};

export default MockAuthPage;
