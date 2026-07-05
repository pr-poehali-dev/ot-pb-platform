import { useStore } from '../shared/useStore';
import { aiEngineService } from './aiEngineService';

/**
 * Основной хук вызова ИИ для компонентов любого модуля платформы.
 * Модуль не знает, какая модель активна — вызывает только send(request).
 */
export function useAIEngine() {
  const activeProviderId = useStore(aiEngineService.activeProviderStore);

  return {
    activeProviderId,
    send: aiEngineService.send,
  };
}
