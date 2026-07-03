import { useStore } from '../shared/useStore';
import { auditLogService } from './auditLogService';
import { EntityRef } from '../types';

/**
 * React-хук доступа к журналу действий.
 * Если передан entity — вернёт только записи по этой сущности (для вкладки «История»).
 */
export function useAuditLog(entity?: EntityRef) {
  const entries = useStore(auditLogService.store);
  const filtered = entity
    ? entries.filter((e) => e.entity.type === entity.type && e.entity.id === entity.id)
    : entries;

  return {
    entries: filtered,
    record: auditLogService.record,
  };
}
