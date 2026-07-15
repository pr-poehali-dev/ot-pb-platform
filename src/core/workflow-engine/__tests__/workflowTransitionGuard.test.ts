import { describe, it, expect } from 'bun:test';
import { workflowTransitionGuard } from '../workflowTransitionGuard';
import { buildValidDefinition } from './fixtures';

describe('workflowTransitionGuard', () => {
  it('разрешает переход, существующий в белом списке, для допустимой роли', () => {
    const definition = buildValidDefinition();

    const result = workflowTransitionGuard.checkTransition(definition, {
      fromStateId: 'draft',
      toStateId: 'under_review',
      trigger: 'submit',
      actorRoleId: 'submitter',
      justificationProvided: false,
    });

    expect(result.allowed).toBe(true);
    expect(result.transition?.id).toBe('t-submit');
  });

  it('запрещает переход, отсутствующий в белом списке', () => {
    const definition = buildValidDefinition();

    const result = workflowTransitionGuard.checkTransition(definition, {
      fromStateId: 'draft',
      toStateId: 'cleared',
      trigger: 'submit',
      actorRoleId: 'submitter',
      justificationProvided: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it('запрещает переход при недопустимой роли', () => {
    const definition = buildValidDefinition();

    const result = workflowTransitionGuard.checkTransition(definition, {
      fromStateId: 'draft',
      toStateId: 'under_review',
      trigger: 'submit',
      actorRoleId: 'administrator',
      justificationProvided: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.transition?.id).toBe('t-submit');
  });

  it('запрещает переход, требующий обоснование, если оно не предоставлено', () => {
    const definition = buildValidDefinition();

    const result = workflowTransitionGuard.checkTransition(definition, {
      fromStateId: 'under_review',
      toStateId: 'suspended',
      trigger: 'suspend',
      actorRoleId: 'administrator',
      justificationProvided: false,
    });

    expect(result.allowed).toBe(false);
  });

  it('разрешает переход, требующий обоснование, когда оно предоставлено', () => {
    const definition = buildValidDefinition();

    const result = workflowTransitionGuard.checkTransition(definition, {
      fromStateId: 'under_review',
      toStateId: 'suspended',
      trigger: 'suspend',
      actorRoleId: 'administrator',
      justificationProvided: true,
    });

    expect(result.allowed).toBe(true);
  });

  it('listAvailableTransitions возвращает только переходы, доступные роли из состояния', () => {
    const definition = buildValidDefinition();

    const forReviewer = workflowTransitionGuard.listAvailableTransitions(definition, 'under_review', 'lane_reviewer_a');
    const forSubmitter = workflowTransitionGuard.listAvailableTransitions(definition, 'under_review', 'submitter');

    expect(forReviewer.map((t) => t.id).sort()).toEqual(['t-reject', 't-request-revision']);
    expect(forSubmitter).toEqual([]);
  });
});
