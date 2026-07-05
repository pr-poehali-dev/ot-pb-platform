import { createStore } from '../shared/createStore';
import { LocaleCode, LocaleMeta } from './types';

/**
 * Реестр локалей Language Engine.
 * Языки первого этапа регистрируются при загрузке модуля, но реестр открыт
 * для расширения: любой будущий язык добавляется через registerLocale()
 * без изменения существующего кода платформы.
 */
export const DEFAULT_LOCALE: LocaleCode = 'ru';
/** Если перевод отсутствует в активной локали — показываем русский (требование платформы). */
export const FALLBACK_LOCALE: LocaleCode = 'ru';

const FIRST_STAGE_LOCALES: LocaleMeta[] = [
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', direction: 'ltr' },
  { code: 'en', label: 'English', nativeLabel: 'English', direction: 'ltr' },
  { code: 'kk', label: 'Kazakh', nativeLabel: 'Қазақша', direction: 'ltr' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe', direction: 'ltr' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', direction: 'ltr' },
];

const initialState: Record<LocaleCode, LocaleMeta> = Object.fromEntries(
  FIRST_STAGE_LOCALES.map((meta) => [meta.code, meta])
);

const store = createStore<Record<LocaleCode, LocaleMeta>>(initialState);

function registerLocale(meta: LocaleMeta): void {
  store.setState((prev) => ({ ...prev, [meta.code]: meta }));
}

function listLocales(): LocaleMeta[] {
  return Object.values(store.getState());
}

function getLocaleMeta(code: LocaleCode): LocaleMeta | undefined {
  return store.getState()[code];
}

function isSupported(code: LocaleCode): boolean {
  return code in store.getState();
}

export const localeRegistry = {
  store,
  registerLocale,
  listLocales,
  getLocaleMeta,
  isSupported,
};