export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  density: 'comfortable' | 'compact';
  /** Произвольные настройки будущих модулей, ключ = namespace модуля */
  custom: Record<string, unknown>;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'ru',
  density: 'comfortable',
  custom: {},
};
