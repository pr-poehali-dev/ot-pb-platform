import { useStore } from '../shared/useStore';
import { statusService } from './statusService';
import { EntityRef } from '../types';

export function useStatuses(scope?: string) {
  const definitions = useStore(statusService.definitionsStore);
  return {
    definitions: scope ? definitions.filter((d) => d.scope === scope) : definitions,
    defineStatus: statusService.defineStatus,
  };
}

export function useEntityStatus(entity: EntityRef) {
  const states = useStore(statusService.statesStore);
  const current = states.find((s) => s.entityType === entity.type && s.entityId === entity.id);
  return {
    current,
    setStatus: statusService.setStatus,
  };
}
