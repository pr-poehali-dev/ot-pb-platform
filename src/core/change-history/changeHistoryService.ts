import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { ChangeRecord, RecordChangeInput } from './types';

/**
 * История изменений — универсальный журнал изменений полей сущности ("было → стало").
 * Отличается от Audit Log тем, что хранит структурированный diff, а не текстовое описание,
 * и предназначен для отображения во вкладке «История» карточек любых модулей.
 */
let counter = 0;
const nextId = () => `chg-${++counter}`;

const store = createStore<ChangeRecord[]>([]);

function record(input: RecordChangeInput): ChangeRecord {
  const entry: ChangeRecord = {
    id: nextId(),
    entity: input.entity,
    author: input.author,
    changes: input.changes,
    timestamp: new Date().toISOString(),
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('change.recorded', entry, 'change-history-service');
  return entry;
}

function listForEntity(entity: EntityRef): ChangeRecord[] {
  return store.getState().filter((c) => c.entity.type === entity.type && c.entity.id === entity.id);
}

export const changeHistoryService = {
  store,
  record,
  listForEntity,
};
