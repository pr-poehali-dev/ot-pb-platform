import { describe, it, expect } from 'bun:test';
import { workflowGraphAnalyzer } from '../workflowGraphAnalyzer';
import { buildValidDefinition } from './fixtures';

describe('workflowGraphAnalyzer', () => {
  it('находит ровно одно стартовое состояние в валидном определении', () => {
    const definition = buildValidDefinition();
    expect(workflowGraphAnalyzer.findStartStates(definition).map((s) => s.id)).toEqual(['draft']);
  });

  it('находит финальное состояние archived', () => {
    const definition = buildValidDefinition();
    expect(workflowGraphAnalyzer.findFinalStates(definition).map((s) => s.id)).toEqual(['archived']);
  });

  it('не находит недостижимых состояний в валидном определении', () => {
    const definition = buildValidDefinition();
    expect(workflowGraphAnalyzer.findUnreachableStates(definition)).toEqual([]);
  });

  it('не находит dead-end состояний в валидном определении', () => {
    const definition = buildValidDefinition();
    expect(workflowGraphAnalyzer.findDeadEndStates(definition)).toEqual([]);
  });

  it('распознаёт управляемый цикл under_review ↔ needs_revision как управляемый', () => {
    const definition = buildValidDefinition();
    const cycles = workflowGraphAnalyzer.findCycles(definition);
    const revisionCycle = cycles.find((c) => c.includes('under_review') && c.includes('needs_revision'));

    expect(revisionCycle).toBeDefined();
    expect(workflowGraphAnalyzer.isCycleControlled(revisionCycle!, definition)).toBe(true);
  });

  it('не находит обхода обязательных дорожек в валидном определении', () => {
    const definition = buildValidDefinition();
    expect(workflowGraphAnalyzer.findLaneBypassTransitions(definition)).toEqual([]);
  });

  it('находит запрещённые переходы по категориям при их добавлении', () => {
    const definition = buildValidDefinition();
    definition.transitions.push({
      id: 't-forbidden',
      from: 'draft',
      to: 'cleared',
      trigger: 'shortcut',
      allowedRoles: ['submitter'],
      conditions: [],
      actions: [],
      requiresJustification: false,
      isForceTransition: false,
    });

    const violations = workflowGraphAnalyzer.findForbiddenCategoryTransitions(definition);
    expect(violations.some((v) => v.transition.id === 't-forbidden')).toBe(true);
  });
});
