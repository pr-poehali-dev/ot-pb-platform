import { eventBus } from '../event-bus';
import { CoreEvent } from '../event-bus/types';
import { CoreEventType } from '../event-bus/eventTypes';
import { EntityDomainEventPayload } from '../event-bus/eventTypes';
import { auditLogService } from './auditLogService';
import { AuditAction } from './types';

/**
 * Мост Event Bus → Audit Log.
 *
 * Единственное место платформы, где Audit Log подписывается на доменные события сущностей.
 * Все CRUD-операции любого модуля (иерархия, справочники, будущие модули) обязаны
 * проходить только через eventBus.emit(...) — запись в журнал действий происходит
 * здесь автоматически, без дублирования кода вызова auditLogService.record() в каждом контексте.
 */
const EVENT_TO_ACTION: Record<string, AuditAction> = {
  [CoreEventType.EntityCreated]: 'create',
  [CoreEventType.EntityUpdated]: 'update',
  [CoreEventType.EntityDeleted]: 'delete',
  [CoreEventType.EntityArchived]: 'archive',
  [CoreEventType.EntityRestored]: 'restore',
  [CoreEventType.EntityStatusChanged]: 'status_change',
  [CoreEventType.EntityParentChanged]: 'parent_change',
};

let initialized = false;

export function initAuditEventBridge(): void {
  if (initialized) return;
  initialized = true;

  Object.entries(EVENT_TO_ACTION).forEach(([eventType, action]) => {
    eventBus.on<EntityDomainEventPayload>(eventType, (event: CoreEvent<EntityDomainEventPayload>) => {
      auditLogService.record({
        entity: event.payload.entity,
        action,
        actor: event.payload.actor,
        description: event.payload.description,
        diff: event.payload.diff,
      });
    });
  });
}
