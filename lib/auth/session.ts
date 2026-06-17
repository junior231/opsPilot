import { User } from '../repo/types';

export type PersonaKey = 'admin' | 'managerA' | 'analystB';

const PERSONAS: Record<PersonaKey, User> = {
  admin: { id: 'u_admin', name: 'Sarah Admin', role: 'admin' },
  managerA: { id: 'u_mgr_a', name: 'David Manager', role: 'manager', tenantId: 't_a' },
  analystB: { id: 'u_an_b', name: 'Maya Analyst', role: 'analyst', tenantId: 't_b' },
};

export function setPersona(key: PersonaKey): void {
  localStorage.setItem('persona', key);
}

export function getPersona(): User {
  if (typeof window === 'undefined') return PERSONAS.admin;
  const key = (localStorage.getItem('persona') as PersonaKey) || 'admin';
  return PERSONAS[key];
}

export function getPersonaKey(): PersonaKey {
  if (typeof window === 'undefined') return 'admin';
  return (localStorage.getItem('persona') as PersonaKey) || 'admin';
}
