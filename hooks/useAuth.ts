"use client";

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    // User data
    user,
    isSignedIn: !!isSignedIn,
    isLoading: !isLoaded,
    
    // User properties
    userId: user?.id,
    email: user?.emailAddresses?.[0]?.emailAddress,
    name: user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    firstName: user?.firstName,
    lastName: user?.lastName,
    role: user?.unsafeMetadata?.role as string | undefined,
    
    // Auth functions
    signOut: handleSignOut,
  };
}