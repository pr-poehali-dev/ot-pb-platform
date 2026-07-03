import { EntityRef } from '../types';

/**
 * Стандартизированные типы доменных событий сущностей платформы.
 * Любой модуль (иерархия, справочники, будущие HSE-модули и т.д.)
 * использует эти же константы, чтобы Audit Log мог единообразно
 * слушать события через Event Bus без дублирования кода.
 */
export const CoreEventType = {
  EntityCreated: 'entity.created',
  EntityUpdated: 'entity.updated',
  EntityDeleted: 'entity.deleted',
  EntityArchived: 'entity.archived',
  EntityRestored: 'entity.restored',
  EntityStatusChanged: 'entity.status_changed',
  EntityParentChanged: 'entity.parent_changed',
} as const;

export type CoreEventTypeValue = (typeof CoreEventType)[keyof typeof CoreEventType];

/**
 * Единый универсальный payload для всех доменных событий сущностей.
 * entity — универсальная ссылка (EntityRef), не зависящая от бизнес-модуля.
 */
export interface EntityDomainEventPayload {
  entity: EntityRef;
  actor: string;
  description: string;
  diff?: Record<string, { before: unknown; after: unknown }>;
}
