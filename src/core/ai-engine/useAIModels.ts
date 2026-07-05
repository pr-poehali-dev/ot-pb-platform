import { useStore } from '../shared/useStore';
import { providerRegistry } from './providerRegistry';
import { aiEngineService } from './aiEngineService';

/**
 * Хук выбора модели ИИ — для настроек пользователя/администратора.
 * Возвращает список зарегистрированных моделей и позволяет переключить активную.
 */
export function useAIModels() {
  const providers = useStore(providerRegistry.store);
  const activeProviderId = useStore(aiEngineService.activeProviderStore);

  return {
    models: Object.values(providers).map((p) => p.meta),
    activeProviderId,
    setActiveProvider: aiEngineService.setActiveProvider,
    setEnabled: providerRegistry.setEnabled,
  };
}
