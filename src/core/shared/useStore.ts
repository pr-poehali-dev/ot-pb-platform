import { useSyncExternalStore } from 'react';
import { Store } from './createStore';

/**
 * Универсальный React-хук для подписки на любой Store<T> ядра.
 * Используется всеми хуками-обёртками сервисов (useEventBus, useNotifications, ...).
 */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}
