/**
 * Сопоставление статических (не параметризованных) текстов истории изменений
 * сущностей/справочников с ключами словаря Translation Management.
 *
 * История генерируется в EntityStoreContext.tsx / DictionaryStoreContext.tsx
 * (бизнес-логика не меняется). Здесь — только слой отображения: если текст
 * события известен, показываем перевод; если нет (например, динамический
 * diff вида "Изменено: название «X» → «Y»") — по требованию fallback
 * показываем исходный (русский) текст как есть.
 */
const STATIC_ACTION_KEY: Record<string, string> = {
  'Сущность создана': 'dict.app:historyEntityCreated',
  'Сущность архивирована': 'dict.app:historyEntityArchived',
  'Сущность восстановлена из архива': 'dict.app:historyEntityRestored',
  'Данные обновлены без изменений': 'dict.app:historyNoChanges',
};

export const historyActionKey = (action: string): string | null => STATIC_ACTION_KEY[action] ?? null;
