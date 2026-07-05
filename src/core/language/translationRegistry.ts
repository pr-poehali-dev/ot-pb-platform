import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import {
  LocaleCode,
  NamespaceResource,
  TranslationDictionary,
  TranslationNamespace,
} from './types';

/**
 * Реестр переводов Language Engine.
 *
 * Ключевой принцип: переводы НЕ хранятся внутри модулей. Каждый модуль
 * (существующий или будущий) регистрирует свой namespace ресурсов через
 * registerNamespace(), а получает строки только через translationRegistry /
 * хук useTranslate() из Language Engine.
 *
 * Пример подключения будущим модулем (без изменения ядра):
 *   registerNamespace('hse.violations', {
 *     ru: { title: 'Нарушения' },
 *     en: { title: 'Violations' },
 *   });
 */
type RegistryState = Record<TranslationNamespace, NamespaceResource>;

const store = createStore<RegistryState>({});

function registerNamespace(namespace: TranslationNamespace, resource: NamespaceResource): void {
  store.setState((prev) => ({
    ...prev,
    [namespace]: { ...(prev[namespace] ?? {}), ...resource },
  }));
  eventBus.emit('language.namespace_registered', { namespace }, 'language-engine');
}

/** Добавление/дополнение переводов конкретной локали в существующий namespace. */
function extendLocale(namespace: TranslationNamespace, locale: LocaleCode, dictionary: TranslationDictionary): void {
  store.setState((prev) => ({
    ...prev,
    [namespace]: {
      ...(prev[namespace] ?? {}),
      [locale]: { ...(prev[namespace]?.[locale] ?? {}), ...dictionary },
    },
  }));
}

function getDictionary(namespace: TranslationNamespace, locale: LocaleCode): TranslationDictionary | undefined {
  return store.getState()[namespace]?.[locale];
}

function listNamespaces(): TranslationNamespace[] {
  return Object.keys(store.getState());
}

export const translationRegistry = {
  store,
  registerNamespace,
  extendLocale,
  getDictionary,
  listNamespaces,
};
