import { createStore } from '../shared/createStore';
import { readPersisted, writePersisted } from '../shared/localPersist';
import { EntityRef } from '../types';
import { RecentEntry } from './types';

const STORAGE_KEY = 'noventra.core.recentItems';
const LIMIT = 10;

/**
 * Система последних открытых элементов — универсальная, по типу сущности.
 * Персистится в localStorage. Используется любым модулем, где нужно
 * показать "недавно открытые" карточки/записи.
 */
const store = createStore<RecentEntry[]>(readPersisted(STORAGE_KEY, []));

store.subscribe(() => writePersisted(STORAGE_KEY, store.getState()));

function push(entity: EntityRef, label?: string): void {
  store.setState((prev) => {
    const withoutDup = prev.filter((r) => !(r.type === entity.type && r.id === entity.id));
    const entry: RecentEntry = { ...entity, label, openedAt: new Date().toISOString() };
    return [entry, ...withoutDup].slice(0, LIMIT);
  });
}

function listByType(type?: string): RecentEntry[] {
  const all = store.getState();
  return type ? all.filter((r) => r.type === type) : all;
}

function clear(): void {
  store.setState([]);
}

export const recentItemsService = {
  store,
  push,
  listByType,
  clear,
};
