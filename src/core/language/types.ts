/**
 * Типы Language Engine — движка мультиязычности платформы Noventra Core.
 * Ядро ничего не знает о конкретных модулях: переводы адресуются через
 * пару (namespace, key), а не через привязку к бизнес-сущностям.
 */

/** Код локали. Не ограничен литеральным union — новые языки добавляются без изменения типов. */
export type LocaleCode = string;

export type TextDirection = 'ltr' | 'rtl';

export interface LocaleMeta {
  code: LocaleCode;
  /** Название языка на английском (для админ-панели/логов) */
  label: string;
  /** Название языка на самом языке (для селектора языка в UI) */
  nativeLabel: string;
  direction: TextDirection;
}

/** Пространство имён переводов: домен, к которому относится набор ключей. */
export type TranslationNamespace = string;

export type TranslationKey = string;

/** Словарь "ключ → перевод" для одной локали в рамках одного namespace. */
export type TranslationDictionary = Record<TranslationKey, string>;

/** Ресурс namespace: словарь для каждой локали. */
export type NamespaceResource = Record<LocaleCode, TranslationDictionary>;

export interface TranslateOptions {
  /** Подстановки вида {{param}} внутри перевода */
  params?: Record<string, string | number>;
  /** Явный fallback-текст, если перевод не найден ни в текущей, ни в базовой локали */
  fallback?: string;
}

export type TranslateFn = (key: TranslationKey, options?: TranslateOptions) => string;
