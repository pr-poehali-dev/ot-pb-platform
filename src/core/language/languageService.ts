import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { userSettingsService } from '../user-settings';
import { localeRegistry, DEFAULT_LOCALE, FALLBACK_LOCALE } from './localeRegistry';
import { translationRegistry } from './translationRegistry';
import { LocaleCode, TranslateOptions, TranslationKey } from './types';

/**
 * Language Engine — сервис активного языка платформы.
 *
 * Язык хранится в профиле пользователя через существующий сервис ядра
 * user-settings (UserSettings.language), поэтому каждый пользователь видит
 * платформу на своём языке независимо от остальных: активная локаль читается
 * из персональных настроек текущей сессии, а не из глобальной константы.
 *
 * Формат ключа перевода: "namespace:key", например "common:buttons.save".
 * Namespace должен быть предварительно зарегистрирован модулем через
 * translationRegistry.registerNamespace().
 */
const activeLocaleStore = createStore<LocaleCode>(
  localeRegistry.isSupported(userSettingsService.store.getState().language)
    ? userSettingsService.store.getState().language
    : DEFAULT_LOCALE
);

// Синхронизация с профилем пользователя: изменения настроек отражаются в активной локали.
userSettingsService.store.subscribe(() => {
  const { language } = userSettingsService.store.getState();
  if (localeRegistry.isSupported(language) && language !== activeLocaleStore.getState()) {
    activeLocaleStore.setState(language);
  }
});

function getActiveLocale(): LocaleCode {
  return activeLocaleStore.getState();
}

function setActiveLocale(code: LocaleCode): void {
  if (!localeRegistry.isSupported(code)) return;
  // Единственная точка записи — профиль пользователя (user-settings ядра).
  userSettingsService.update({ language: code });
  activeLocaleStore.setState(code);
  eventBus.emit('language.changed', { locale: code }, 'language-engine');
}

function parseKey(key: TranslationKey): { namespace: string; localKey: string } {
  const separatorIndex = key.indexOf(':');
  if (separatorIndex === -1) {
    return { namespace: 'common', localKey: key };
  }
  return { namespace: key.slice(0, separatorIndex), localKey: key.slice(separatorIndex + 1) };
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, paramName) =>
    paramName in params ? String(params[paramName]) : match
  );
}

/**
 * Последний защитный барьер: пользователь НИКОГДА не должен видеть технический
 * ключ вида "dict.app:hierarchyTitle" или "modules:users.title". Если перевод
 * не найден ни в активной, ни в fallback-локали, и явного fallback-текста нет,
 * превращаем ключ в читаемый текст (берём последний сегмент, разбиваем camelCase
 * на слова, убираем расширения файлов вида ".tsx") вместо показа сырого ключа.
 */
function humanizeKey(key: TranslationKey): string {
  const withoutExtension = key.replace(/\.(tsx?|jsx?)$/i, '');
  const lastSegment = withoutExtension.split(/[:.]/).pop() ?? withoutExtension;
  const spaced = lastSegment
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (!spaced) return withoutExtension;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Разрешение перевода: активная локаль → fallback-локаль (русский) → явный
 * fallback из вызова → человекочитаемое представление ключа. Технический ключ
 * с разделителями "namespace:key" или точками наружу никогда не возвращается.
 */
function translate(key: TranslationKey, options?: TranslateOptions): string {
  const { namespace, localKey } = parseKey(key);
  const activeLocale = getActiveLocale();

  const activeDict = translationRegistry.getDictionary(namespace, activeLocale);
  if (activeDict && localKey in activeDict) {
    return interpolate(activeDict[localKey], options?.params);
  }

  const fallbackDict = translationRegistry.getDictionary(namespace, FALLBACK_LOCALE);
  if (fallbackDict && localKey in fallbackDict) {
    return interpolate(fallbackDict[localKey], options?.params);
  }

  if (options?.fallback) return interpolate(options.fallback, options.params);

  eventBus.emit('language.translation_missing', { key, namespace, localKey, activeLocale }, 'language-engine');

  return humanizeKey(key);
}

export const languageService = {
  activeLocaleStore,
  getActiveLocale,
  setActiveLocale,
  translate,
};