import { useStore } from '../shared/useStore';
import { languageService } from './languageService';
import { localeRegistry } from './localeRegistry';

/**
 * Хук управления языком платформы — для селектора языка в UI (шапка, настройки профиля).
 * Каждый пользователь переключает язык независимо: изменение пишется в его
 * персональные user-settings (см. languageService.setActiveLocale).
 */
export function useLocale() {
  const locale = useStore(languageService.activeLocaleStore);
  const availableLocales = useStore(localeRegistry.store);

  return {
    locale,
    setLocale: languageService.setActiveLocale,
    availableLocales: Object.values(availableLocales),
  };
}
