import { createStore } from '../shared/createStore';
import { readPersisted, writePersisted } from '../shared/localPersist';
import { eventBus } from '../event-bus';
import { DEFAULT_USER_SETTINGS, UserSettings } from './types';

const STORAGE_KEY = 'noventra.core.userSettings';

/**
 * Настройки пользователя — единое хранилище персональных предпочтений,
 * общее для всех модулей платформы. Модули могут писать свои настройки
 * в namespace через `setCustom(namespace, value)`, не создавая отдельных сервисов.
 */
const store = createStore<UserSettings>(readPersisted(STORAGE_KEY, DEFAULT_USER_SETTINGS));

store.subscribe(() => writePersisted(STORAGE_KEY, store.getState()));

function update(patch: Partial<Omit<UserSettings, 'custom'>>): void {
  store.setState((prev) => ({ ...prev, ...patch }));
  eventBus.emit('user-settings.updated', store.getState(), 'user-settings-service');
}

function setCustom(namespace: string, value: unknown): void {
  store.setState((prev) => ({ ...prev, custom: { ...prev.custom, [namespace]: value } }));
}

function getCustom<T>(namespace: string): T | undefined {
  return store.getState().custom[namespace] as T | undefined;
}

function reset(): void {
  store.setState(DEFAULT_USER_SETTINGS);
}

export const userSettingsService = {
  store,
  update,
  setCustom,
  getCustom,
  reset,
};
