import { useStore } from '../shared/useStore';
import { referenceListRegistry } from './referenceListRegistry';
import { ReferenceListId } from './types';

/**
 * React-хук доступа к справочному списку Reference Data Engine.
 * Компонент подписывается на реестр — если список будет заменён реальными
 * данными (вместо заглушки), UI обновится сам, без изменения кода компонента.
 */
export function useReferenceList(id: ReferenceListId) {
  const lists = useStore(referenceListRegistry.store);
  return {
    definition: lists[id],
    items: lists[id]?.items ?? [],
  };
}
