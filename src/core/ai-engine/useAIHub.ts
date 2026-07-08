import { useStore } from '../shared/useStore';
import { providerRegistry } from './providerRegistry';
import { aiEngineService } from './aiEngineService';
import { aiConfiguration } from './aiConfiguration';
import { aiActionLog } from './aiActionLog';
import { aiRouter } from './aiRouter';
import { AIConverseInput } from './types';

/**
 * AI Hub — единый React-хук для UI-поверхности AI Engine (панель ассистента,
 * административные настройки моделей и т.д.). Объединяет состояние нескольких
 * независимых сервисов (providerRegistry, aiEngineService, aiConfiguration,
 * aiActionLog) в одном месте, по тому же принципу, что useAIModels уже
 * делает для списка моделей — useAIHub расширяет это на всю поверхность AI Engine.
 */
export function useAIHub() {
  const providers = useStore(providerRegistry.store);
  const activeProviderId = useStore(aiEngineService.activeProviderStore);
  const configuration = useStore(aiConfiguration.store);
  const actions = useStore(aiActionLog.store);

  return {
    models: Object.values(providers).map((p) => p.meta),
    activeProviderId,
    setActiveProvider: aiEngineService.setActiveProvider,
    setEnabled: providerRegistry.setEnabled,
    configuration,
    updateConfiguration: aiConfiguration.update,
    actions,
    converse: (input: AIConverseInput) => aiRouter.converse(input),
  };
}
