import { useStore } from '../shared/useStore';
import { changeHistoryService } from './changeHistoryService';
import { EntityRef } from '../types';

export function useChangeHistory(entity: EntityRef) {
  const all = useStore(changeHistoryService.store);
  const changes = all.filter((c) => c.entity.type === entity.type && c.entity.id === entity.id);

  return {
    changes,
    record: changeHistoryService.record,
  };
}
