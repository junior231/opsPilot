'use client';

import { useEffect, useState } from 'react';
import { getPersona } from '@/lib/auth/session';
import { inMemoryRepo } from '@/lib/repo/InMemoryRepo';
import { WorkOrder } from '@/lib/repo/types';
import { KpiCard } from '@/components/KpiCard';
import Link from 'next/link';

export default function DashboardPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [user, setUser] = useState(getPersona());

  useEffect(() => {
    const currentUser = getPersona();
    setUser(currentUser);

    const tenantId = currentUser.role === 'admin' ? undefined : currentUser.tenantId;
    inMemoryRepo.list({ tenantId }).then(setWorkOrders);
  }, []);

  const now = new Date();
  const open = workOrders.filter((w) => w.status !== 'completed').length;
  const overdue = workOrders.filter(
    (w) => w.status !== 'completed' && new Date(w.dueDate) < now
  ).length;
  const blocked = workOrders.filter((w) => w.status === 'blocked').length;
  const dueThisWeek = workOrders.filter((w) => {
    const due = new Date(w.dueDate);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return w.status !== 'completed' && due >= now && due <= weekFromNow;
  }).length;

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Signed in as <span className="font-medium">{user.name}</span> ({user.role})
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/work-orders"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
          >
            Work Orders
          </Link>
          <Link
            href="/login"
            className="rounded-md border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Switch Persona
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open Work Orders" value={open} />
        <KpiCard label="Overdue" value={overdue} trend={overdue > 0 ? 'down' : 'flat'} />
        <KpiCard label="Blocked" value={blocked} trend={blocked > 0 ? 'down' : 'flat'} />
        <KpiCard label="Due This Week" value={dueThisWeek} />
      </div>
    </main>
  );
}
