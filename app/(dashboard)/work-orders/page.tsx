'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPersona } from '@/lib/auth/session';
import { inMemoryRepo } from '@/lib/repo/InMemoryRepo';
import { WorkOrder } from '@/lib/repo/types';

export default function WorkOrdersPage() {
  const [rows, setRows] = useState<WorkOrder[]>([]);

  useEffect(() => {
    const user = getPersona();
    const tenantId = user.role === 'admin' ? undefined : user.tenantId;
    inMemoryRepo.list({ tenantId }).then(setRows);
  }, []);

  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Work Orders</h1>
        <Link
          href="/"
          className="rounded-md border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-none hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/work-orders/${r.id}`} className="text-blue-600 hover:underline">
                    {r.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{r.status.replace('_', ' ')}</td>
                <td className="px-4 py-3 capitalize">{r.priority}</td>
                <td className="px-4 py-3">{new Date(r.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={4}>
                  No work orders in your scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
