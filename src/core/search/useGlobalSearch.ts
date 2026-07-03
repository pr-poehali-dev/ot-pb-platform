import { useMemo, useState } from 'react';
import { searchService } from './searchService';

/**
 * Хук глобального поиска — используется общей строкой поиска в шапке платформы.
 */
export function useGlobalSearch() {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchService.search(query), [query]);

  return {
    query,
    setQuery,
    results,
    indexDocument: searchService.indexDocument,
    removeDocument: searchService.removeDocument,
  };
}
