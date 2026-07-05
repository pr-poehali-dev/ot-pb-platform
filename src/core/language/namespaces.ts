/**
 * Стандартные namespace'ы Language Engine.
 *
 * Модули регистрируют свои переводы под этими namespace'ами (или под
 * собственными, специфичными для модуля, например 'hse.violations').
 * Это готовит архитектуру перевода для всех перечисленных категорий UI,
 * не привязываясь к конкретному модулю платформы.
 */
export const LanguageNamespace = {
  /** Пункты навигационного меню, разделы платформы */
  Menu: 'menu',
  /** Подписи кнопок и действий (Создать, Сохранить, Отмена и т.д.) */
  Buttons: 'buttons',
  /** Подписи полей форм, плейсхолдеры, подсказки */
  Forms: 'forms',
  /** Заголовки колонок таблиц, состояния пустых списков */
  Tables: 'tables',
  /** Тексты уведомлений (см. core/notifications) */
  Notifications: 'notifications',
  /** Сообщения об ошибках (валидация, сетевые и системные ошибки) */
  Errors: 'errors',
  /** Тексты печатных документов/шаблонов */
  Documents: 'documents',
  /** Заголовки и подписи отчётов/аналитики */
  Reports: 'reports',
  /** Названия и описания записей единых справочников */
  Dictionaries: 'dictionaries',
  /** Общие переводы платформы (без явного namespace в ключе) */
  Common: 'common',
} as const;

export type LanguageNamespaceValue = (typeof LanguageNamespace)[keyof typeof LanguageNamespace];
