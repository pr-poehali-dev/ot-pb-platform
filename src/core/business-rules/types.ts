import { EntityRef, ISODateString } from '../types';

/**
 * Типы Business Rules Engine — независимого движка бизнес-правил Noventra Core.
 *
 * Архитектурный принцип платформы: Noventra сначала решает задачи собственными
 * алгоритмами и бизнес-правилами. AI используется только как вспомогательный
 * инструмент по инициативе пользователя или в случаях, прямо предусмотренных
 * архитектурой, а окончательное ответственное решение в спорных или юридически
 * значимых ситуациях принимает человек.
 *
 * Business Rules Engine НЕ обращается к AI Engine и не содержит зависимостей
 * от него — правило лишь МОЖЕТ пометить результат полями suggestedAIUse /
 * humanDecisionRequired, которые прочитает вызывающий модуль (или будущий
 * Decision Engine) и самостоятельно решит, обращаться ли к AI Engine.
 *
 * Все правила конфигурируемые: движок не содержит ни одного захардкоженного
 * бизнес-правила — только контракты и механизмы регистрации/выполнения/версионирования.
 * Организация параметризует правило через поле `config` и данные `RuleContext`,
 * не изменяя код платформы; будущий no-code Rule Builder (часть Dashboard)
 * сможет генерировать `evaluate` из декларативных условий поверх этого же контракта.
 */

/** Итог выполнения правила. */
export type RuleOutcome = 'passed' | 'failed' | 'warning' | 'requiresHumanDecision';

/** Серьёзность результата правила. */
export type RuleSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Статус жизненного цикла самого правила в реестре (не результата выполнения). */
export type RuleStatus = 'active' | 'disabled' | 'draft';

/**
 * Пять уровней приоритета бизнес-правил платформы — от наивысшей обязательности
 * (законодательство) до наиболее специфичных исключений (временные правила).
 */
export const RulePriority = {
  Legislation: 'legislation',
  Corporate: 'corporate',
  Project: 'project',
  Customer: 'customer',
  Temporary: 'temporary',
} as const;

export type RulePriorityValue = (typeof RulePriority)[keyof typeof RulePriority];

/**
 * Ранг приоритета для разрешения конфликтов между правилами одного ruleKey:
 * чем меньше число, тем выше обязательность. Законодательство (0) — базовый
 * уровень, который не может быть ослаблен нижестоящими уровнями (см. rulePrecedenceResolver).
 */
export const RULE_PRIORITY_RANK: Record<RulePriorityValue, number> = {
  [RulePriority.Legislation]: 0,
  [RulePriority.Corporate]: 1,
  [RulePriority.Project]: 2,
  [RulePriority.Customer]: 3,
  [RulePriority.Temporary]: 4,
};

/**
 * Код страны применения правила (ISO 3166-1 alpha-2, например 'KZ', 'RU', 'TR', 'CN').
 * Открытый строковый тип — позволяет платформе работать в любой стране без
 * изменения архитектуры движка.
 */
export type RuleCountryCode = string;

/** Специальное значение country: правило действует во всех странах (глобальная норма/политика). */
export const GLOBAL_JURISDICTION = '*';

/**
 * Источник требования — откуда взята норма (документ, политика, договор).
 * Отдельная сущность от RulePriority: приоритет отвечает "насколько обязательно",
 * источник — "из какого именно документа/политики это требование".
 */
export interface RuleSource {
  /** Человекочитаемое название источника, например "Трудовой кодекс РК, ст. 182" */
  name: string;
  /** Ссылка на нормативный документ или внутреннюю политику */
  referenceUrl?: string;
}

/**
 * Категории бизнес-правил платформы. Открытый список категорий верхнего уровня,
 * который может быть расширен будущими модулями без изменения архитектуры движка —
 * категория используется только как метка для регистрации/фильтрации правил.
 */
export const RuleCategory = {
  EquipmentClearance: 'equipment_clearance',
  DocumentVerification: 'document_verification',
  DeadlineCheck: 'deadline_check',
  TrainingCheck: 'training_check',
  MedicalExamCheck: 'medical_exam_check',
  CertificateCheck: 'certificate_check',
  ContractorCheck: 'contractor_check',
  ObjectCheck: 'object_check',
  PersonnelCheck: 'personnel_check',
  StatusManagement: 'status_management',
  Notifications: 'notifications',
  Tasks: 'tasks',
  Risks: 'risks',
  Ratings: 'ratings',
  Kpi: 'kpi',
  MandatoryConditions: 'mandatory_conditions',
  ColorIndication: 'color_indication',
  Blocking: 'blocking',
  Reminders: 'reminders',
} as const;

export type RuleCategoryValue = (typeof RuleCategory)[keyof typeof RuleCategory];

/**
 * Контекст выполнения правила. entity — универсальная ссылка на сущность
 * платформы (как в Audit Log/AI Engine), data — произвольные входные данные,
 * которые правило использует для проверки, без знания движком бизнес-модели.
 * country — юрисдикция, в которой выполняется проверка (для многострановой
 * работы платформы). asOf — момент времени, на который проверяется
 * применимость правила (по умолчанию «сейчас»); позволяет выполнять
 * историческую/тестовую проверку без изменения архитектуры.
 */
export interface RuleContext {
  entity?: EntityRef;
  actor: string;
  country?: RuleCountryCode;
  asOf?: ISODateString;
  data?: Record<string, unknown>;
}

/**
 * Структурированный результат выполнения правила. Единый контракт для всех
 * категорий правил платформы.
 */
export interface RuleResult {
  outcome: RuleOutcome;
  severity: RuleSeverity;
  message: string;
  recommendation?: string;
  affectedEntity?: EntityRef;
  requiredAction?: string;
  /** Правило считает, что для дальнейшей обработки полезен AI Engine (не вызывает его само). */
  suggestedAIUse?: boolean;
  /** Ситуация спорная/юридически значимая — окончательное решение обязан принять человек. */
  humanDecisionRequired?: boolean;
  metadata?: Record<string, unknown>;
}

/** Запись истории изменений правила ("было → стало" на уровне версии, а не полей). */
export interface RuleChangeLogEntry {
  version: number;
  changedBy: string;
  changedAt: string;
  changeDescription: string;
}

/**
 * Единый контракт бизнес-правила. Любой модуль платформы регистрирует своё
 * правило через ruleRegistry.defineRule() — движок не знает деталей
 * конкретной проверки, только вызывает evaluate(context) по общему интерфейсу.
 *
 * ruleKey группирует несколько правил (разных приоритетов/версий), отвечающих
 * за один и тот же деловой вопрос — например "медосмотр действителен": одно
 * правило уровня legislation, другое corporate, третье temporary. Rule Executor
 * и rulePrecedenceResolver используют ruleKey, чтобы выбрать итоговое решение
 * с учётом приоритета и допустимости переопределения.
 */
export interface BusinessRule {
  /** Уникальный идентификатор конкретной регистрации правила в реестре */
  id: string;
  /** Идентификатор делового вопроса, объединяющий разные приоритеты/версии одного правила */
  ruleKey: string;
  category: RuleCategoryValue;
  /** Модуль-владелец правила, например 'equipment', 'contractors' */
  namespace: string;
  label: string;
  status: RuleStatus;
  priority: RulePriorityValue;
  country: RuleCountryCode;
  source: RuleSource;
  /**
   * Допускает ли это правило переопределение более специфичным правилом
   * нижестоящего приоритета (см. RULE_PRIORITY_RANK) в рамках того же ruleKey.
   * Законодательные правила с outcome 'failed' / 'requiresHumanDecision'
   * никогда не переопределяются — это гарантия архитектуры, а не только флаг.
   */
  overridable: boolean;
  /** Дата вступления правила в силу (включительно). Если не задана — действует сразу. */
  effectiveFrom?: ISODateString;
  /** Дата окончания действия правила (включительно). Если не задана — действует бессрочно. */
  effectiveTo?: ISODateString;
  /** Версия правила, растёт при каждом updateRule() */
  version: number;
  /** Полная история изменений правила (кто, когда, что и почему изменил) */
  history: RuleChangeLogEntry[];
  /**
   * Параметры конкретной организации/проекта для этого правила (пороги,
   * списки, коэффициенты и т.д.) — точка расширения, позволяющая изменять
   * поведение правила БЕЗ изменения кода платформы: организация редактирует
   * `config` (данные), а не `evaluate` (код).
   */
  config?: Record<string, unknown>;
  evaluate: (context: RuleContext) => Promise<RuleResult> | RuleResult;
}

/** Входные данные для первичной регистрации правила через ruleRegistry.defineRule(). */
export interface RuleDefinitionInput {
  id: string;
  ruleKey: string;
  category: RuleCategoryValue;
  namespace: string;
  label: string;
  status?: RuleStatus;
  priority: RulePriorityValue;
  country: RuleCountryCode;
  source: RuleSource;
  overridable: boolean;
  effectiveFrom?: ISODateString;
  effectiveTo?: ISODateString;
  config?: Record<string, unknown>;
  evaluate: (context: RuleContext) => Promise<RuleResult> | RuleResult;
  /** Автор и описание изменения — формируют первую запись в history */
  changedBy: string;
  changeDescription: string;
}

/** Входные данные для версионированного обновления правила через ruleRegistry.updateRule(). */
export interface RuleUpdateInput
  extends Partial<Omit<BusinessRule, 'id' | 'ruleKey' | 'version' | 'history'>> {
  changedBy: string;
  changeDescription: string;
}

/** Результат проверки применимости правила к конкретному контексту. */
export interface RuleApplicabilityCheck {
  applicable: boolean;
  reason?: string;
}

/**
 * Объяснение решения — обязательная часть ответа движка (требование объяснимости):
 * какое правило сработало, почему, из какого источника, с каким приоритетом
 * и какой версией. Ни одно решение Business Rules Engine не может быть отдано
 * без этого объяснения.
 */
export interface RuleExplanation {
  ruleId: string;
  ruleKey: string;
  ruleLabel: string;
  /** Человекочитаемая причина — по умолчанию совпадает с RuleResult.message */
  reason: string;
  priority: RulePriorityValue;
  version: number;
  source: RuleSource;
  country: RuleCountryCode;
  overridable: boolean;
}

/** Итог выполнения правила вместе с объяснением — единый ответ Rule Executor. */
export interface RuleExecutionResult {
  result: RuleResult;
  explanation: RuleExplanation;
}

/** Запись журнала выполнения правил (Rule Audit Log). */
export interface RuleAuditEntry {
  id: string;
  ruleId: string;
  category?: RuleCategoryValue;
  outcome: RuleOutcome;
  severity: RuleSeverity;
  actor: string;
  timestamp: string;
  message: string;
  entity?: EntityRef;
  priority?: RulePriorityValue;
  version?: number;
  source?: RuleSource;
  metadata?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* Legislation change workflow                                         */
/* ------------------------------------------------------------------ */

/**
 * Статус предложения об изменении законодательного правила. Законодательство
 * НЕ обновляется автоматически — новое требование становится действующим
 * только после явного подтверждения ответственным специалистом (confirmed).
 */
export type LegislationChangeStatus = 'pending_confirmation' | 'confirmed' | 'rejected';

/** Черновик законодательного правила без уровня приоритета — он всегда 'legislation'. */
export type LegislationRuleDraft = Omit<RuleDefinitionInput, 'priority'>;

/** Предложение об изменении законодательного требования, ожидающее решения человека. */
export interface LegislationChangeProposal {
  id: string;
  ruleKey: string;
  proposedRule: LegislationRuleDraft;
  status: LegislationChangeStatus;
  proposedBy: string;
  proposedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}
