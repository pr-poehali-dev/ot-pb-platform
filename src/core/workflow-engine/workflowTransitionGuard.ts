import { WorkflowDefinition, WorkflowGuardResult, WorkflowTransitionAttempt, WorkflowTransitionDefinition } from './types';

/**
 * Workflow Transition Guard — структурная проверка попытки перехода
 * относительно WorkflowDefinition. НЕ исполняет переход, НЕ обращается к
 * данным конкретной сущности (ClearancePackage и т.д.), НЕ вычисляет
 * содержательные условия (requirements_complete/custom_rule/... — это
 * задача будущей реализации, у которой есть доступ к реальным данным).
 *
 * Guard отвечает только на три вопроса, полностью статически выводимых из
 * самого WorkflowDefinition и WorkflowTransitionAttempt:
 *  1) существует ли в белом списке переход (from, to, trigger);
 *  2) разрешена ли запросившая переход роль для этого перехода;
 *  3) предоставлено ли обязательное текстовое обоснование, если оно
 *     требуется (requiresJustification).
 *
 * Именно поэтому здесь нет проверки условий (WorkflowCondition) —
 * содержательная оценка condition.kind (requirements_complete,
 * all_mandatory_lanes_outcome и т.д.) требует доступа к данным домена,
 * которых сознательно нет в этом модуле на этом этапе.
 */
function findMatchingTransition(
  definition: WorkflowDefinition,
  attempt: Pick<WorkflowTransitionAttempt, 'fromStateId' | 'toStateId' | 'trigger'>
): WorkflowTransitionDefinition | undefined {
  return definition.transitions.find(
    (t) => t.from === attempt.fromStateId && t.to === attempt.toStateId && t.trigger === attempt.trigger
  );
}

/**
 * Структурная проверка попытки перехода. Возвращает allowed=false с
 * человекочитаемой причиной при любом несоответствии белому списку,
 * ролям или обязательному обоснованию.
 */
function checkTransition(definition: WorkflowDefinition, attempt: WorkflowTransitionAttempt): WorkflowGuardResult {
  const transition = findMatchingTransition(definition, attempt);

  if (!transition) {
    return {
      allowed: false,
      reason: `Переход "${attempt.fromStateId}" → "${attempt.toStateId}" по триггеру "${attempt.trigger}" отсутствует в белом списке WorkflowDefinition (domainId="${definition.domainId}", version=${definition.version})`,
    };
  }

  if (!transition.allowedRoles.includes(attempt.actorRoleId)) {
    return {
      allowed: false,
      reason: `Роль "${attempt.actorRoleId}" не входит в число разрешённых ролей перехода "${transition.id}" (${transition.allowedRoles.join(', ')})`,
      transition,
    };
  }

  if (transition.requiresJustification && !attempt.justificationProvided) {
    return {
      allowed: false,
      reason: `Переход "${transition.id}" требует обязательное текстовое обоснование, которое не было предоставлено`,
      transition,
    };
  }

  return { allowed: true, transition };
}

/** Список переходов из состояния, доступных указанной роли (без учёта condition — только структура). */
function listAvailableTransitions(
  definition: WorkflowDefinition,
  fromStateId: string,
  actorRoleId: string
): WorkflowTransitionDefinition[] {
  return definition.transitions.filter((t) => t.from === fromStateId && t.allowedRoles.includes(actorRoleId));
}

export const workflowTransitionGuard = {
  findMatchingTransition,
  checkTransition,
  listAvailableTransitions,
};
