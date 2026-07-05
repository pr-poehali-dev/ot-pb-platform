import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { AIProviderAdapter, AIProviderId } from './types';

/**
 * Реестр провайдеров AI Engine.
 * Каждая модель регистрируется через registerProvider() — реестр открыт
 * для расширения: новая модель добавляется без изменения существующего кода
 * (AI Engine, настроек, UI выбора модели).
 *
 * На этом этапе API моделей не подключены — регистрация содержит только
 * метаданные и заглушку адаптера (см. providers/*.ts).
 */
const store = createStore<Record<AIProviderId, AIProviderAdapter>>({});

function registerProvider(adapter: AIProviderAdapter): void {
  store.setState((prev) => ({ ...prev, [adapter.meta.id]: adapter }));
  eventBus.emit('ai-engine.provider_registered', { providerId: adapter.meta.id }, 'ai-engine');
}

function unregisterProvider(providerId: AIProviderId): void {
  store.setState((prev) => {
    const next = { ...prev };
    delete next[providerId];
    return next;
  });
}

function getProvider(providerId: AIProviderId): AIProviderAdapter | undefined {
  return store.getState()[providerId];
}

function listProviders(): AIProviderAdapter[] {
  return Object.values(store.getState());
}

function listEnabledProviders(): AIProviderAdapter[] {
  return listProviders().filter((p) => p.meta.enabled);
}

function setEnabled(providerId: AIProviderId, enabled: boolean): void {
  store.setState((prev) => {
    const provider = prev[providerId];
    if (!provider) return prev;
    return { ...prev, [providerId]: { ...provider, meta: { ...provider.meta, enabled } } };
  });
}

export const providerRegistry = {
  store,
  registerProvider,
  unregisterProvider,
  getProvider,
  listProviders,
  listEnabledProviders,
  setEnabled,
};
