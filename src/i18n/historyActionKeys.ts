import { TranslateFn } from '@/core';

/**
 * Перевод текста истории изменений сущностей/справочников (namespace dict.app).
 *
 * История генерируется в EntityStoreContext.tsx (бизнес-логика НЕ меняется —
 * формат строки event.action остаётся прежним). Этот модуль — только слой
 * отображения: превращает как статические фразы ("Сущность создана" и т.п.),
 * так и динамический diff-текст (например "Изменено: название «X» → «Y», код «A» → «B»")
 * в полностью переведённую строку на активном языке платформы.
 *
 * Если строка не распознана ни одним из паттернов — возвращается как есть
 * (fallback на исходный текст, как того требует платформа).
 */
const STATIC_ACTION_KEY: Record<string, string> = {
  'Сущность создана': 'dict.app:historyEntityCreated',
  'Сущность архивирована': 'dict.app:historyEntityArchived',
  'Сущность восстановлена из архива': 'dict.app:historyEntityRestored',
  'Данные обновлены без изменений': 'dict.app:historyNoChanges',
  // Демонстрационные записи из src/data/entities.ts (defaultHistory)
  'Изменён ответственный': 'dict.app:historyOwnerChangedDemo',
  'Обновлён статус': 'dict.app:historyStatusChangedDemo',
};

/** Известные шаблоны отдельных изменений внутри "Изменено: ...". */
const CHANGE_PATTERNS: Array<{ regex: RegExp; key: string }> = [
  { regex: /^название «(.*)» → «(.*)»$/, key: 'dict.app:historyChangeName' },
  { regex: /^код «(.*)» → «(.*)»$/, key: 'dict.app:historyChangeCode' },
  { regex: /^ответственный «(.*)» → «(.*)»$/, key: 'dict.app:historyChangeOwner' },
];

function translateSingleChange(part: string, t: TranslateFn): string {
  const trimmed = part.trim();
  if (trimmed === 'описание') return t('dict.app:historyChangeDescription');

  for (const { regex, key } of CHANGE_PATTERNS) {
    const match = trimmed.match(regex);
    if (match) {
      return t(key, { params: { before: match[1], after: match[2] } });
    }
  }

  return trimmed;
}

/** Ключ статического (не параметризованного) действия истории, если он известен. */
export const historyActionKey = (action: string): string | null => STATIC_ACTION_KEY[action] ?? null;

/**
 * Полный перевод текста истории изменений: статические фразы — по ключу,
 * динамический diff вида "Изменено: ..." — разбор и перевод каждой части.
 */
export function translateHistoryAction(action: string, t: TranslateFn): string {
  const staticKey = historyActionKey(action);
  if (staticKey) return t(staticKey);

  const updatedMatch = action.match(/^Изменено: (.+)$/);
  if (updatedMatch) {
    const changes = updatedMatch[1]
      .split(', ')
      .map((part) => translateSingleChange(part, t));
    return t('dict.app:historyUpdatedPrefix', { params: { changes: changes.join(', ') } });
  }

  return action;
}
