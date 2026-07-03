import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { EntityStatusState, StatusDefinition } from './types';

/**
 * Система статусов — универсальный реестр определений статусов (по scope)
 * и текущее состояние статуса для любой сущности платформы.
 * Не содержит бизнес-правил переходов — это чистая инфраструктура.
 */
const definitionsStore = createStore<StatusDefinition[]>([]);
const statesStore = createStore<EntityStatusState[]>([]);

function defineStatus(def: StatusDefinition): void {
  definitionsStore.setState((prev) => (prev.some((d) => d.id === def.id) ? prev : [...prev, def]));
}

function listDefinitions(scope?: string): StatusDefinition[] {
  const all = definitionsStore.getState();
  return scope ? all.filter((d) => d.scope === scope) : all;
}

function setStatus(entity: EntityRef, statusId: string, changedBy: string): void {
  const state: EntityStatusState = {
    entityType: entity.type,
    entityId: entity.id,
    statusId,
    changedAt: new Date().toISOString(),
    changedBy,
  };
  statesStore.setState((prev) => [
    ...prev.filter((s) => !(s.entityType === entity.type && s.entityId === entity.id)),
    state,
  ]);
  eventBus.emit('status.changed', state, 'status-service');
}

function getStatus(entity: EntityRef): EntityStatusState | undefined {
  return statesStore.getState().find((s) => s.entityType === entity.type && s.entityId === entity.id);
}

export const statusService = {
  definitionsStore,
  statesStore,
  defineStatus,
  listDefinitions,
  setStatus,
  getStatus,
};
