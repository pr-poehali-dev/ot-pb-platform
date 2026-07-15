import { workflowGraphAnalyzer } from './workflowGraphAnalyzer';
import {
  WorkflowCondition,
  WorkflowConditionKind,
  WorkflowDefinition,
  WorkflowEscalationRule,
  WorkflowEscalationTrigger,
  WorkflowLaneOutcome,
  WorkflowReviewLaneDefinition,
  WorkflowSlaPolicy,
  WorkflowValidationError,
  WorkflowValidationResult,
} from './types';

/**
 * Workflow Definition Validator — проверяет WorkflowDefinition ПЕРЕД
 * попаданием в workflowRegistry. Ничего не исполняет, только читает
 * переданное определение и возвращает полный список найденных ошибок —
 * регистрация отклоняется целиком при наличии хотя бы одной ошибки
 * (см. workflowRegistry.registerWorkflow).
 *
 * Каждый код ошибки (WORKFLOW_VALIDATION_CODES) стабилен и используется в
 * автоматических тестах (см. __tests__/workflowDefinitionValidator.test.ts).
 */
export const WORKFLOW_VALIDATION_CODES = {
  NoStartState: 'no_start_state',
  MultipleStartStates: 'multiple_start_states',
  NoFinalState: 'no_final_state',
  UnreachableState: 'unreachable_state',
  DeadEndState: 'dead_end_state',
  DuplicateTransition: 'duplicate_transition',
  InvalidStateReference: 'invalid_state_reference',
  InvalidRoleReference: 'invalid_role_reference',
  DuplicateRole: 'duplicate_role',
  AiRoleForbidden: 'ai_role_forbidden',
  InvalidCondition: 'invalid_condition',
  InvalidForceTransition: 'invalid_force_transition',
  ForbiddenCategoryTransition: 'forbidden_category_transition',
  LaneBypass: 'lane_bypass',
  DuplicateLane: 'duplicate_lane',
  InvalidSlaPolicy: 'invalid_sla_policy',
  InvalidConflictResolutionPolicy: 'invalid_conflict_resolution_policy',
  InvalidEscalationRule: 'invalid_escalation_rule',
  DuplicateEscalationRule: 'duplicate_escalation_rule',
  UncontrolledCycle: 'uncontrolled_cycle',
} as const;

/**
 * Токены идентификатора роли, структурно запрещённые к использованию —
 * гарантия того, что ни один домен не сможет зарегистрировать роль,
 * позволяющую ИИ инициировать переход. Проверяется по отдельным токенам
 * id роли (разделённым не-буквенно-цифровыми символами), а не подстрокой,
 * чтобы не блокировать случайные совпадения (например, роль "curator").
 */
const AI_ROLE_TOKENS = new Set(['ai', 'ии', 'assistant', 'bot', 'copilot', 'llm']);

function isAiLikeRoleId(roleId: string): boolean {
  const tokens = roleId.toLowerCase().split(/[^a-zа-я0-9]+/i).filter(Boolean);
  return tokens.some((token) => AI_ROLE_TOKENS.has(token));
}

function validateRoles(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const seenIds = new Set<string>();

  for (const role of definition.roles) {
    if (seenIds.has(role.id)) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.DuplicateRole,
        message: `Роль "${role.id}" зарегистрирована в WorkflowDefinition более одного раза`,
        details: { roleId: role.id },
      });
    }
    seenIds.add(role.id);

    if (isAiLikeRoleId(role.id)) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.AiRoleForbidden,
        message: `Роль "${role.id}" структурно запрещена: не может представлять ИИ как инициатора перехода`,
        details: { roleId: role.id },
      });
    }
  }

  const declaredRoleIds = new Set(definition.roles.map((r) => r.id));

  const checkRoleRef = (roleId: string, context: string) => {
    if (!declaredRoleIds.has(roleId)) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.InvalidRoleReference,
        message: `Роль "${roleId}" используется в ${context}, но не объявлена в WorkflowDefinition.roles`,
        details: { roleId, context },
      });
    }
  };

  for (const t of definition.transitions) {
    if (t.allowedRoles.length === 0) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.InvalidRoleReference,
        message: `Переход "${t.id}" (${t.from} → ${t.to}) не содержит ни одной разрешённой роли`,
        details: { transitionId: t.id },
      });
    }
    t.allowedRoles.forEach((roleId) => checkRoleRef(roleId, `allowedRoles перехода "${t.id}"`));
  }

  definition.lanes.forEach((lane) => checkRoleRef(lane.reviewerRole, `reviewerRole дорожки "${lane.id}"`));
  definition.escalationRules.forEach((rule) => checkRoleRef(rule.escalateToRole, `escalateToRole правила эскалации "${rule.id}"`));
}

function validateStateReferencesAndStructure(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const { unknownFrom, unknownTo } = workflowGraphAnalyzer.findInvalidStateRefs(definition);

  unknownFrom.forEach((t) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.InvalidStateReference,
      message: `Переход "${t.id}" ссылается на несуществующее состояние from="${t.from}"`,
      details: { transitionId: t.id, from: t.from },
    });
  });

  unknownTo.forEach((t) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.InvalidStateReference,
      message: `Переход "${t.id}" ссылается на несуществующее состояние to="${t.to}"`,
      details: { transitionId: t.id, to: t.to },
    });
  });
}

function validateStartAndFinalStates(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const starts = workflowGraphAnalyzer.findStartStates(definition);
  const finals = workflowGraphAnalyzer.findFinalStates(definition);

  if (starts.length === 0) {
    errors.push({ code: WORKFLOW_VALIDATION_CODES.NoStartState, message: 'WorkflowDefinition не содержит ни одного Start State (isStart=true)' });
  } else if (starts.length > 1) {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.MultipleStartStates,
      message: `WorkflowDefinition содержит несколько Start State: ${starts.map((s) => s.id).join(', ')} — допустим ровно один`,
      details: { stateIds: starts.map((s) => s.id) },
    });
  }

  if (finals.length === 0) {
    errors.push({ code: WORKFLOW_VALIDATION_CODES.NoFinalState, message: 'WorkflowDefinition не содержит ни одного Final State (isFinal=true)' });
  }
}

function validateReachabilityAndDeadEnds(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  workflowGraphAnalyzer.findUnreachableStates(definition).forEach((s) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.UnreachableState,
      message: `Состояние "${s.id}" недостижимо из Start State ни по одному пути переходов`,
      details: { stateId: s.id },
    });
  });

  workflowGraphAnalyzer.findDeadEndStates(definition).forEach((s) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.DeadEndState,
      message: `Состояние "${s.id}" не является Final State, но не имеет ни одного допустимого исходящего перехода`,
      details: { stateId: s.id },
    });
  });
}

function validateDuplicateTransitions(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  workflowGraphAnalyzer.findDuplicateTransitions(definition).forEach((group) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.DuplicateTransition,
      message: `Обнаружены дублирующиеся переходы для (from="${group[0].from}", to="${group[0].to}", trigger="${group[0].trigger}")`,
      details: { transitionIds: group.map((t) => t.id) },
    });
  });
}

function validateCondition(condition: WorkflowCondition, transitionId: string, lanes: WorkflowReviewLaneDefinition[], errors: WorkflowValidationError[]): void {
  const laneIds = new Set(lanes.map((l) => l.id));
  const validLaneOutcomes = new Set(Object.values(WorkflowLaneOutcome));

  switch (condition.kind) {
    case WorkflowConditionKind.AllMandatoryLanesOutcome:
    case WorkflowConditionKind.AnyMandatoryLaneOutcome:
      if (!condition.laneOutcome || !validLaneOutcomes.has(condition.laneOutcome)) {
        errors.push({
          code: WORKFLOW_VALIDATION_CODES.InvalidCondition,
          message: `Условие "${condition.kind}" перехода "${transitionId}" требует корректного laneOutcome`,
          details: { transitionId, kind: condition.kind },
        });
      }
      break;
    case WorkflowConditionKind.LaneOutcomeEquals:
      if (!condition.laneId || !laneIds.has(condition.laneId)) {
        errors.push({
          code: WORKFLOW_VALIDATION_CODES.InvalidCondition,
          message: `Условие "lane_outcome_equals" перехода "${transitionId}" ссылается на неизвестную дорожку "${condition.laneId ?? ''}"`,
          details: { transitionId, laneId: condition.laneId },
        });
      }
      if (!condition.laneOutcome || !validLaneOutcomes.has(condition.laneOutcome)) {
        errors.push({
          code: WORKFLOW_VALIDATION_CODES.InvalidCondition,
          message: `Условие "lane_outcome_equals" перехода "${transitionId}" требует корректного laneOutcome`,
          details: { transitionId },
        });
      }
      break;
    case WorkflowConditionKind.CustomRule:
      if (!condition.ruleKey || condition.ruleKey.trim().length === 0) {
        errors.push({
          code: WORKFLOW_VALIDATION_CODES.InvalidCondition,
          message: `Условие "custom_rule" перехода "${transitionId}" требует непустого ruleKey (ссылка на Business Rules Engine)`,
          details: { transitionId },
        });
      }
      break;
    case WorkflowConditionKind.Always:
    case WorkflowConditionKind.RequirementsComplete:
    case WorkflowConditionKind.NoUnresolvedSyncConflicts:
    case WorkflowConditionKind.SlaExceeded:
      break;
    default:
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.InvalidCondition,
        message: `Переход "${transitionId}" содержит условие неизвестного вида "${String(condition.kind)}"`,
        details: { transitionId },
      });
  }
}

function validateForceTransitions(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  definition.transitions
    .filter((t) => t.isForceTransition)
    .forEach((t) => {
      if (!t.requiresJustification) {
        errors.push({
          code: WORKFLOW_VALIDATION_CODES.InvalidForceTransition,
          message: `Force Transition "${t.id}" (${t.from} → ${t.to}) обязан требовать текстовое обоснование (requiresJustification=true)`,
          details: { transitionId: t.id },
        });
      }
      if (t.allowedRoles.length === 0) {
        errors.push({
          code: WORKFLOW_VALIDATION_CODES.InvalidForceTransition,
          message: `Force Transition "${t.id}" обязан явно указывать разрешённую роль`,
          details: { transitionId: t.id },
        });
      }
    });
}

function validateForbiddenCategoryTransitions(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  workflowGraphAnalyzer.findForbiddenCategoryTransitions(definition).forEach(({ transition, reason }) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.ForbiddenCategoryTransition,
      message: `Переход "${transition.id}" (${transition.from} → ${transition.to}) нарушает архитектурный запрет: ${reason}`,
      details: { transitionId: transition.id },
    });
  });

  workflowGraphAnalyzer.findArchivedCategoryOutgoing(definition).forEach((transition) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.ForbiddenCategoryTransition,
      message: `Переход "${transition.id}" исходит из состояния категории Archived — архивное состояние не может иметь исходящих переходов`,
      details: { transitionId: transition.id },
    });
  });
}

function validateLaneBypass(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  workflowGraphAnalyzer.findLaneBypassTransitions(definition).forEach((t) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.LaneBypass,
      message: `Переход "${t.id}" (${t.from} → ${t.to}) ведёт в состояние с положительной категорией, минуя проверку обязательных дорожек (требуется условие all_mandatory_lanes_outcome с laneOutcome="approved")`,
      details: { transitionId: t.id },
    });
  });
}

function validateLanes(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const seenIds = new Set<string>();
  for (const lane of definition.lanes) {
    if (seenIds.has(lane.id)) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.DuplicateLane,
        message: `Дорожка проверки "${lane.id}" зарегистрирована более одного раза`,
        details: { laneId: lane.id },
      });
    }
    seenIds.add(lane.id);

    validateSlaPolicy(lane.slaPolicy, lane.id, definition, errors);
  }
}

function validateSlaPolicy(policy: WorkflowSlaPolicy, laneId: string, definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const fail = (message: string) => {
    errors.push({ code: WORKFLOW_VALIDATION_CODES.InvalidSlaPolicy, message: `SLA Policy дорожки "${laneId}": ${message}`, details: { laneId } });
  };

  if (!Number.isFinite(policy.defaultDurationMinutes) || policy.defaultDurationMinutes <= 0) {
    fail('defaultDurationMinutes обязан быть положительным числом');
  }

  if (policy.urgentDurationMinutes !== undefined) {
    if (!Number.isFinite(policy.urgentDurationMinutes) || policy.urgentDurationMinutes <= 0) {
      fail('urgentDurationMinutes обязан быть положительным числом');
    } else if (policy.urgentDurationMinutes > policy.defaultDurationMinutes) {
      fail('urgentDurationMinutes не может превышать defaultDurationMinutes');
    }
  }

  if (policy.workingDays !== undefined) {
    const invalid = policy.workingDays.some((d) => !Number.isInteger(d) || d < 0 || d > 6);
    const hasDuplicates = new Set(policy.workingDays).size !== policy.workingDays.length;
    if (invalid) fail('workingDays обязан содержать только целые числа 0..6');
    if (hasDuplicates) fail('workingDays не должен содержать дублирующихся значений');
  }

  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (policy.workingHoursStart !== undefined && !timePattern.test(policy.workingHoursStart)) {
    fail('workingHoursStart обязан быть в формате "HH:mm"');
  }
  if (policy.workingHoursEnd !== undefined && !timePattern.test(policy.workingHoursEnd)) {
    fail('workingHoursEnd обязан быть в формате "HH:mm"');
  }
  if (
    policy.workingHoursStart !== undefined &&
    policy.workingHoursEnd !== undefined &&
    timePattern.test(policy.workingHoursStart) &&
    timePattern.test(policy.workingHoursEnd) &&
    policy.workingHoursStart >= policy.workingHoursEnd
  ) {
    fail('workingHoursStart обязан быть раньше workingHoursEnd');
  }

  if (policy.reminderCount !== undefined && (!Number.isInteger(policy.reminderCount) || policy.reminderCount < 0)) {
    fail('reminderCount обязан быть неотрицательным целым числом');
  }

  if (policy.escalationRuleIds !== undefined) {
    const declaredEscalationIds = new Set(definition.escalationRules.map((r) => r.id));
    policy.escalationRuleIds.forEach((id) => {
      if (!declaredEscalationIds.has(id)) {
        fail(`escalationRuleIds ссылается на неизвестное правило эскалации "${id}"`);
      }
    });
  }
}

function validateEscalationRules(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const seenIds = new Set<string>();
  const validTriggers = new Set(Object.values(WorkflowEscalationTrigger));

  definition.escalationRules.forEach((rule: WorkflowEscalationRule) => {
    if (seenIds.has(rule.id)) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.DuplicateEscalationRule,
        message: `Правило эскалации "${rule.id}" зарегистрировано более одного раза`,
        details: { escalationRuleId: rule.id },
      });
    }
    seenIds.add(rule.id);

    if (!validTriggers.has(rule.trigger)) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.InvalidEscalationRule,
        message: `Правило эскалации "${rule.id}" содержит неизвестный trigger "${String(rule.trigger)}"`,
        details: { escalationRuleId: rule.id },
      });
    }
  });
}

function validateConflictResolutionPolicy(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  const policy = definition.conflictResolutionPolicy;
  const validOutcomes = new Set(Object.values(WorkflowLaneOutcome));

  if (!policy.outcomePrecedence || policy.outcomePrecedence.length === 0) {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy,
      message: 'WorkflowConflictResolutionPolicy.outcomePrecedence не может быть пустым',
    });
  } else {
    const invalidValues = policy.outcomePrecedence.filter((o) => !validOutcomes.has(o));
    if (invalidValues.length > 0) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy,
        message: `outcomePrecedence содержит неизвестные значения: ${invalidValues.join(', ')}`,
      });
    }
    const hasDuplicates = new Set(policy.outcomePrecedence).size !== policy.outcomePrecedence.length;
    if (hasDuplicates) {
      errors.push({
        code: WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy,
        message: 'outcomePrecedence не должен содержать дублирующихся значений',
      });
    }
  }

  if (policy.requireAllMandatoryApprovedForClear !== true) {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy,
      message: 'requireAllMandatoryApprovedForClear обязан быть true: положительный итог допустим только при одобрении ВСЕХ обязательных дорожек',
    });
  }
}

function validateUncontrolledCycles(definition: WorkflowDefinition, errors: WorkflowValidationError[]): void {
  workflowGraphAnalyzer.findUncontrolledCycles(definition).forEach((cycle) => {
    errors.push({
      code: WORKFLOW_VALIDATION_CODES.UncontrolledCycle,
      message: `Обнаружен неконтролируемый цикл без реального условия выхода: ${cycle.join(' → ')} → ${cycle[0]}`,
      details: { cycle },
    });
  });
}

/**
 * Полная проверка WorkflowDefinition. Возвращает ВСЕ найденные ошибки за
 * один проход (не останавливается на первой) — вызывающий код (workflowRegistry)
 * может показать полный, понятный отчёт сразу.
 */
function validate(definition: WorkflowDefinition): WorkflowValidationResult {
  const errors: WorkflowValidationError[] = [];

  validateStartAndFinalStates(definition, errors);
  validateStateReferencesAndStructure(definition, errors);
  validateReachabilityAndDeadEnds(definition, errors);
  validateDuplicateTransitions(definition, errors);
  validateRoles(definition, errors);
  validateLanes(definition, errors);
  validateEscalationRules(definition, errors);
  validateConflictResolutionPolicy(definition, errors);
  validateForceTransitions(definition, errors);
  validateForbiddenCategoryTransitions(definition, errors);
  validateLaneBypass(definition, errors);
  validateUncontrolledCycles(definition, errors);

  definition.transitions.forEach((t) => {
    t.conditions.forEach((condition) => validateCondition(condition, t.id, definition.lanes, errors));
  });

  return { valid: errors.length === 0, errors };
}

export const workflowDefinitionValidator = {
  validate,
};