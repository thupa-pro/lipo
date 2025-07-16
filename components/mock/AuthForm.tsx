"use client";

import React from 'react';
import { useMockAuth, Role } from '@/lib/mock/auth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const AuthForm = () => {
  const { user, signIn, signOut, switchRole } = useMockAuth();
  const [selectedRole, setSelectedRole] = React.useState<Role>('consumer');
  const router = useRouter();

  const handleSignIn = () => {
    signIn(selectedRole);
    router.push('/mock-dashboard');
  };

  const handleSwitchRole = (role: Role) => {
    switchRole(role);
  };

  if (user) {
    return (
      <div className="space-y-4">
        <div>
          <p>Welcome, <span className="font-semibold">{user.name}</span>!</p>
          <p>Your role is: <span className="font-semibold">{user.role}</span></p>
        </div>
        <div className="space-y-2">
          <Label>Switch Role:</Label>
          <Select onValueChange={(value) => handleSwitchRole(value as Role)} defaultValue={user.role}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => router.push('/mock-dashboard')} className="w-full">
          Go to Dashboard
        </Button>
        <Button onClick={signOut} variant="outline" className="w-full">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role-select">Select a role to sign in as:</Label>
        <Select onValueChange={(value) => setSelectedRole(value as Role)} defaultValue={selectedRole}>
          <SelectTrigger id="role-select">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="guest">Guest</SelectItem>
            <SelectItem value="consumer">Consumer</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSignIn} className="w-full">
        Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
      </Button>
    </div>
  );
};

export default AuthForm;
