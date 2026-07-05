import { UpsertTermInput } from '@/core';

/** Компактный кортеж термина: [key, ru, en, kk, tr, zh] — для компактного описания словаря. */
export type TermTuple = [key: string, ru: string, en: string, kk: string, tr: string, zh: string];

const SEED_ACTOR = 'system-seed';

/** Преобразование компактных кортежей в формат UpsertTermInput для dictionaryService.bulkImport(). */
export function buildTerms(namespace: string, tuples: TermTuple[]): UpsertTermInput[] {
  return tuples.map(([key, ru, en, kk, tr, zh]) => ({
    key,
    namespace,
    translations: { ru, en, kk, tr, zh },
    status: 'approved',
    actor: SEED_ACTOR,
  }));
}
