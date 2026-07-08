import { EntityRef } from '../types';

/**
 * Типы Business Rules Engine — независимого движка бизнес-правил Noventra Core.
 *
 * Архитектурный принцип платформы: Noventra сначала решает задачи собственными
 * алгоритмами и бизнес-правилами. AI используется только как вспомогательный
 * инструмент, когда обычной логики недостаточно, а окончательное ответственное
 * решение в спорных или юридически значимых ситуациях принимает человек.
 *
 * Business Rules Engine НЕ обращается к AI Engine и не содержит зависимостей
 * от него — правило лишь МОЖЕТ пометить результат полями suggestedAIUse /
 * humanDecisionRequired, которые прочитает вызывающий модуль (или будущий
 * Decision Engine) и самостоятельно решит, обращаться ли к AI Engine.
 */

/** Итог выполнения правила. */
export type RuleOutcome = 'passed' | 'failed' | 'warning' | 'requiresHumanDecision';

/** Серьёзность результата правила. */
export type RuleSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Статус жизненного цикла самого правила в реестре (не результата выполнения). */
export type RuleStatus = 'active' | 'disabled' | 'draft';

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
 */
export interface RuleContext {
  entity?: EntityRef;
  actor: string;
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

/**
 * Единый контракт бизнес-правила. Любой модуль платформы регистрирует своё
 * правило через ruleRegistry.registerRule() — движок не знает деталей
 * конкретной проверки, только вызывает evaluate(context) по общему интерфейсу.
 */
export interface BusinessRule {
  id: string;
  category: RuleCategoryValue;
  /** Модуль-владелец правила, например 'equipment', 'contractors' */
  namespace: string;
  label: string;
  status: RuleStatus;
  evaluate: (context: RuleContext) => Promise<RuleResult> | RuleResult;
}

/** Запись журнала выполнения правил (Rule Audit Log). */
export interface RuleAuditEntry {
  id: string;
  ruleId: string;
  category: RuleCategoryValue;
  outcome: RuleOutcome;
  severity: RuleSeverity;
  actor: string;
  timestamp: string;
  message: string;
  entity?: EntityRef;
  metadata?: Record<string, unknown>;
}
