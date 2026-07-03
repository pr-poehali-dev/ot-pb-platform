/**
 * Минимальный наблюдаемый стор (observable store).
 * Используется всеми сервисами ядра для хранения состояния в памяти
 * и уведомления подписчиков (React-компонентов) об изменениях.
 */
export type Listener = () => void;

export interface Store<T> {
  getState: () => T;
  setState: (updater: T | ((prev: T) => T)) => void;
  subscribe: (listener: Listener) => () => void;
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState = (updater: T | ((prev: T) => T)) => {
    const next = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater;
    if (next === state) return;
    state = next;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}
