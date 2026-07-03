import { createStore } from '../shared/createStore';
import { SearchDocument, SearchResult } from './types';

/**
 * Глобальный поиск платформы — универсальный индекс документов.
 * Любой модуль регистрирует свои сущности как SearchDocument (title, subtitle, keywords),
 * а сервис предоставляет единую точку полнотекстового поиска по всей платформе.
 * Реализован как простое indexOf-сравнение — без бизнес-логики ранжирования.
 */
const store = createStore<SearchDocument[]>([]);

function indexDocument(doc: SearchDocument): void {
  store.setState((prev) => [
    ...prev.filter((d) => !(d.entity.type === doc.entity.type && d.entity.id === doc.entity.id)),
    doc,
  ]);
}

function removeDocument(entityType: string, entityId: string): void {
  store.setState((prev) => prev.filter((d) => !(d.entity.type === entityType && d.entity.id === entityId)));
}

function search(query: string, limit = 20): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return store
    .getState()
    .map((doc) => {
      const haystack = [doc.title, doc.subtitle, ...(doc.keywords ?? [])].join(' ').toLowerCase();
      const index = haystack.indexOf(q);
      if (index === -1) return null;
      const score = index === 0 ? 2 : 1;
      return { ...doc, score } as SearchResult;
    })
    .filter((r): r is SearchResult => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export const searchService = {
  store,
  indexDocument,
  removeDocument,
  search,
};
