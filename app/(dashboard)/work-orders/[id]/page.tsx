'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { inMemoryRepo } from '@/lib/repo/InMemoryRepo';
import { WorkOrder, Note, AuditLog } from '@/lib/repo/types';

export default function WorkOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [wo, setWo] = useState<WorkOrder | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);

  useEffect(() => {
    inMemoryRepo.getById(params.id).then(setWo);
    inMemoryRepo.listNotes(params.id).then(setNotes);
    inMemoryRepo.listAudit('work_order', params.id).then(setAudits);
  }, [params.id]);

  if (!wo) {
    return (
      <main className="p-6">
        <p className="text-slate-500">Loading work order…</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{wo.title}</h1>
        <Link
          href="/work-orders"
          className="rounded-md border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          ← Back to list
        </Link>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-slate-700">{wo.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <span className="text-slate-500">Status</span>
            <div className="mt-0.5 font-medium capitalize">{wo.status.replace('_', ' ')}</div>
          </div>
          <div>
            <span className="text-slate-500">Priority</span>
            <div className="mt-0.5 font-medium capitalize">{wo.priority}</div>
          </div>
          <div>
            <span className="text-slate-500">Due</span>
            <div className="mt-0.5 font-medium">{new Date(wo.dueDate).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="text-slate-500">Created</span>
            <div className="mt-0.5 font-medium">{new Date(wo.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-md font-semibold">Notes</h2>
        {notes.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No notes yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded border border-slate-100 bg-slate-50 p-3 text-sm">
                <div className="text-slate-800">{n.body}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {n.authorId} · {new Date(n.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Audit Timeline */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-md font-semibold">Audit Timeline</h2>
        {audits.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No activity recorded.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {audits.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                <div>
                  <span className="font-medium">{a.action.replace('_', ' ')}</span>
                  {a.metadata && Object.keys(a.metadata).length > 0 && (
                    <span className="ml-1 text-slate-500">
                      ({JSON.stringify(a.metadata)})
                    </span>
                  )}
                  <div className="text-xs text-slate-400">
                    {a.actorId} · {new Date(a.timestamp).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
