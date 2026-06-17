'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPersona } from '@/lib/auth/session';
import { inMemoryRepo } from '@/lib/repo/InMemoryRepo';
import { RoleGuard } from '@/components/RoleGuard';
import { Priority } from '@/lib/repo/types';

export default function NewWorkOrderPage() {
  const router = useRouter();
  const user = getPersona();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await inMemoryRepo.create(
        {
          title,
          description,
          priority,
          dueDate: dueDate || new Date().toISOString(),
          tenantId: user.tenantId,
        },
        user
      );
      router.push('/work-orders');
    } catch (err: any) {
      setError(err.message || 'Failed to create work order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RoleGuard
      allow={['admin', 'manager']}
      fallback={
        <div className="p-6">
          <p className="text-slate-500">You do not have permission to create work orders.</p>
        </div>
      }
    >
      <div className="mx-auto max-w-xl">
        <h1 className="text-xl font-semibold">Create Work Order</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create Work Order'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/work-orders')}
              className="rounded-md border px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
