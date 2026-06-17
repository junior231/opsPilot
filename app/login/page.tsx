'use client';

import { useRouter } from 'next/navigation';
import { setPersona, PersonaKey } from '@/lib/auth/session';

const personas: { key: PersonaKey; label: string; description: string }[] = [
  {
    key: 'admin',
    label: 'Sarah Admin',
    description: 'Global access across all tenants. Can manage users, create/edit all work orders.',
  },
  {
    key: 'managerA',
    label: 'David Manager',
    description: 'Northwind Logistics. Can create, edit, and assign work orders within tenant.',
  },
  {
    key: 'analystB',
    label: 'Maya Analyst',
    description: 'Atlas Fleet. Read-only dashboard access. Can view and comment only.',
  },
];

export default function LoginPage() {
  const router = useRouter();

  const handleSelect = (key: PersonaKey) => {
    setPersona(key);
    router.push('/');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold">OpsPilot</h1>
        <p className="mt-2 text-slate-600">
          Multi-tenant operations command center. Choose a demo persona to explore role-based access.
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {personas.map((p) => (
          <button
            key={p.key}
            onClick={() => handleSelect(p.key)}
            className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md"
          >
            <div className="text-lg font-semibold text-slate-900">{p.label}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-blue-600">
              {p.key === 'admin' ? 'Admin' : p.key === 'managerA' ? 'Manager' : 'Analyst'}
            </div>
            <div className="mt-2 text-sm text-slate-500">{p.description}</div>
          </button>
        ))}
      </div>
    </main>
  );
}
