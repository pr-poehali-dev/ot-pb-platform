/**
 * Утилита персистентности в localStorage.
 * Используется сервисами ядра (избранное, недавние, настройки и т.д.),
 * которым нужно переживать перезагрузку страницы.
 */
export function readPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writePersisted<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (private mode, quota exceeded, etc.)
  }
}
