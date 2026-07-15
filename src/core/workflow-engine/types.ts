import { ISODateString } from '../types';

/**
 * Universal Workflow State Machine — универсальный, domain-agnostic движок
 * жизненного цикла сущностей платформы Noventra Core, реализованный как
 * расширение Business Rules Engine (использует тот же принцип открытых
 * реестров и версионирования, но НЕ изменяет ни один существующий файл
 * core/business-rules/*).
 *
 * Ядро этого модуля ничего не знает о персонале, технике, подрядчиках,
 * документах или нарядах-допусках — каждый домен регистрирует собственный
 * WorkflowDefinition (состояния, дорожки проверки, переходы, эскалацию,
 * SLA, политику разрешения конфликтов), не изменяя типы и сервисы этого
 * модуля. Домен identifies себя строкой domainId (открытый тип, как
 * MatrixDomainId в Requirement Matrix Engine).
 *
 * На этом этапе реализованы ТОЛЬКО типы, реестр (workflowRegistry),
 * валидатор регистрации (workflowDefinitionValidator), структурный guard
 * переходов (workflowTransitionGuard) и чистый анализатор графа
 * (workflowGraphAnalyzer). Никакого выполнения бизнес-переходов,
 * прикладных правил конкретного домена (personnel-clearance и т.д.) здесь
 * нет — они будут зарегистрированы отдельно на следующем этапе.
 */

/* ------------------------------------------------------------------------ */
/* Категории состояний — единый закрытый список для всей платформы          */
/* ------------------------------------------------------------------------ */

/**
 * Универсальная категория состояния workflow — одна и та же для любого
 * домена (персонал, техника, подрядчики, документы, наряды-допуски), что
 * позволяет Dashboard/Analytics/Notification Queue работать с любым
 * доменом, не зная его конкретных id состояний (по аналогии с тем, как
 * RuleOutcome — единый перечень для всех категорий бизнес-правил).
 *
 *  - draft                  — формируется, ещё не отправлен
 *  - submitted               — отправлен, идёт независимая параллельная проверка
 *  - blocked                 — возвращён на доработку
 *  - pending_final_decision  — все обязательные дорожки вынесли решение,
 *                              ожидает агрегации системой
 *  - approved                — терминальное положительное решение
 *  - rejected                — терминальное отрицательное решение
 *  - suspended               — временно приостановлен
 *  - archived                — закрыт и выведен из активного оборота
 *                              (поглощающее состояние: не имеет исходящих
 *                              переходов, см. workflowDefinitionValidator)
 */
export const WorkflowStateCategory = {
  Draft: 'draft',
  Submitted: 'submitted',
  Blocked: 'blocked',
  PendingFinalDecision: 'pending_final_decision',
  Approved: 'approved',
  Rejected: 'rejected',
  Suspended: 'suspended',
  Archived: 'archived',
} as const;

export type WorkflowStateCategoryValue = (typeof WorkflowStateCategory)[keyof typeof WorkflowStateCategory];

/* ------------------------------------------------------------------------ */
/* Роли участников — базовые семантические роли + доменные роли             */
/* ------------------------------------------------------------------------ */

/**
 * Базовая семантическая роль участника workflow — закрытый список,
 * известный ядру. Домен может зарегистрировать сколько угодно собственных
 * ролей (руководитель, заместитель, администратор проекта, уполномоченный
 * представитель заказчика и т.д.), но каждая доменная роль обязана
 * указать, к какой базовой семантике она относится (или 'custom') — это
 * позволяет ядру рассуждать о ролях универсально (например, guard знает,
 * что submitter-подобная роль имеет право на Withdraw Request), не зная
 * имени конкретной роли домена.
 *
 * Намеренно нет базовой роли, обозначающей AI/ИИ — движок не предоставляет
 * семантической категории, которая позволила бы ИИ инициировать переход
 * (см. правило 'ai_role_forbidden' в workflowDefinitionValidator).
 */
export const WorkflowBaseActorRole = {
  /** Инициатор — тот, кто формирует и отправляет сущность (например, подрядчик). */
  Submitter: 'submitter',
  /** Проверяющий одной независимой дорожки (см. WorkflowReviewLaneDefinition). */
  LaneReviewer: 'lane_reviewer',
  /** Административная роль — приостановка, архивирование, force-переходы. */
  Administrator: 'administrator',
  /** Система (Noventra) — автоматические переходы (агрегация решений и т.д.). */
  System: 'system',
} as const;

export type WorkflowBaseActorRoleValue = (typeof WorkflowBaseActorRole)[keyof typeof WorkflowBaseActorRole];

/** Идентификатор роли, объявленной доменом внутри своего WorkflowDefinition.roles. Открытый строковый тип. */
export type WorkflowActorRole = string;

/**
 * Объявление одной роли внутри WorkflowDefinition. Любая роль, упомянутая в
 * allowedRoles перехода, reviewerRole дорожки или escalateToRole правила
 * эскалации, обязана быть предварительно объявлена здесь — это единственный
 * способ для workflowDefinitionValidator проверить «корректность разрешённых
 * ролей», не зная бизнес-смысла роли.
 */
export interface WorkflowActorRoleDefinition {
  id: WorkflowActorRole;
  /** Базовая семантика роли — на что ядро может опереться универсально. */
  base: WorkflowBaseActorRoleValue | 'custom';
  labelKey?: string;
}

/* ------------------------------------------------------------------------ */
/* Состояния                                                                 */
/* ------------------------------------------------------------------------ */

/**
 * Одно состояние конкретного WorkflowDefinition. id — доменный идентификатор
 * состояния (например, 'draft', 'under_review', 'needs_revision' для
 * personnel-clearance), category — универсальная категория (см. выше).
 *
 * isStart помечает единственное начальное состояние графа (ровно одно на
 * WorkflowDefinition — проверяется валидатором). isFinal помечает состояния,
 * из которых допустимо отсутствие исходящих переходов (архивные/терминальные
 * состояния домена) — таких состояний может быть несколько.
 */
export interface WorkflowStateDefinition {
  id: string;
  category: WorkflowStateCategoryValue;
  labelKey?: string;
  isStart: boolean;
  isFinal: boolean;
}

/* ------------------------------------------------------------------------ */
/* Дорожки независимой параллельной проверки (Review Lane)                  */
/* ------------------------------------------------------------------------ */

/**
 * Исход независимой дорожки проверки — то, что раньше в Clearance Package
 * называлось ReviewDecisionStatus, здесь определено заново на уровне
 * generic-движка (без зависимости от типов core/clearance-package), чтобы
 * Workflow Engine оставался полностью самостоятельным модулем.
 */
export const WorkflowLaneOutcome = {
  Pending: 'pending',
  InReview: 'in_review',
  Approved: 'approved',
  Rejected: 'rejected',
  RevisionRequested: 'revision_requested',
} as const;

export type WorkflowLaneOutcomeValue = (typeof WorkflowLaneOutcome)[keyof typeof WorkflowLaneOutcome];

/**
 * Одна независимая дорожка проверки, зарегистрированная доменом (например,
 * «ОТ/ПБ» и «Служба безопасности» для personnel-clearance). Дорожки внутри
 * одного WorkflowDefinition полностью равноправны и не зависят друг от
 * друга — каждая проверяется исключительно по собственному reviewerRole,
 * с собственной SLA Policy (slaPolicy).
 *
 * mandatory разделяет дорожки на обязательные (влияют на итоговый исход
 * через WorkflowConflictResolutionPolicy) и необязательные (учитываются
 * информационно, не блокируют финализацию).
 */
export interface WorkflowReviewLaneDefinition {
  id: string;
  labelKey?: string;
  mandatory: boolean;
  /** Роль, которой принадлежит право выносить решение по этой дорожке. Должна быть объявлена в WorkflowDefinition.roles. */
  reviewerRole: WorkflowActorRole;
  slaPolicy: WorkflowSlaPolicy;
}

/* ------------------------------------------------------------------------ */
/* SLA Policy — полностью конфигурируемая, без зашитых значений             */
/* ------------------------------------------------------------------------ */

/**
 * SLA Policy одной дорожки проверки. Все параметры конфигурируются доменом
 * при регистрации WorkflowDefinition — движок не содержит ни одного
 * жёстко зашитого значения длительности, расписания или числа напоминаний.
 */
export interface WorkflowSlaPolicy {
  /** Базовый срок на проверку, в минутах. */
  defaultDurationMinutes: number;
  /** Срок для срочных проверок, в минутах (если не задан — срочность не поддерживается дорожкой). */
  urgentDurationMinutes?: number;
  /** Рабочие дни недели, 0 (воскресенье) — 6 (суббота). Если не задано — календарь не учитывается. */
  workingDays?: number[];
  /** Начало рабочего окна, формат "HH:mm". */
  workingHoursStart?: string;
  /** Конец рабочего окна, формат "HH:mm". */
  workingHoursEnd?: string;
  /** Календарь праздников (даты, которые не считаются рабочими). */
  holidays?: ISODateString[];
  /** Тип канала уведомлений — открытый строковый тип (email/push/sms/...). */
  notificationType?: string;
  /** Число повторных напоминаний до просрочки/эскалации. */
  reminderCount?: number;
  /** Правила эскалации, применимые к этой дорожке (ссылки на WorkflowEscalationRule.id того же WorkflowDefinition). */
  escalationRuleIds?: string[];
}

/* ------------------------------------------------------------------------ */
/* Эскалация                                                                 */
/* ------------------------------------------------------------------------ */

/** Событие, инициирующее эскалацию. */
export const WorkflowEscalationTrigger = {
  /** Превышен срок SLA дорожки. */
  SlaExceeded: 'sla_exceeded',
  /** Конфликт решений дорожек (например, обе стороны вынесли разные вердикты, требующие арбитража сверх обычной агрегации). */
  LaneConflict: 'lane_conflict',
  /** Ручная эскалация администратором. */
  Manual: 'manual',
} as const;

export type WorkflowEscalationTriggerValue = (typeof WorkflowEscalationTrigger)[keyof typeof WorkflowEscalationTrigger];

/**
 * Правило эскалации. escalateToRole ссылается на роль, УЖЕ объявленную в
 * маршруте домена (руководитель, заместитель, администратор проекта или
 * другая назначенная доменом роль) — движок не вводит отдельную обязательную
 * роль вида "escalation_authority"; какая роль получает эскалацию, целиком
 * решает конфигурация конкретного WorkflowDefinition.
 */
export interface WorkflowEscalationRule {
  id: string;
  trigger: WorkflowEscalationTriggerValue;
  escalateToRole: WorkflowActorRole;
  description?: string;
}

/* ------------------------------------------------------------------------ */
/* Политика разрешения конфликтов дорожек (агрегация исходов)                */
/* ------------------------------------------------------------------------ */

/**
 * Декларативная политика агрегации исходов обязательных дорожек в итоговое
 * решение workflow — по образцу RULE_PRIORITY_RANK Business Rules Engine
 * (ранжирование, а не императивный алгоритм).
 *
 * outcomePrecedence — порядок приоритета исходов при агрегации: первый
 * встретившийся среди обязательных дорожек исход в этом списке побеждает.
 * requireAllMandatoryApprovedForClear — архитектурный инвариант: положительный
 * итог (переход в состояние категории Approved) возможен только если ВСЕ
 * обязательные дорожки вынесли Approved; значение false не проходит валидацию
 * (см. workflowDefinitionValidator, код 'invalid_conflict_policy').
 */
export interface WorkflowConflictResolutionPolicy {
  outcomePrecedence: WorkflowLaneOutcomeValue[];
  requireAllMandatoryApprovedForClear: boolean;
}

/* ------------------------------------------------------------------------ */
/* Условия переходов (WorkflowCondition)                                     */
/* ------------------------------------------------------------------------ */

/**
 * Вид условия перехода — закрытый список декларативных условий, которые
 * умеет проверять движок структурно (сама фактическая проверка данных
 * сущности — задача будущей реализации; здесь только контракт условия).
 *
 *  - always                       — переход не имеет дополнительных условий
 *  - requirements_complete         — все обязательные требования сущности выполнены
 *  - no_unresolved_sync_conflicts  — нет неразрешённых конфликтов Offline Sync
 *  - all_mandatory_lanes_outcome   — ВСЕ обязательные дорожки имеют указанный outcome (laneOutcome)
 *  - any_mandatory_lane_outcome    — ХОТЯ БЫ ОДНА обязательная дорожка имеет указанный outcome
 *  - lane_outcome_equals           — конкретная дорожка (laneId) имеет указанный outcome
 *  - sla_exceeded                  — истёк срок SLA (используется, например, для revision_overdue)
 *  - custom_rule                   — делегирование существующему Business Rules
 *                                    Engine по ruleKey (ruleExecutor.executeRuleKey) —
 *                                    Workflow Engine НЕ создаёт второй движок
 *                                    исполнения условий, а лишь хранит ссылку
 */
export const WorkflowConditionKind = {
  Always: 'always',
  RequirementsComplete: 'requirements_complete',
  NoUnresolvedSyncConflicts: 'no_unresolved_sync_conflicts',
  AllMandatoryLanesOutcome: 'all_mandatory_lanes_outcome',
  AnyMandatoryLaneOutcome: 'any_mandatory_lane_outcome',
  LaneOutcomeEquals: 'lane_outcome_equals',
  SlaExceeded: 'sla_exceeded',
  CustomRule: 'custom_rule',
} as const;

export type WorkflowConditionKindValue = (typeof WorkflowConditionKind)[keyof typeof WorkflowConditionKind];

/**
 * Одно условие перехода. Поля laneOutcome/laneId/ruleKey заполняются только
 * для соответствующих kind (см. комментарии выше) — это проверяется
 * workflowDefinitionValidator (код 'invalid_condition').
 */
export interface WorkflowCondition {
  kind: WorkflowConditionKindValue;
  /** Требуемый исход дорожки — для all_mandatory_lanes_outcome/any_mandatory_lane_outcome/lane_outcome_equals. */
  laneOutcome?: WorkflowLaneOutcomeValue;
  /** Идентификатор конкретной дорожки — обязателен только для lane_outcome_equals. */
  laneId?: string;
  /** Ссылка на ruleKey Business Rules Engine — обязательна только для custom_rule. */
  ruleKey?: string;
  description?: string;
}

/* ------------------------------------------------------------------------ */
/* Действия перехода (WorkflowAction) — декларативные, не исполняемые здесь */
/* ------------------------------------------------------------------------ */

/**
 * Вид действия, которое должно быть выполнено как часть перехода — только
 * декларация (что должно произойти), фактическое исполнение — задача
 * будущей реализации бизнес-логики домена, не этого этапа.
 */
export const WorkflowActionKind = {
  CreateDecisionLogEntry: 'create_decision_log_entry',
  AppendPackageHistory: 'append_package_history',
  NotifyMandatoryLanes: 'notify_mandatory_lanes',
  NotifyRole: 'notify_role',
  IncrementResubmissionCount: 'increment_resubmission_count',
  CaptureMatrixVersionSnapshot: 'capture_matrix_version_snapshot',
  SetReviewQueueOverdue: 'set_review_queue_overdue',
  RaiseReviewQueuePriority: 'raise_review_queue_priority',
  TriggerEscalationRule: 'trigger_escalation_rule',
  Custom: 'custom',
} as const;

export type WorkflowActionKindValue = (typeof WorkflowActionKind)[keyof typeof WorkflowActionKind];

/**
 * Одно декларативное действие перехода. roleId используется для
 * notify_role (кому адресовано уведомление — должна быть объявленная роль),
 * escalationRuleId — для trigger_escalation_rule (ссылка на
 * WorkflowEscalationRule.id того же WorkflowDefinition).
 */
export interface WorkflowAction {
  kind: WorkflowActionKindValue;
  roleId?: WorkflowActorRole;
  escalationRuleId?: string;
  description?: string;
}

/* ------------------------------------------------------------------------ */
/* Переходы (WorkflowTransitionDefinition)                                   */
/* ------------------------------------------------------------------------ */

/**
 * Одно ребро графа состояний. trigger — открытый строковый тип бизнес-
 * действия (submit/resubmit/withdraw_request/suspend/resume/archive/
 * force_transition и т.д.) — движок не ограничивает набор триггеров, это
 * решает домен.
 *
 * isForceTransition помечает переход как Force Transition — такой переход
 * ДОПУСТИМ ТОЛЬКО через явную регистрацию в этом списке (белый список).
 * Общее правило «любое состояние → любое состояние» архитектурно удалено —
 * Force Transition — это обычная запись WorkflowTransitionDefinition с
 * requiresJustification: true и явно суженными from/to/allowedRoles/
 * conditions, как и любой другой переход.
 *
 * requiresJustification обязателен для force-переходов и опционален для
 * обычных (домен решает, какие обычные переходы тоже требуют обоснования —
 * например suspend/resume в утверждённой архитектуре).
 */
export interface WorkflowTransitionDefinition {
  id: string;
  from: string;
  to: string;
  trigger: string;
  allowedRoles: WorkflowActorRole[];
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  requiresJustification: boolean;
  isForceTransition: boolean;
}

/* ------------------------------------------------------------------------ */
/* Корневой объект — WorkflowDefinition                                      */
/* ------------------------------------------------------------------------ */

/**
 * Корневой объект Universal Workflow State Machine для одного домена.
 * domainId — открытый идентификатор домена (по аналогии с MatrixDomainId
 * Requirement Matrix Engine); version — версия конкретного WorkflowDefinition
 * этого домена (см. workflowRegistry: регистрация и получение по domainId
 * И version — несколько версий одного домена могут существовать одновременно
 * в реестре, но исполняться должна ровно одна активная версия — выбор
 * активной версии остаётся ответственностью вызывающего кода/будущей
 * реализации, не этого модуля).
 */
export interface WorkflowDefinition {
  domainId: string;
  version: number;
  labelKey?: string;
  states: WorkflowStateDefinition[];
  transitions: WorkflowTransitionDefinition[];
  lanes: WorkflowReviewLaneDefinition[];
  roles: WorkflowActorRoleDefinition[];
  escalationRules: WorkflowEscalationRule[];
  conflictResolutionPolicy: WorkflowConflictResolutionPolicy;
  createdBy: string;
  createdAt: ISODateString;
}

/* ------------------------------------------------------------------------ */
/* Валидация                                                                 */
/* ------------------------------------------------------------------------ */

/**
 * Один найденный дефект регистрации WorkflowDefinition. code — закрытый
 * набор известных кодов проверок (см. workflowDefinitionValidator), message —
 * человекочитаемое описание, details — произвольные данные для диагностики
 * (id состояний/переходов/ролей, вовлечённых в нарушение).
 */
export interface WorkflowValidationError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface WorkflowValidationResult {
  valid: boolean;
  errors: WorkflowValidationError[];
}

/** Результат попытки регистрации WorkflowDefinition в workflowRegistry. */
export interface WorkflowRegistrationResult {
  success: boolean;
  definition?: WorkflowDefinition;
  errors: WorkflowValidationError[];
}

/* ------------------------------------------------------------------------ */
/* Структурная проверка попытки перехода (workflowTransitionGuard)           */
/* ------------------------------------------------------------------------ */

/**
 * Входные данные структурной проверки попытки перехода. Guard НЕ исполняет
 * переход и не обращается к данным конкретной сущности (ClearancePackage
 * и т.д.) — только сверяет запрос со структурой WorkflowDefinition: существует
 * ли такой переход в белом списке, разрешена ли роль, предоставлено ли
 * обоснование там, где оно обязательно.
 */
export interface WorkflowTransitionAttempt {
  fromStateId: string;
  toStateId: string;
  trigger: string;
  actorRoleId: WorkflowActorRole;
  /** Предоставлено ли текстовое обоснование запросившим переход (сама проверка содержания текста — не задача guard). */
  justificationProvided: boolean;
}

export interface WorkflowGuardResult {
  allowed: boolean;
  reason?: string;
  transition?: WorkflowTransitionDefinition;
}
