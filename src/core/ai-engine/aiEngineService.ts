import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { userSettingsService } from '../user-settings';
import { providerRegistry } from './providerRegistry';
import { AIProviderId, AIRequest, AIResponse } from './types';

const SETTINGS_NAMESPACE = 'ai-engine';
const DEFAULT_PROVIDER: AIProviderId = 'chatgpt';

interface AIEngineSettings {
  activeProviderId: AIProviderId;
}

/**
 * AI Engine — единая точка входа для вызова ИИ из любого модуля платформы.
 *
 * Архитектурные принципы:
 *  - Модули НЕ обращаются к провайдерам напрямую — только к aiEngineService.send().
 *  - Активная модель хранится в персональных настройках пользователя через
 *    существующий сервис ядра user-settings (custom-namespace 'ai-engine'),
 *    по тому же паттерну, что и язык интерфейса (Language Engine).
 *  - Администратор управляет доступностью моделей через providerRegistry.setEnabled().
 *  - Список моделей открыт для расширения (см. providers/index.ts) — добавление
 *    новой модели не требует изменения aiEngineService.
 *
 * API моделей на этом этапе не подключены: send() делегирует вызов адаптеру
 * провайдера, чей send() пока является заглушкой (см. providers/*.ts).
 */
const readSettings = (): AIEngineSettings =>
  userSettingsService.getCustom<AIEngineSettings>(SETTINGS_NAMESPACE) ?? { activeProviderId: DEFAULT_PROVIDER };

const activeProviderStore = createStore<AIProviderId>(readSettings().activeProviderId);

userSettingsService.store.subscribe(() => {
  const { activeProviderId } = readSettings();
  if (activeProviderId !== activeProviderStore.getState()) {
    activeProviderStore.setState(activeProviderId);
  }
});

function getActiveProviderId(): AIProviderId {
  return activeProviderStore.getState();
}

function setActiveProvider(providerId: AIProviderId): void {
  if (!providerRegistry.getProvider(providerId)) return;
  userSettingsService.setCustom(SETTINGS_NAMESPACE, { activeProviderId: providerId });
  activeProviderStore.setState(providerId);
  eventBus.emit('ai-engine.provider_changed', { providerId }, 'ai-engine');
}

/** Единый интерфейс вызова ИИ для всех моделей и всех модулей платформы. */
async function send(request: AIRequest): Promise<AIResponse> {
  const providerId = request.modelId ?? getActiveProviderId();
  const provider = providerRegistry.getProvider(providerId);

  if (!provider) {
    throw new Error(`AI provider "${providerId}" is not registered`);
  }
  if (!provider.meta.enabled) {
    throw new Error(`AI provider "${providerId}" is disabled`);
  }

  eventBus.emit('ai-engine.request_sent', { providerId, request }, 'ai-engine');
  const response = await provider.send(request);
  eventBus.emit('ai-engine.response_received', { providerId, response }, 'ai-engine');
  return response;
}

export const aiEngineService = {
  activeProviderStore,
  getActiveProviderId,
  setActiveProvider,
  send,
};
