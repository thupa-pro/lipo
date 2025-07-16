"use client";

import React, { ReactNode } from 'react';
import { useMockAuth, Role } from '@/lib/mock/auth';

interface MockRoleGateProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

const MockRoleGate = ({ allowedRoles, children, fallback = null }: MockRoleGateProps) => {
  const { role } = useMockAuth();

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default MockRoleGate;
