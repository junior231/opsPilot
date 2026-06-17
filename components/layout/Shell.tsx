'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPersona } from '@/lib/auth/session';
import { User } from '@/lib/repo/types';

type Props = {
  children: ReactNode;
};

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/work-orders', label: 'Work Orders' },
];

export function Shell({ children }: Props) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getPersona());
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-200 bg-white">
        <div className="p-4">
          <Link href="/" className="text-lg font-bold text-slate-900">
            OpsPilot
          </Link>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Persona info */}
        {user && (
          <div className="absolute bottom-0 w-56 border-t border-slate-200 bg-white p-4">
            <div className="text-sm font-medium text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500 capitalize">{user.role}</div>
            <Link
              href="/login"
              className="mt-2 block text-xs text-blue-600 hover:underline"
            >
              Switch persona
            </Link>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50 p-6">{children}</main>
    </div>
  );
}
