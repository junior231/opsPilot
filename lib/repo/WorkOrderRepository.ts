import { WorkOrder, Note, AuditLog, User } from './types';

export interface ListParams {
  tenantId?: string;
  status?: string[];
  query?: string;
  assigneeId?: string;
  priority?: string[];
}

export interface WorkOrderRepository {
  list(params: ListParams): Promise<WorkOrder[]>;
  getById(id: string): Promise<WorkOrder | null>;
  create(input: Partial<WorkOrder>, actor: User): Promise<WorkOrder>;
  update(id: string, input: Partial<WorkOrder>, actor: User): Promise<WorkOrder>;
  listNotes(workOrderId: string): Promise<Note[]>;
  addNote(workOrderId: string, body: string, actor: User): Promise<Note>;
  listAudit(entityType: string, entityId: string): Promise<AuditLog[]>;
}
