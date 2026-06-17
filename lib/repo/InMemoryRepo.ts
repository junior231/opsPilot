import seed from '../seed/seed.json';
import { WorkOrderRepository, ListParams } from './WorkOrderRepository';
import { WorkOrder, Note, AuditLog, User } from './types';

const db = {
  tenants: [...seed.tenants],
  users: [...seed.users] as User[],
  workOrders: [...seed.workOrders] as WorkOrder[],
  notes: [...seed.notes] as Note[],
  audits: [...seed.audits] as AuditLog[],
};

function canAccess(user: User, tenantId: string): boolean {
  return user.role === 'admin' || user.tenantId === tenantId;
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

export const inMemoryRepo: WorkOrderRepository = {
  async list(params: ListParams) {
    let rows = db.workOrders.slice();

    if (params.tenantId) {
      rows = rows.filter((r) => r.tenantId === params.tenantId);
    }
    if (params.status?.length) {
      rows = rows.filter((r) => params.status!.includes(r.status));
    }
    if (params.priority?.length) {
      rows = rows.filter((r) => params.priority!.includes(r.priority));
    }
    if (params.assigneeId) {
      rows = rows.filter((r) => r.assigneeId === params.assigneeId);
    }
    if (params.query) {
      const q = params.query.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    return rows.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  },

  async getById(id: string) {
    return db.workOrders.find((w) => w.id === id) ?? null;
  },

  async create(input: Partial<WorkOrder>, actor: User) {
    if (actor.role === 'analyst') {
      throw new Error('Forbidden: Analysts cannot create work orders.');
    }

    const now = new Date().toISOString();

    const wo: WorkOrder = {
      id: generateId('wo'),
      title: input.title || 'Untitled',
      description: input.description || '',
      status: input.status || 'new',
      priority: input.priority || 'medium',
      assigneeId: input.assigneeId,
      tenantId: input.tenantId || actor.tenantId || 't_a',
      dueDate: input.dueDate || now,
      createdAt: now,
      updatedAt: now,
    };

    db.workOrders.push(wo);

    db.audits.push({
      id: generateId('a'),
      entityType: 'work_order',
      entityId: wo.id,
      action: 'create',
      actorId: actor.id,
      timestamp: now,
      metadata: {},
    });

    return wo;
  },

  async update(id: string, input: Partial<WorkOrder>, actor: User) {
    const idx = db.workOrders.findIndex((w) => w.id === id);
    if (idx === -1) throw new Error('Work order not found.');

    const current = db.workOrders[idx];

    if (!canAccess(actor, current.tenantId)) {
      throw new Error('Forbidden: No access to this tenant.');
    }
    if (actor.role === 'analyst') {
      throw new Error('Forbidden: Analysts cannot edit work orders.');
    }

    const now = new Date().toISOString();
    const updated: WorkOrder = { ...current, ...input, updatedAt: now };
    db.workOrders[idx] = updated;

    db.audits.push({
      id: generateId('a'),
      entityType: 'work_order',
      entityId: id,
      action: input.status && input.status !== current.status ? 'update_status' : 'edit',
      actorId: actor.id,
      timestamp: now,
      metadata: input.status !== current.status
        ? { from: current.status, to: input.status }
        : input,
    });

    return updated;
  },

  async listNotes(workOrderId: string) {
    return db.notes
      .filter((n) => n.workOrderId === workOrderId)
      .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  },

  async addNote(workOrderId: string, body: string, actor: User) {
    const wo = db.workOrders.find((w) => w.id === workOrderId);
    if (!wo) throw new Error('Work order not found.');

    if (!canAccess(actor, wo.tenantId)) {
      throw new Error('Forbidden: No access to this tenant.');
    }

    const now = new Date().toISOString();

    const note: Note = {
      id: generateId('n'),
      workOrderId,
      authorId: actor.id,
      body,
      createdAt: now,
    };

    db.notes.push(note);

    db.audits.push({
      id: generateId('a'),
      entityType: 'work_order',
      entityId: workOrderId,
      action: 'comment',
      actorId: actor.id,
      timestamp: now,
      metadata: {},
    });

    return note;
  },

  async listAudit(entityType: string, entityId: string) {
    return db.audits
      .filter((a) => a.entityType === entityType && a.entityId === entityId)
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
  },
};
