import { useEffect, useState } from 'react';

const FAVORITES_KEY = 'noventra.dictionaries.favorites';
const RECENT_KEY = 'noventra.dictionaries.recent';
const RECENT_LIMIT = 5;

const readList = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const writeList = (key: string, list: string[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
};

/**
 * UI-preference хук: избранные и последние открытые справочники.
 * Хранит только предпочтения интерфейса (не бизнес-данные), персистит в localStorage.
 */
export const useDictionaryPreferences = () => {
  const [favorites, setFavorites] = useState<string[]>(() => readList(FAVORITES_KEY));
  const [recent, setRecent] = useState<string[]>(() => readList(RECENT_KEY));

  useEffect(() => {
    writeList(FAVORITES_KEY, favorites);
  }, [favorites]);

  useEffect(() => {
    writeList(RECENT_KEY, recent);
  }, [recent]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const pushRecent = (id: string) => {
    setRecent((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, RECENT_LIMIT));
  };

  return { favorites, recent, isFavorite, toggleFavorite, pushRecent };
};
