import { createStore } from '../shared/createStore';
import { FilterState, FilterValue } from './types';

/**
 * Система глобальных фильтров — независимый реестр состояний фильтрации,
 * разделённый по "контекстам" (например, контекст = имя модуля/страницы),
 * чтобы разные разделы платформы могли хранить свои наборы фильтров изолированно,
 * но через общий сервис (единый паттерн для всей платформы).
 */
type ContextsMap = Record<string, FilterState>;

const store = createStore<ContextsMap>({});

function getFilters(context: string): FilterState {
  return store.getState()[context] ?? {};
}

function setFilter(context: string, key: string, value: FilterValue): void {
  store.setState((prev) => ({
    ...prev,
    [context]: { ...(prev[context] ?? {}), [key]: value },
  }));
}

function resetFilters(context: string): void {
  store.setState((prev) => ({ ...prev, [context]: {} }));
}

export const globalFilterService = {
  store,
  getFilters,
  setFilter,
  resetFilters,
};
