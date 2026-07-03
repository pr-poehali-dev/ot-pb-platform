import { useStore } from '../shared/useStore';
import { globalFilterService } from './globalFilterService';

/**
 * Хук доступа к глобальным фильтрам конкретного контекста (например, "dictionary:companies").
 */
export function useGlobalFilters(context: string) {
  const allContexts = useStore(globalFilterService.store);
  const filters = allContexts[context] ?? {};

  return {
    filters,
    setFilter: (key: string, value: Parameters<typeof globalFilterService.setFilter>[2]) =>
      globalFilterService.setFilter(context, key, value),
    resetFilters: () => globalFilterService.resetFilters(context),
  };
}
