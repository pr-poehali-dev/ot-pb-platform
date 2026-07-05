import { useStore } from '../../shared/useStore';
import { dictionaryService } from './dictionaryService';

/**
 * Хук доступа к словарю Translation Management — для будущего UI управления
 * переводами (список терминов, статусы, редактирование).
 */
export function useDictionary(namespace?: string) {
  const state = useStore(dictionaryService.store);
  const terms = Object.values(state).filter((t) => !namespace || t.namespace === namespace);

  return {
    terms,
    upsertTerm: dictionaryService.upsertTerm,
    bulkImport: dictionaryService.bulkImport,
    missingTranslations: dictionaryService.listMissingTranslations(),
  };
}
