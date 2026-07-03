import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { AuditEntry, RecordAuditInput } from './types';

/**
 * Audit Log — универсальный журнал действий платформы.
 * Любой модуль может записать факт действия над любой сущностью (EntityRef),
 * не привязываясь к конкретной бизнес-модели.
 */
let counter = 0;
const nextId = () => `audit-${++counter}`;

const store = createStore<AuditEntry[]>([]);

function record(input: RecordAuditInput): AuditEntry {
  const entry: AuditEntry = {
    id: nextId(),
    entity: input.entity,
    action: input.action,
    actor: input.actor,
    description: input.description,
    diff: input.diff,
    timestamp: new Date().toISOString(),
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('audit.recorded', entry, 'audit-log-service');
  return entry;
}

function listAll(): AuditEntry[] {
  return store.getState();
}

function listForEntity(entity: EntityRef): AuditEntry[] {
  return store.getState().filter((e) => e.entity.type === entity.type && e.entity.id === entity.id);
}

export const auditLogService = {
  store,
  record,
  listAll,
  listForEntity,
};
