import { useCallback } from 'react';
import { useStore } from '../shared/useStore';
import { languageService } from './languageService';
import { translationRegistry } from './translationRegistry';
import { TranslateFn, TranslateOptions, TranslationKey } from './types';

/**
 * Основной хук доступа к Language Engine для компонентов любого модуля.
 * Компонент подписывается на активную локаль и реестр переводов —
 * при смене языка или регистрации новых переводов текст обновится сам.
 */
export function useTranslate(): { t: TranslateFn; locale: string } {
  const locale = useStore(languageService.activeLocaleStore);
  // Подписка на реестр переводов гарантирует ре-рендер, если модуль
  // регистрирует свой namespace уже после первого рендера компонента.
  useStore(translationRegistry.store);

  const t = useCallback(
    (key: TranslationKey, options?: TranslateOptions) => languageService.translate(key, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  return { t, locale };
}
