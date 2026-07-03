import { createStore } from '../shared/createStore';
import { readPersisted, writePersisted } from '../shared/localPersist';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { FavoriteEntry } from './types';

const STORAGE_KEY = 'noventra.core.favorites';

/**
 * Система избранного — универсальная, работает с любой сущностью через EntityRef.
 * Персистится в localStorage, чтобы избранное сохранялось между сессиями.
 */
const store = createStore<FavoriteEntry[]>(readPersisted(STORAGE_KEY, []));

store.subscribe(() => writePersisted(STORAGE_KEY, store.getState()));

function isFavorite(entity: EntityRef): boolean {
  return store.getState().some((f) => f.type === entity.type && f.id === entity.id);
}

function toggle(entity: EntityRef): void {
  const exists = isFavorite(entity);
  store.setState((prev) =>
    exists
      ? prev.filter((f) => !(f.type === entity.type && f.id === entity.id))
      : [...prev, { ...entity, addedAt: new Date().toISOString() }]
  );
  eventBus.emit('favorite.toggled', { entity, isFavorite: !exists }, 'favorite-service');
}

function listByType(type?: string): FavoriteEntry[] {
  const all = store.getState();
  return type ? all.filter((f) => f.type === type) : all;
}

export const favoriteService = {
  store,
  isFavorite,
  toggle,
  listByType,
};
