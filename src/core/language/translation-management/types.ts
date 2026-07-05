import { LocaleCode } from '../types';

/**
 * Типы Translation Management — центрального словаря платформы Noventra.
 * Модуль надстроен над Language Engine: переводы термина синхронизируются
 * в существующий translationRegistry, поэтому рендеринг по-прежнему идёт
 * через единый useTranslate() без изменения его кода.
 */
export type TranslationStatus = 'approved' | 'draft' | 'needs_review' | 'ai_generated';

export interface TranslationTerm {
  /** Уникальный ключ термина в формате "<namespace>.<localKey>" */
  key: string;
  namespace: string;
  /** Переводы термина по локалям (ru, en, kk, tr, zh и любые будущие) */
  translations: Partial<Record<LocaleCode, string>>;
  status: TranslationStatus;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface UpsertTermInput {
  key: string;
  namespace: string;
  translations: Partial<Record<LocaleCode, string>>;
  status?: TranslationStatus;
  actor: string;
}

export interface MissingTermEntry {
  key: string;
  missingLocales: LocaleCode[];
}
