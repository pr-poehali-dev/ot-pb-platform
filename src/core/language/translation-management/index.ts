/**
 * Translation Management — центральный словарь переводов Noventra Core.
 *
 * Архитектура:
 *  - types              — TranslationTerm (ключ, переводы по локалям, статус, версия, автор, дата)
 *  - dictionaryService   — единый реестр терминов; при изменении термина синхронизирует
 *                          значение в существующий translationRegistry (core/language),
 *                          поэтому useTranslate() продолжает работать без изменений
 *  - aiAutoTranslate     — автоматическое добавление отсутствующего перевода через AI Engine
 *  - useDictionary       — React-хук для будущего UI управления словарём
 *
 * Все будущие модули платформы должны пополнять переводы ТОЛЬКО через
 * dictionaryService.upsertTerm() / bulkImport() — не напрямую через translationRegistry.
 */
export * from './types';
export { dictionaryService } from './dictionaryService';
export { aiAutoTranslate } from './aiAutoTranslate';
export { useDictionary } from './useDictionary';
