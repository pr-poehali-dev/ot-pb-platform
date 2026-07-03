import { useStore } from '../shared/useStore';
import { favoriteService } from './favoriteService';
import { EntityRef } from '../types';

export function useFavorites(type?: string) {
  const all = useStore(favoriteService.store);
  const favorites = type ? all.filter((f) => f.type === type) : all;

  return {
    favorites,
    isFavorite: (entity: EntityRef) => favorites.some((f) => f.type === entity.type && f.id === entity.id),
    toggle: favoriteService.toggle,
  };
}
