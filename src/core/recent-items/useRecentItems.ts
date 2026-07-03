import { useStore } from '../shared/useStore';
import { recentItemsService } from './recentItemsService';

export function useRecentItems(type?: string) {
  const all = useStore(recentItemsService.store);
  const items = type ? all.filter((r) => r.type === type) : all;

  return {
    items,
    push: recentItemsService.push,
    clear: recentItemsService.clear,
  };
}
