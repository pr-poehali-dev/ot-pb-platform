/**
 * Language Engine — движок мультиязычности Noventra Core.
 *
 * Архитектура:
 *  - localeRegistry        — реестр поддерживаемых локалей (открыт для расширения)
 *  - translationRegistry   — реестр переводов по namespace (модули регистрируют свои словари)
 *  - languageService       — активная локаль пользователя + функция перевода translate()
 *  - namespaces            — стандартные категории переводов (меню, кнопки, формы, таблицы,
 *                            уведомления, ошибки, документы, отчёты, справочники)
 *  - useTranslate/useLocale — React-хуки для компонентов любого модуля
 *
 * Язык хранится в профиле пользователя через core/user-settings (UserSettings.language),
 * поэтому каждый пользователь видит платформу на своём языке независимо от остальных.
 * Переводы НЕ хранятся внутри модулей — модули регистрируют свои namespace через
 * translationRegistry.registerNamespace() и получают строки только через useTranslate().
 */
export * from './types';
export * from './namespaces';
export { localeRegistry, DEFAULT_LOCALE, FALLBACK_LOCALE } from './localeRegistry';
export { translationRegistry } from './translationRegistry';
export { languageService } from './languageService';
export { useTranslate } from './useTranslate';
export { useLocale } from './useLocale';
