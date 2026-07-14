import { ISODateString } from '../types';

/**
 * Типы Clearance Package — центральной сущности модуля «Предварительный
 * допуск персонала». Именно вокруг Пакета допуска строится весь процесс
 * допуска работника: какие матрицы требований к нему применены, какие
 * требования нужно выполнить, как проходят независимые параллельные проверки
 * ОТ/ПБ и Службы безопасности, какой итоговый статус присвоен, и полная
 * история/журнал оснований всех решений.
 *
 * На этом этапе реализована только архитектура: модели данных, хранение,
 * жизненный цикл статусов, история и журнал решений. Бизнес-логика проверки
 * документов, автоматические расчёты итогового статуса, пользовательские
 * интерфейсы проверки (формы ОТ/ПБ, Службы безопасности, подрядчика) НЕ
 * реализованы.
 */

/**
 * Статус жизненного цикла Пакета допуска.
 *  - draft            — черновик, формируется подрядчиком/ответственным
 *  - under_review      — отправлен, проверяется ОТ/ПБ и Службой безопасности параллельно
 *  - needs_revision    — возвращён на доработку (одной из сторон или обеими)
 *  - awaiting_decision — обе обязательные стороны приняли решение, ожидает
 *                        расчёта итогового статуса платформой Noventra
 *  - cleared           — работник допущен
 *  - not_cleared       — работнику отказано в допуске
 *  - suspended         — допуск временно приостановлен
 *  - archived          — пакет в архиве (закрыт при смене организации или вручную)
 */
export type PackageStatus =
  | 'draft'
  | 'under_review'
  | 'needs_revision'
  | 'awaiting_decision'
  | 'cleared'
  | 'not_cleared'
  | 'suspended'
  | 'archived';

/* ------------------------------------------------------------------------ */
/* 1. Общая информация                                                      */
/* ------------------------------------------------------------------------ */

/**
 * Ссылка на организационный контекст пакета — все поля являются id узлов
 * иерархии платформы (src/data/entities.ts: Node.id), но Clearance Package
 * не импортирует модуль иерархии напрямую, чтобы не создавать жёсткую
 * связь между модулями — только хранит ссылки по id.
 */
export interface ClearancePackageScope {
  organizationId: string;
  projectId?: string;
  objectId?: string;
}

/* ------------------------------------------------------------------------ */
/* 2. Применённые матрицы требований                                        */
/* ------------------------------------------------------------------------ */

/**
 * Ссылка на матрицу требований (Requirement Matrix Engine), применённую при
 * формировании пакета. Хранит снимок (matrixName/matrixVersion) на момент
 * применения — если матрица позже изменится или будет заархивирована, пакет
 * сохранит информацию о том, какая версия использовалась.
 *
 * reasonLabelKey объясняет, ПОЧЕМУ матрица была применена (матрица
 * организации / проекта / вида работ / гражданства и т.д.) — ссылается на
 * измерение критериев (MatrixCriteriaDimensionDefinition.labelKey), которое
 * стало основанием для применения.
 */
export interface AppliedMatrixRef {
  id: string;
  matrixId: string;
  matrixName: string;
  matrixVersion: number;
  reasonLabelKey: string;
  appliedAt: ISODateString;
}

/* ------------------------------------------------------------------------ */
/* 3. Требования пакета                                                     */
/* ------------------------------------------------------------------------ */

/**
 * Категория требования — открытый реестр (см. requirementCategoryRegistry),
 * расширяемый без изменения архитектуры Пакета допуска. Изначально
 * зарегистрированы: документы, обучение, медосмотры, квалификация,
 * требования Службы безопасности, требования склада СИЗ.
 */
export type RequirementCategoryId = string;

export interface RequirementCategoryDefinition {
  id: RequirementCategoryId;
  labelKey: string;
  icon: string;
}

/**
 * Одно требование внутри Пакета допуска. mandatory разделяет требования на
 * обязательные и дополнительные (см. п.3 ТЗ). sourceMatrixId — ссылка на
 * AppliedMatrixRef.id, из которой требование было сформировано (для
 * прослеживаемости — почему это требование появилось в пакете).
 *
 * editableByContractor — можно ли подрядчику редактировать это требование
 * прямо сейчас. По умолчанию false: после отправки пакета на проверку
 * подрядчик не может изменять требования (п.9 ТЗ). Разрешается редактирование
 * только когда пакет возвращён на доработку (status = 'needs_revision') и
 * только для требований, явно указанных проверяющим (см.
 * PackageReview.requestedRevisionRequirementIds).
 */
export interface PackageRequirement {
  id: string;
  categoryId: RequirementCategoryId;
  mandatory: boolean;
  sourceMatrixId?: string;
  /** Ссылка на список Reference Data Engine (используется для категории 'documents'). */
  referenceItemId?: string;
  description?: string;
  editableByContractor: boolean;
}

/* ------------------------------------------------------------------------ */
/* 4–5. Независимые параллельные проверки ОТ/ПБ и Службы безопасности       */
/* ------------------------------------------------------------------------ */

/**
 * Проверяющая сторона независимой параллельной проверки пакета. Используется
 * не только полями otPbReview/securityReview самого пакета, но и всеми
 * сопутствующими архитектурными сущностями (Notification Queue, Review Queue,
 * Return Reason), которым нужно адресовать что-то конкретной стороне, не
 * дублируя более широкий DecisionRole (который включает ещё 'contractor' и
 * 'system').
 */
export type ReviewSide = 'ot_pb' | 'security';

/**
 * Статус решения одной проверяющей стороны. Обе стороны (ОТ/ПБ и Служба
 * безопасности) работают полностью независимо друг от друга:
 *  - каждая сторона видит статус другой, но не может его изменить;
 *  - ни одна сторона не ждёт решения другой — проверки идут параллельно;
 *  - итоговый статус пакета (PackageStatus) рассчитывает только платформа
 *    Noventra после того, как обе обязательные стороны вынесли решение
 *    (расчёт — бизнес-логика, на этом этапе не реализуется).
 */
export type ReviewDecisionStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'revision_requested';

/**
 * Независимый раздел проверки одной стороны (ОТ/ПБ или Службы безопасности).
 * Структура одинакова для обеих сторон — они равноправны и не зависят друг
 * от друга; конкретная роль стороны хранится не в этой структуре, а в имени
 * поля на ClearancePackage (otPbReview / securityReview).
 *
 * matrixVersionSnapshotIds фиксирует, по каким именно снимкам версий матриц
 * (см. RequirementMatrixVersionSnapshot) выполнялась ИМЕННО эта проверка —
 * даже если после решения матрица изменится, известно, какая версия
 * фактически проверялась этой стороной.
 */
export interface PackageReview {
  status: ReviewDecisionStatus;
  reviewer?: string;
  decidedAt?: ISODateString;
  comment?: string;
  /** Требования, которые проверяющий указал доработать (используется при status = 'revision_requested'). */
  requestedRevisionRequirementIds?: string[];
  /** Снимки версий матриц (RequirementMatrixVersionSnapshot.id), по которым выполнена проверка. */
  matrixVersionSnapshotIds?: string[];
}

/* ------------------------------------------------------------------------ */
/* 6. История изменений                                                     */
/* ------------------------------------------------------------------------ */

/** Запись полной истории изменений пакета (по образцу MatrixChangeLogEntry). */
export interface PackageHistoryEntry {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestamp: ISODateString;
}

/* ------------------------------------------------------------------------ */
/* 7. Журнал решений (Decision Log)                                         */
/* ------------------------------------------------------------------------ */

/**
 * Роль автора решения. Открытый строковый тип — платформа может в будущем
 * добавить новые роли (например, куратора или арбитра), не меняя архитектуру.
 */
export type DecisionRole = 'contractor' | 'ot_pb' | 'security' | 'system';

/**
 * Отдельная (не встроенная в пакет) структура хранения оснований всех
 * решений пользователей по пакету — почему пакет отправлен, почему одобрен,
 * почему отклонён, почему возвращён на доработку и т.д. justification
 * обязателен: каждое решение должно иметь зафиксированное основание.
 */
export interface DecisionLogEntry {
  id: string;
  packageId: string;
  actor: string;
  role: DecisionRole;
  /** Тип решения — открытый строковый тип (submit/approve/reject/request_revision/...). */
  decisionType: string;
  justification: string;
  relatedRequirementIds?: string[];
  timestamp: ISODateString;
}

export interface RecordDecisionInput {
  packageId: string;
  actor: string;
  role: DecisionRole;
  decisionType: string;
  justification: string;
  relatedRequirementIds?: string[];
}

/* ------------------------------------------------------------------------ */
/* 8. Requirement Matrix Version — точная версия матрицы на момент проверки */
/* ------------------------------------------------------------------------ */

/**
 * Снимок точной версии матрицы требований на момент, когда по ней
 * выполнялась проверка пакета. Отличается от AppliedMatrixRef: AppliedMatrixRef
 * фиксирует, что матрица была ПРИМЕНЕНА при формировании требований пакета;
 * RequirementMatrixVersionSnapshot фиксирует, какая именно версия матрицы
 * была ЗАФИКСИРОВАНА для нужд конкретной проверки (PackageReview) — это
 * необходимо, так как матрица может измениться после отправки пакета, но
 * решение проверяющей стороны должно оставаться привязанным к той версии,
 * которую она реально видела и оценивала.
 *
 * snapshot хранит неизменяемую копию значимых для проверки полей матрицы на
 * момент фиксации — не ссылку, а именно копию, чтобы будущее изменение или
 * архивирование матрицы не могло задним числом исказить основание уже
 * принятого решения.
 */
export interface RequirementMatrixVersionSnapshot {
  id: string;
  packageId: string;
  matrixId: string;
  matrixVersion: number;
  /** Неизменяемая копия значимых полей матрицы на момент фиксации снимка. */
  snapshot: {
    name: string;
    priority: string;
    mandatory: boolean;
    requiredDocumentTypeIds: string[];
    optionalDocumentTypeIds: string[];
  };
  capturedAt: ISODateString;
}

/* ------------------------------------------------------------------------ */
/* 5 (ТЗ доработки). Return Reason — причина возврата на доработку          */
/* ------------------------------------------------------------------------ */

/**
 * Причина возврата пакета на доработку. Отдельная от PackageReview структура:
 * PackageReview хранит ТЕКУЩЕЕ состояние проверки стороны, а ReturnReason —
 * это неизменяемая, накопительная (append-only) запись каждого отдельного
 * случая возврата, включая явный срок устранения (dueDate) — важно для
 * будущей Review Queue/SLA (см. core/clearance-package/review-queue).
 */
export interface ReturnReason {
  id: string;
  packageId: string;
  returnedBySide: ReviewSide;
  returnedBy: string;
  reason: string;
  comment?: string;
  /** Требования, которые нужно исправить (пересекается с PackageReview.requestedRevisionRequirementIds). */
  relatedRequirementIds: string[];
  returnedAt: ISODateString;
  /** Срок, до которого подрядчик обязан устранить замечания. */
  dueDate?: ISODateString;
}

export interface RecordReturnReasonInput {
  packageId: string;
  returnedBySide: ReviewSide;
  returnedBy: string;
  reason: string;
  comment?: string;
  relatedRequirementIds: string[];
  dueDate?: ISODateString;
}

/* ------------------------------------------------------------------------ */
/* 6 (ТЗ доработки). Resubmission — повторная отправка того же пакета       */
/* ------------------------------------------------------------------------ */

/**
 * Запись о повторной отправке ТОГО ЖЕ пакета после устранения замечаний
 * (п.6 ТЗ доработки): «повторная отправка того же пакета после исправлений
 * без создания нового». Отдельная append-only структура (не поле пакета) —
 * пакет может проходить цикл needs_revision → under_review многократно, и
 * каждый цикл фиксируется отдельной записью, ссылающейся на ReturnReason,
 * из-за которой доработка потребовалась.
 */
export interface ResubmissionEntry {
  id: string;
  packageId: string;
  /** ReturnReason.id, после устранения которой выполнена эта повторная отправка. */
  returnReasonId?: string;
  resubmittedBy: string;
  comment?: string;
  /** Требования, которые были фактически изменены к моменту повторной отправки. */
  updatedRequirementIds: string[];
  resubmittedAt: ISODateString;
  /** Порядковый номер повторной отправки в рамках пакета (1, 2, 3, ...). */
  attemptNumber: number;
}

export interface ResubmitPackageInput {
  packageId: string;
  returnReasonId?: string;
  resubmittedBy: string;
  comment?: string;
  updatedRequirementIds: string[];
}

/* ------------------------------------------------------------------------ */
/* Единая сущность Пакета допуска                                           */
/* ------------------------------------------------------------------------ */

export interface ClearancePackage {
  id: string;
  /** Уникальный человекочитаемый номер пакета (например, CP-2026-000123). */
  packageNumber: string;

  /* Общая информация */
  workerId: string;
  /** Снимок имени работника для отображения (Worker Engine ещё не реализован). */
  workerName?: string;
  scope: ClearancePackageScope;
  status: PackageStatus;
  createdAt: ISODateString;
  createdBy: string;
  updatedAt: ISODateString;
  version: number;

  /* Применённые матрицы требований */
  appliedMatrices: AppliedMatrixRef[];

  /* Требования пакета (обязательные/дополнительные различаются полем mandatory) */
  requirements: PackageRequirement[];

  /* Независимые параллельные проверки */
  otPbReview: PackageReview;
  securityReview: PackageReview;

  /* История изменений */
  history: PackageHistoryEntry[];

  /** Если пакет создан при переходе работника из другой организации — id пакета-предшественника. */
  previousPackageId?: string;

  /**
   * Счётчик повторных отправок того же пакета (см. ResubmissionEntry, п.6
   * ТЗ доработки) — увеличивается при каждой повторной отправке после
   * needs_revision, сам пакет при этом не пересоздаётся.
   */
  resubmissionCount: number;
}

/* ------------------------------------------------------------------------ */
/* Входные данные операций сервиса                                          */
/* ------------------------------------------------------------------------ */

export interface CreateClearancePackageInput {
  workerId: string;
  workerName?: string;
  scope: ClearancePackageScope;
  createdBy: string;
}

export interface UpdateClearancePackageInput
  extends Partial<Omit<ClearancePackage, 'id' | 'packageNumber' | 'version' | 'history' | 'createdAt' | 'createdBy' | 'updatedAt'>> {
  changedBy: string;
  changeDescription: string;
}

export interface ClearancePackageQueryFilter {
  search?: string;
  workerId?: string;
  organizationId?: string;
  projectId?: string;
  objectId?: string;
  status?: PackageStatus;
}