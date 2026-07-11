/**
 * Noventra Core Engine — единая точка входа в ядро платформы.
 *
 * Ядро объединяет 14 независимых, переиспользуемых сервисов.
 * Ни один из них не содержит бизнес-логики конкретных модулей (HSE и т.д.) —
 * все они оперируют универсальным EntityRef { type, id } и могут быть
 * подключены любым будущим модулем платформы.
 *
 * Сервисы ядра:
 *  - event-bus          — шина событий
 *  - notifications      — уведомления
 *  - audit-log          — журнал действий
 *  - file-storage       — файловое хранилище (реестр метаданных)
 *  - comments           — комментарии к сущностям
 *  - attachments        — вложения (связь файл ↔ сущность)
 *  - tags               — теги и назначение тегов
 *  - statuses           — статусы сущностей
 *  - change-history     — история изменений полей ("было → стало")
 *  - search             — глобальный поиск
 *  - global-filters     — глобальные фильтры по контексту
 *  - favorites          — избранное
 *  - recent-items       — последние открытые элементы
 *  - user-settings      — настройки пользователя
 *  - language           — Language Engine (мультиязычность)
 *  - ai-engine          — AI Engine (независимый движок искусственного интеллекта)
 *  - business-rules     — Business Rules Engine (независимый движок бизнес-правил)
 *  - reference-data     — Reference Data Engine (единый движок справочных данных)
 *  - requirement-matrix — Requirement Matrix Engine (универсальный движок матриц требований)
 */

export * from './types';

export * from './event-bus';
export * from './notifications';
export * from './audit-log';
export * from './file-storage';
export * from './comments';
export * from './attachments';
export * from './tags';
export * from './statuses';
export * from './change-history';
export * from './search';
export * from './global-filters';
export * from './favorites';
export * from './recent-items';
export * from './user-settings';
export * from './language';
export * from './ai-engine';
export * from './business-rules';
export * from './reference-data';
export * from './requirement-matrix';