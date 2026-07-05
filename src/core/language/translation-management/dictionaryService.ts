import { createStore } from '../../shared/createStore';
import { eventBus } from '../../event-bus';
import { localeRegistry } from '../localeRegistry';
import { translationRegistry } from '../translationRegistry';
import { LocaleCode } from '../types';
import { MissingTermEntry, TranslationTerm, UpsertTermInput } from './types';

/**
 * Translation Management — центральный словарь платформы Noventra Core.
 *
 * Архитектурный принцип: это единственное место, где хранятся полные
 * метаданные термина (все локали, статус, версия, автор, дата изменения).
 * При каждом изменении термина словарь СИНХРОНИЗИРУЕТ значение в существующий
 * translationRegistry (см. core/language/translationRegistry.ts) — поэтому
 * useTranslate()/languageService.translate() продолжают работать без изменений.
 *
 * Все будущие модули должны пополнять переводы только через этот сервис
 * (upsertTerm / bulkImport), а не напрямую через translationRegistry.
 */
type DictionaryState = Record<string, TranslationTerm>;

const store = createStore<DictionaryState>({});

function termKey(namespace: string, localKey: string): string {
  return `${namespace}.${localKey}`;
}

/**
 * Синхронизация одного термина во все локали существующего translationRegistry.
 *
 * ВАЖНО: term.key имеет вид "<namespace>.<localKey>" (см. termKey ниже), а namespace
 * сам может содержать точки (например "dict.app", "dict.orgStructure"). Поэтому
 * восстанавливать localKey делением по ПЕРВОЙ точке нельзя — нужно отрезать ровно
 * длину known namespace. Иначе (как было раньше) для "dict.app.hierarchyTitle"
 * получался неверный localKey "app.hierarchyTitle", термин регистрировался под
 * несуществующим ключом, translate() ничего не находил и в UI утекал сырой
 * технический ключ вида "dict.app:hierarchyTitle".
 */
function syncToRegistry(term: TranslationTerm): void {
  const localKey = term.key.slice(term.namespace.length + 1);
  Object.entries(term.translations).forEach(([locale, value]) => {
    if (!value) return;
    translationRegistry.extendLocale(term.namespace, locale, { [localKey]: value });
  });
}

function upsertTerm(input: UpsertTermInput): TranslationTerm {
  const key = termKey(input.namespace, input.key);
  const existing = store.getState()[key];

  const term: TranslationTerm = {
    key,
    namespace: input.namespace,
    translations: { ...(existing?.translations ?? {}), ...input.translations },
    status: input.status ?? existing?.status ?? 'draft',
    version: (existing?.version ?? 0) + 1,
    updatedAt: new Date().toISOString(),
    updatedBy: input.actor,
  };

  store.setState((prev) => ({ ...prev, [key]: term }));
  syncToRegistry(term);
  eventBus.emit('translation-management.term_upserted', { key, version: term.version }, 'translation-management');

  return term;
}

/** Массовая загрузка базового словаря (используется при первичной инициализации). */
function bulkImport(terms: UpsertTermInput[]): void {
  terms.forEach((t) => upsertTerm(t));
  eventBus.emit('translation-management.bulk_imported', { count: terms.length }, 'translation-management');
}

function getTerm(namespace: string, localKey: string): TranslationTerm | undefined {
  return store.getState()[termKey(namespace, localKey)];
}

function listTerms(namespace?: string): TranslationTerm[] {
  const all = Object.values(store.getState());
  return namespace ? all.filter((t) => t.namespace === namespace) : all;
}

function listNamespaces(): string[] {
  return Array.from(new Set(listTerms().map((t) => t.namespace)));
}

/** Термины, у которых отсутствует перевод хотя бы на одну зарегистрированную локаль. */
function listMissingTranslations(): MissingTermEntry[] {
  const locales = localeRegistry.listLocales().map((l) => l.code);
  return listTerms()
    .map((term) => {
      const missingLocales = locales.filter((locale: LocaleCode) => !term.translations[locale]);
      return { key: term.key, missingLocales };
    })
    .filter((entry) => entry.missingLocales.length > 0);
}

function hasTerm(namespace: string, localKey: string): boolean {
  return Boolean(getTerm(namespace, localKey));
}

export const dictionaryService = {
  store,
  upsertTerm,
  bulkImport,
  getTerm,
  listTerms,
  listNamespaces,
  listMissingTranslations,
  hasTerm,
};