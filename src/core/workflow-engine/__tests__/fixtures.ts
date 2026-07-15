import {
  WorkflowActorRoleDefinition,
  WorkflowBaseActorRole,
  WorkflowConditionKind,
  WorkflowConflictResolutionPolicy,
  WorkflowDefinition,
  WorkflowEscalationRule,
  WorkflowEscalationTrigger,
  WorkflowLaneOutcome,
  WorkflowReviewLaneDefinition,
  WorkflowSlaPolicy,
  WorkflowStateCategory,
  WorkflowStateDefinition,
  WorkflowTransitionDefinition,
} from '../types';

/**
 * Тестовые fixtures Workflow Engine — НЕ модуль персонала. Идентификаторы
 * состояний/ролей/дорожек используются исключительно как условный
 * generic-пример для проверки ядра (workflowDefinitionValidator/
 * workflowRegistry/workflowTransitionGuard) и не регистрируются нигде,
 * кроме тестов этого модуля.
 *
 * buildValidDefinition() возвращает свежий валидный WorkflowDefinition при
 * каждом вызове (без общего мутируемого состояния между тестами) —
 * структура сознательно повторяет согласованную архитектуру (2 обязательные
 * независимые дорожки, управляемый цикл доработки, force-переход по белому
 * списку, полностью сконфигурированный SLA).
 */

const VALID_SLA_POLICY: WorkflowSlaPolicy = {
  defaultDurationMinutes: 2880,
  urgentDurationMinutes: 480,
  workingDays: [1, 2, 3, 4, 5],
  workingHoursStart: '09:00',
  workingHoursEnd: '18:00',
  holidays: [],
  notificationType: 'email',
  reminderCount: 2,
  escalationRuleIds: ['esc-sla-overdue'],
};

const ROLES: WorkflowActorRoleDefinition[] = [
  { id: 'submitter', base: WorkflowBaseActorRole.Submitter },
  { id: 'lane_reviewer_a', base: WorkflowBaseActorRole.LaneReviewer },
  { id: 'lane_reviewer_b', base: WorkflowBaseActorRole.LaneReviewer },
  { id: 'administrator', base: WorkflowBaseActorRole.Administrator },
  { id: 'system', base: WorkflowBaseActorRole.System },
];

const LANES: WorkflowReviewLaneDefinition[] = [
  { id: 'lane_a', mandatory: true, reviewerRole: 'lane_reviewer_a', slaPolicy: VALID_SLA_POLICY },
  { id: 'lane_b', mandatory: true, reviewerRole: 'lane_reviewer_b', slaPolicy: VALID_SLA_POLICY },
];

const ESCALATION_RULES: WorkflowEscalationRule[] = [
  { id: 'esc-sla-overdue', trigger: WorkflowEscalationTrigger.SlaExceeded, escalateToRole: 'administrator' },
];

const CONFLICT_POLICY: WorkflowConflictResolutionPolicy = {
  outcomePrecedence: [WorkflowLaneOutcome.Rejected, WorkflowLaneOutcome.RevisionRequested, WorkflowLaneOutcome.Approved],
  requireAllMandatoryApprovedForClear: true,
};

const STATES: WorkflowStateDefinition[] = [
  { id: 'draft', category: WorkflowStateCategory.Draft, isStart: true, isFinal: false },
  { id: 'under_review', category: WorkflowStateCategory.Submitted, isStart: false, isFinal: false },
  { id: 'needs_revision', category: WorkflowStateCategory.Blocked, isStart: false, isFinal: false },
  { id: 'awaiting_decision', category: WorkflowStateCategory.PendingFinalDecision, isStart: false, isFinal: false },
  { id: 'cleared', category: WorkflowStateCategory.Approved, isStart: false, isFinal: false },
  { id: 'not_cleared', category: WorkflowStateCategory.Rejected, isStart: false, isFinal: false },
  { id: 'suspended', category: WorkflowStateCategory.Suspended, isStart: false, isFinal: false },
  { id: 'archived', category: WorkflowStateCategory.Archived, isStart: false, isFinal: true },
];

const TRANSITIONS: WorkflowTransitionDefinition[] = [
  {
    id: 't-submit',
    from: 'draft',
    to: 'under_review',
    trigger: 'submit',
    allowedRoles: ['submitter'],
    conditions: [{ kind: WorkflowConditionKind.RequirementsComplete }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-request-revision',
    from: 'under_review',
    to: 'needs_revision',
    trigger: 'request_revision',
    allowedRoles: ['lane_reviewer_a', 'lane_reviewer_b'],
    conditions: [{ kind: WorkflowConditionKind.AnyMandatoryLaneOutcome, laneOutcome: WorkflowLaneOutcome.RevisionRequested }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-reject',
    from: 'under_review',
    to: 'not_cleared',
    trigger: 'reject',
    allowedRoles: ['lane_reviewer_a', 'lane_reviewer_b'],
    conditions: [{ kind: WorkflowConditionKind.AnyMandatoryLaneOutcome, laneOutcome: WorkflowLaneOutcome.Rejected }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-all-approved',
    from: 'under_review',
    to: 'awaiting_decision',
    trigger: 'all_mandatory_approved',
    allowedRoles: ['system'],
    conditions: [{ kind: WorkflowConditionKind.AllMandatoryLanesOutcome, laneOutcome: WorkflowLaneOutcome.Approved }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-resubmit',
    from: 'needs_revision',
    to: 'under_review',
    trigger: 'resubmit',
    allowedRoles: ['submitter'],
    conditions: [{ kind: WorkflowConditionKind.NoUnresolvedSyncConflicts }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-finalize-clear',
    from: 'awaiting_decision',
    to: 'cleared',
    trigger: 'finalize',
    allowedRoles: ['system'],
    conditions: [{ kind: WorkflowConditionKind.AllMandatoryLanesOutcome, laneOutcome: WorkflowLaneOutcome.Approved }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-archive-cleared',
    from: 'cleared',
    to: 'archived',
    trigger: 'archive',
    allowedRoles: ['administrator', 'system'],
    conditions: [{ kind: WorkflowConditionKind.Always }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-archive-not-cleared',
    from: 'not_cleared',
    to: 'archived',
    trigger: 'archive',
    allowedRoles: ['administrator', 'system'],
    conditions: [{ kind: WorkflowConditionKind.Always }],
    actions: [],
    requiresJustification: false,
    isForceTransition: false,
  },
  {
    id: 't-suspend',
    from: 'under_review',
    to: 'suspended',
    trigger: 'suspend',
    allowedRoles: ['administrator'],
    conditions: [{ kind: WorkflowConditionKind.Always }],
    actions: [],
    requiresJustification: true,
    isForceTransition: false,
  },
  {
    id: 't-resume',
    from: 'suspended',
    to: 'under_review',
    trigger: 'resume',
    allowedRoles: ['administrator'],
    conditions: [{ kind: WorkflowConditionKind.Always }],
    actions: [],
    requiresJustification: true,
    isForceTransition: false,
  },
  {
    id: 't-archive-suspended',
    from: 'suspended',
    to: 'archived',
    trigger: 'archive',
    allowedRoles: ['administrator'],
    conditions: [{ kind: WorkflowConditionKind.Always }],
    actions: [],
    requiresJustification: true,
    isForceTransition: false,
  },
  {
    id: 't-force-not-cleared',
    from: 'awaiting_decision',
    to: 'not_cleared',
    trigger: 'force_transition',
    allowedRoles: ['administrator'],
    conditions: [],
    actions: [],
    requiresJustification: true,
    isForceTransition: true,
  },
];

/** Возвращает новый (не переиспользуемый между тестами) валидный WorkflowDefinition. */
export function buildValidDefinition(): WorkflowDefinition {
  return {
    domainId: 'workflow-engine-test-domain',
    version: 1,
    states: STATES.map((s) => ({ ...s })),
    transitions: TRANSITIONS.map((t) => ({ ...t, allowedRoles: [...t.allowedRoles], conditions: t.conditions.map((c) => ({ ...c })), actions: [...t.actions] })),
    lanes: LANES.map((l) => ({ ...l, slaPolicy: { ...l.slaPolicy } })),
    roles: ROLES.map((r) => ({ ...r })),
    escalationRules: ESCALATION_RULES.map((r) => ({ ...r })),
    conflictResolutionPolicy: { ...CONFLICT_POLICY, outcomePrecedence: [...CONFLICT_POLICY.outcomePrecedence] },
    createdBy: 'test-suite',
    createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
  };
}
