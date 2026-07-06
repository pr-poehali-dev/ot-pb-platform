/**
 * Хелперы ключей словаря Translation Management для метаданных справочников
 * (namespace dict.dictMeta, см. src/i18n/dictionary-seed/categories/dictionaryMeta.ts).
 * Ключи формируются из id справочника (DictionaryConfig.id из src/data/dictionaries.ts).
 */
export const dictMetaTitleKey = (dictionaryId: string) => `dict.dictMeta:${dictionaryId}Title`;
export const dictMetaDescKey = (dictionaryId: string) => `dict.dictMeta:${dictionaryId}Desc`;
