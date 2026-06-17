'use client';

import { ReactNode } from 'react';
import { getPersona } from '@/lib/auth/session';
import { Role } from '@/lib/repo/types';

type Props = {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
};

export function RoleGuard({ allow, children, fallback = null }: Props) {
  const user = getPersona();

  if (!allow.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
