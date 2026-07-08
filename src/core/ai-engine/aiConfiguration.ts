import { createStore } from '../shared/createStore';
import { readPersisted, writePersisted } from '../shared/localPersist';
import { eventBus } from '../event-bus';
import { AIConfiguration, AIProviderId } from './types';

const STORAGE_KEY = 'noventra.core.aiConfiguration';

const DEFAULT_CONFIGURATION: AIConfiguration = {
  defaultProviderId: 'chatgpt',
  defaultParams: {},
  enabled: true,
};

/**
 * AI Configuration — административные настройки платформы для AI Engine.
 * По паттерну user-settings (persist через localPersist), но это НЕ
 * персональные настройки пользователя — это конфигурация уровня платформы
 * (провайдер по умолчанию, глобальные параметры вызова, общий рубильник).
 */
const store = createStore<AIConfiguration>(readPersisted(STORAGE_KEY, DEFAULT_CONFIGURATION));

store.subscribe(() => writePersisted(STORAGE_KEY, store.getState()));

function get(): AIConfiguration {
  return store.getState();
}

function update(patch: Partial<AIConfiguration>): void {
  store.setState((prev) => ({ ...prev, ...patch }));
  eventBus.emit('ai-engine.configuration_updated', store.getState(), 'ai-configuration');
}

function setDefaultProvider(providerId: AIProviderId): void {
  update({ defaultProviderId: providerId });
}

function setEnabled(enabled: boolean): void {
  update({ enabled });
}

function reset(): void {
  store.setState(DEFAULT_CONFIGURATION);
}

export const aiConfiguration = {
  store,
  get,
  update,
  setDefaultProvider,
  setEnabled,
  reset,
};
