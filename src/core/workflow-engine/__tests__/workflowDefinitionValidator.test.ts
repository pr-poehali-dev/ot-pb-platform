import { describe, it, expect } from 'bun:test';
import { workflowDefinitionValidator, WORKFLOW_VALIDATION_CODES } from '../workflowDefinitionValidator';
import { WorkflowConditionKind, WorkflowDefinition } from '../types';
import { buildValidDefinition } from './fixtures';

describe('workflowDefinitionValidator', () => {
  it('принимает валидный WorkflowDefinition без ошибок', () => {
    const result = workflowDefinitionValidator.validate(buildValidDefinition());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('отклоняет определение без Start State', () => {
    const definition = buildValidDefinition();
    definition.states = definition.states.map((s) => (s.id === 'draft' ? { ...s, isStart: false } : s));

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.NoStartState)).toBe(true);
  });

  it('отклоняет определение с несколькими Start State', () => {
    const definition = buildValidDefinition();
    definition.states = definition.states.map((s) => (s.id === 'under_review' ? { ...s, isStart: true } : s));

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.MultipleStartStates)).toBe(true);
  });

  it('отклоняет определение без Final State', () => {
    const definition = buildValidDefinition();
    definition.states = definition.states.map((s) => (s.id === 'archived' ? { ...s, isFinal: false } : s));

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.NoFinalState)).toBe(true);
  });

  it('отклоняет определение с недостижимым состоянием', () => {
    const definition = buildValidDefinition();
    definition.states.push({ id: 'orphan_state', category: definition.states[0].category, isStart: false, isFinal: true });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.UnreachableState && e.details?.stateId === 'orphan_state')
    ).toBe(true);
  });

  it('отклоняет определение с висящим (не Final) состоянием без исходящих переходов', () => {
    const definition = buildValidDefinition();
    // Добавляем состояние, достижимое из графа, но без исходящих переходов и не финальное.
    definition.states.push({ id: 'dead_end', category: definition.states[0].category, isStart: false, isFinal: false });
    definition.transitions.push({
      id: 't-to-dead-end',
      from: 'draft',
      to: 'dead_end',
      trigger: 'go_dead_end',
      allowedRoles: ['submitter'],
      conditions: [{ kind: WorkflowConditionKind.Always }],
      actions: [],
      requiresJustification: false,
      isForceTransition: false,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.DeadEndState && e.details?.stateId === 'dead_end')
    ).toBe(true);
  });

  it('отклоняет определение с дублирующимся переходом', () => {
    const definition = buildValidDefinition();
    const original = definition.transitions.find((t) => t.id === 't-submit')!;
    definition.transitions.push({ ...original, id: 't-submit-duplicate' });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.DuplicateTransition)).toBe(true);
  });

  it('отклоняет определение с неконтролируемым циклом (always, без обоснования)', () => {
    const definition = buildValidDefinition();
    definition.transitions.push(
      {
        id: 't-uncontrolled-a',
        from: 'under_review',
        to: 'suspended',
        trigger: 'uncontrolled_a',
        allowedRoles: ['administrator'],
        conditions: [{ kind: WorkflowConditionKind.Always }],
        actions: [],
        requiresJustification: false,
        isForceTransition: false,
      },
      {
        id: 't-uncontrolled-b',
        from: 'suspended',
        to: 'under_review',
        trigger: 'uncontrolled_b',
        allowedRoles: ['administrator'],
        conditions: [{ kind: WorkflowConditionKind.Always }],
        actions: [],
        requiresJustification: false,
        isForceTransition: false,
      }
    );
    // Убираем существующие управляемые t-suspend/t-resume, чтобы цикл под тестом остался единственным между этими состояниями.
    definition.transitions = definition.transitions.filter((t) => t.id !== 't-suspend' && t.id !== 't-resume');

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.UncontrolledCycle)).toBe(true);
  });

  it('допускает управляемый цикл доработки under_review → needs_revision → under_review', () => {
    const definition = buildValidDefinition();
    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(true);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.UncontrolledCycle)).toBe(false);
  });

  it('отклоняет запрещённый Force Transition draft → cleared (запрещённая категория Draft→Approved)', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-force-forbidden',
      from: 'draft',
      to: 'cleared',
      trigger: 'force_transition',
      allowedRoles: ['administrator'],
      conditions: [],
      actions: [],
      requiresJustification: true,
      isForceTransition: true,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.ForbiddenCategoryTransition)).toBe(true);
  });

  it('отклоняет Force Transition без обязательного обоснования', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-force-no-justification',
      from: 'suspended',
      to: 'archived',
      trigger: 'force_transition',
      allowedRoles: ['administrator'],
      conditions: [],
      actions: [],
      requiresJustification: false,
      isForceTransition: true,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidForceTransition)).toBe(true);
  });

  it('отклоняет переход, обходящий обязательную Review Lane (Approved без AllMandatoryLanesOutcome)', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-bypass-lane',
      from: 'under_review',
      to: 'cleared',
      trigger: 'shortcut_clear',
      allowedRoles: ['system'],
      conditions: [{ kind: WorkflowConditionKind.Always }],
      actions: [],
      requiresJustification: false,
      isForceTransition: false,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.LaneBypass)).toBe(true);
  });

  it('отклоняет некорректную роль (ссылка на незарегистрированную роль в allowedRoles)', () => {
    const definition = buildValidDefinition();
    definition.transitions = definition.transitions.map((t) =>
      t.id === 't-submit' ? { ...t, allowedRoles: ['unknown_role'] } : t
    );

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidRoleReference)).toBe(true);
  });

  it('отклоняет AI-подобную роль (запрет инициации перехода ИИ)', () => {
    const definition = buildValidDefinition();
    definition.roles.push({ id: 'ai_assistant', base: 'custom' });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.AiRoleForbidden)).toBe(true);
  });

  it('отклоняет некорректную SLA Policy (отрицательная длительность)', () => {
    const definition = buildValidDefinition();
    definition.lanes = definition.lanes.map((l) =>
      l.id === 'lane_a' ? { ...l, slaPolicy: { ...l.slaPolicy, defaultDurationMinutes: -10 } } : l
    );

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidSlaPolicy)).toBe(true);
  });

  it('отклоняет некорректную SLA Policy (некорректный формат рабочих часов)', () => {
    const definition = buildValidDefinition();
    definition.lanes = definition.lanes.map((l) =>
      l.id === 'lane_a' ? { ...l, slaPolicy: { ...l.slaPolicy, workingHoursStart: '25:99' } } : l
    );

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidSlaPolicy)).toBe(true);
  });

  it('отклоняет некорректную Conflict Resolution Policy (пустой outcomePrecedence)', () => {
    const definition = buildValidDefinition();
    definition.conflictResolutionPolicy = { ...definition.conflictResolutionPolicy, outcomePrecedence: [] };

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy)).toBe(true);
  });

  it('отклоняет некорректную Conflict Resolution Policy (requireAllMandatoryApprovedForClear=false)', () => {
    const definition = buildValidDefinition();
    definition.conflictResolutionPolicy = { ...definition.conflictResolutionPolicy, requireAllMandatoryApprovedForClear: false };

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy)).toBe(true);
  });

  it('отклоняет некорректное Escalation Rule (неизвестный trigger)', () => {
    const definition = buildValidDefinition();
    definition.escalationRules = definition.escalationRules.map((r) =>
      r.id === 'esc-sla-overdue' ? { ...r, trigger: 'unknown_trigger' as unknown as typeof r.trigger } : r
    );

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidEscalationRule)).toBe(true);
  });

  it('отклоняет некорректное Escalation Rule (ссылка на незарегистрированную роль)', () => {
    const definition = buildValidDefinition();
    definition.escalationRules = definition.escalationRules.map((r) =>
      r.id === 'esc-sla-overdue' ? { ...r, escalateToRole: 'unknown_role' } : r
    );

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidRoleReference)).toBe(true);
  });

  it('отклоняет некорректное условие custom_rule без ruleKey', () => {
    const definition = buildValidDefinition();
    definition.transitions = definition.transitions.map((t) =>
      t.id === 't-submit' ? { ...t, conditions: [{ kind: WorkflowConditionKind.CustomRule }] } : t
    );

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidCondition)).toBe(true);
  });

  it('отклоняет переход со ссылкой на несуществующее состояние (invalid from/to)', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-invalid-ref',
      from: 'draft',
      to: 'nonexistent_state',
      trigger: 'broken',
      allowedRoles: ['submitter'],
      conditions: [{ kind: WorkflowConditionKind.Always }],
      actions: [],
      requiresJustification: false,
      isForceTransition: false,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidStateReference)).toBe(true);
  });

  it('отклоняет переход из состояния категории Archived (архивное состояние не может иметь исходящих переходов)', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-from-archived',
      from: 'archived',
      to: 'under_review',
      trigger: 'restore',
      allowedRoles: ['administrator'],
      conditions: [{ kind: WorkflowConditionKind.Always }],
      actions: [],
      requiresJustification: true,
      isForceTransition: false,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.ForbiddenCategoryTransition)).toBe(true);
  });

  it('отклоняет переход not_cleared → cleared (запрещённая категория Rejected→Approved)', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-rejected-to-approved',
      from: 'not_cleared',
      to: 'cleared',
      trigger: 'force_transition',
      allowedRoles: ['administrator'],
      conditions: [],
      actions: [],
      requiresJustification: true,
      isForceTransition: true,
    });

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.ForbiddenCategoryTransition)).toBe(true);
  });

  it('возвращает несколько ошибок одновременно (не останавливается на первой)', () => {
    const definition: WorkflowDefinition = buildValidDefinition();
    definition.states = definition.states.map((s) => (s.id === 'draft' ? { ...s, isStart: false } : s));
    definition.conflictResolutionPolicy = { outcomePrecedence: [], requireAllMandatoryApprovedForClear: false };

    const result = workflowDefinitionValidator.validate(definition);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.NoStartState)).toBe(true);
    expect(result.errors.some((e) => e.code === WORKFLOW_VALIDATION_CODES.InvalidConflictResolutionPolicy)).toBe(true);
  });
});