export type Role = 'admin' | 'manager' | 'analyst';

export type Status = 'new' | 'in_progress' | 'blocked' | 'completed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Tenant = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  role: Role;
  tenantId?: string;
};

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId?: string;
  tenantId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  id: string;
  workOrderId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  entityType: 'work_order' | 'note' | 'user';
  entityId: string;
  action: 'create' | 'update_status' | 'edit' | 'assign' | 'comment';
  actorId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};
