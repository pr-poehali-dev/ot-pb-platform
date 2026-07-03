import { EntityRef } from '../types';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'archive'
  | 'restore'
  | 'status_change'
  | 'parent_change'
  | 'view'
  | 'custom';

export interface AuditEntry {
  id: string;
  entity: EntityRef;
  action: AuditAction;
  actor: string;
  timestamp: string;
  /** Человекочитаемое описание того, что изменилось */
  description: string;
  /** Произвольные детали изменения (до/после), опционально */
  diff?: Record<string, { before: unknown; after: unknown }>;
}

export interface RecordAuditInput {
  entity: EntityRef;
  action: AuditAction;
  actor: string;
  description: string;
  diff?: Record<string, { before: unknown; after: unknown }>;
}