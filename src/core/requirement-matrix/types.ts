import { ReferenceListId } from '../reference-data';

/**
 * Типы Requirement Matrix Engine — универсального механизма матриц требований
 * платформы Noventra Core.
 *
 * Матрица требований — это не специфичный для персонала инструмент: один и тот
 * же механизм (типы + реестр + UI-компоненты) в будущем используется для
 * допуска техники, подрядчиков, документов, нарядов-допусков и других модулей —
 * они лишь регистрируют свой домен применения (см. matrixDomainRegistry) и,
 * при необходимости, дополнительные измерения критериев (см.
 * matrixCriteriaDimensionRegistry), не меняя архитектуру самого движка.
 *
 * Справочные данные (профессии, должности, гражданства, объекты и т.д.)
 * матрица НЕ хранит сама — она лишь ссылается на списки Reference Data Engine
 * (см. core/reference-data) по ReferenceListId.
 *
 * На этом этапе реализована только архитектура: хранение, регистрация,
 * версионирование, копирование, архивирование и поиск/фильтрация матриц.
 * Бизнес-логика проверки (сопоставление матрицы с конкретным работником/
 * техникой/подрядчиком), автоматические расчёты, загрузка документов и
 * согласование НЕ реализованы.
 */

/** Статус жизненного цикла матрицы в реестре. */
export type MatrixStatus = 'draft' | 'active' | 'archived';

/**
 * Приоритет матрицы среди других матриц, применимых к одной и той же
 * ситуации. Использует ту же пятиуровневую шкалу терминологии платформы,
 * что и Business Rules Engine (законодательство → корпоративные →
 * проектные → заказчика → временные), но является самостоятельным типом —
 * Requirement Matrix Engine не зависит от Business Rules Engine.
 */
export const MatrixPriorityLevel = {
  Legislation: 'legislation',
  Corporate: 'corporate',
  Project: 'project',
  Customer: 'customer',
  Temporary: 'temporary',
} as const;

export type MatrixPriorityLevelValue = (typeof MatrixPriorityLevel)[keyof typeof MatrixPriorityLevel];

/**
 * Домен применения матрицы — открытый реестр (см. matrixDomainRegistry),
 * который расширяется будущими модулями (personnel-clearance,
 * equipment-clearance, contractor-clearance, document-verification,
 * work-permit и т.д.) без изменения архитектуры движка.
 */
export type MatrixDomainId = string;

export interface MatrixDomainDefinition {
  id: MatrixDomainId;
  labelKey: string;
  icon: string;
}

/**
 * Измерение критериев матрицы — открытый реестр (см.
 * matrixCriteriaDimensionRegistry): каждое измерение ссылается на список
 * Reference Data Engine и подписывает одну вкладку карточки матрицы
 * («Категории работников», «Гражданство», «Профессии», «Должности»,
 * «Виды работ», «Проекты», «Объекты», «Организации» и т.д.). Новые
 * измерения добавляются регистрацией — без изменения движка.
 */
export interface MatrixCriteriaDimensionDefinition {
  id: string;
  /** Домен, к карточкам которого добавляется вкладка этого измерения. */
  domain: MatrixDomainId;
  labelKey: string;
  icon: string;
  referenceListId: ReferenceListId;
  /** Порядок вкладки среди измерений одного домена. */
  order: number;
}

/**
 * Один критерий применения, явно добавленный администратором в единый
 * раздел «Критерии применения» карточки матрицы. dimensionId ссылается на
 * зарегистрированный тип критерия (см. matrixCriteriaDimensionRegistry) —
 * в матрице хранятся только критерии, которые администратор реально добавил
 * (не все зарегистрированные типы домена сразу).
 *
 * enabled — включён ли критерий (выключенный критерий сохраняется в матрице,
 * но не учитывается). mode 'all' — критерий не ограничивает применение
 * матрицы (применяется ко всем значениям списка); 'specific' — матрица
 * применяется только к перечисленным selectedItemIds (id элементов из
 * Reference Data Engine).
 */
export interface MatrixCriteriaSelection {
  dimensionId: string;
  /** Включён ли критерий в раздел «Критерии применения» (можно временно отключить, не удаляя). */
  enabled: boolean;
  mode: 'all' | 'specific';
  selectedItemIds: string[];
  /** Является ли соответствие этому критерию обязательным условием применения матрицы. */
  mandatory: boolean;
}

/**
 * Требование к документу («Обязательные документы» / «Дополнительные
 * документы» — различаются полем mandatory). documentTypeId ссылается на
 * список типов документов Reference Data Engine (в будущем).
 */
export interface MatrixDocumentRequirement {
  id: string;
  documentTypeId: string;
  mandatory: boolean;
  description?: string;
}

/** Область применения матрицы верхнего уровня («Область применения»). */
export type MatrixScopeType = 'global' | 'project' | 'object' | 'contractor';

export interface MatrixScope {
  scopeType: MatrixScopeType;
  description?: string;
}

/** Запись истории изменений матрицы (версия, автор, дата, причина). */
export interface MatrixChangeLogEntry {
  version: number;
  changedBy: string;
  changedAt: string;
  changeDescription: string;
}

/**
 * Единая сущность матрицы требований — универсальная для всех доменов
 * применения платформы.
 */
export interface RequirementMatrix {
  id: string;
  name: string;
  description?: string;
  domain: MatrixDomainId;
  status: MatrixStatus;
  priority: MatrixPriorityLevelValue;
  /** Является ли матрица в целом обязательной к применению («Настройки обязательности»). */
  mandatory: boolean;
  scope: MatrixScope;
  requiredDocuments: MatrixDocumentRequirement[];
  optionalDocuments: MatrixDocumentRequirement[];
  criteria: MatrixCriteriaSelection[];
  version: number;
  history: MatrixChangeLogEntry[];
  /** Если матрица создана копированием — id матрицы-источника. */
  duplicatedFrom?: string;
  createdAt: string;
  updatedAt: string;
}

/** Входные данные для создания новой матрицы (версия 1). */
export interface CreateMatrixInput {
  name: string;
  description?: string;
  domain: MatrixDomainId;
  priority: MatrixPriorityLevelValue;
  mandatory: boolean;
  scope: MatrixScope;
  changedBy: string;
  changeDescription: string;
}

/** Входные данные для версионированного обновления матрицы. */
export interface UpdateMatrixInput
  extends Partial<Omit<RequirementMatrix, 'id' | 'version' | 'history' | 'createdAt' | 'updatedAt'>> {
  changedBy: string;
  changeDescription: string;
}

/** Фильтр поиска матриц в реестре (вкладка «Матрицы требований»). */
export interface MatrixQueryFilter {
  search?: string;
  domain?: MatrixDomainId;
  status?: MatrixStatus;
  priority?: MatrixPriorityLevelValue;
}