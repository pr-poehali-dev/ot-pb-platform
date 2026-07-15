import {
  WorkflowConditionKind,
  WorkflowDefinition,
  WorkflowStateCategory,
  WorkflowStateDefinition,
  WorkflowTransitionDefinition,
} from './types';

/**
 * Workflow Graph Analyzer — чистый структурный анализатор графа состояний
 * WorkflowDefinition. Не хранит состояние, не обращается к Event Bus, не
 * исполняет ничего — только читает переданный WorkflowDefinition и отвечает
 * на вопросы о структуре графа. Используется workflowDefinitionValidator, но
 * является самостоятельным, независимо тестируемым модулем.
 *
 * Глобально запрещённые пары категорий состояний (не могут быть добавлены в
 * белый список переходов НИ ОДНИМ доменом, включая Force Transition):
 *  - Draft → Approved      (например, draft → cleared)
 *  - Draft → Rejected      (например, draft → not_cleared)
 *  - Blocked → Approved    (например, needs_revision → cleared)
 *  - Archived → любая не-Archived категория
 *  - Rejected → Approved   (например, not_cleared → cleared)
 * Правило выражено через универсальные WorkflowStateCategory, а не через
 * доменные id состояний — это сохраняет Domain Agnostic Architecture:
 * ограничение действует для ЛЮБОГО домена, регистрирующего свой
 * WorkflowDefinition, независимо от того, как домен назвал свои состояния.
 */
const FORBIDDEN_CATEGORY_PAIRS: ReadonlyArray<{
  from: string;
  to: string;
  reason: string;
}> = [
  { from: WorkflowStateCategory.Draft, to: WorkflowStateCategory.Approved, reason: 'draft → approved/cleared запрещён архитектурно' },
  { from: WorkflowStateCategory.Draft, to: WorkflowStateCategory.Rejected, reason: 'draft → rejected/not_cleared запрещён архитектурно' },
  { from: WorkflowStateCategory.Blocked, to: WorkflowStateCategory.Approved, reason: 'needs_revision → cleared запрещён архитектурно' },
  { from: WorkflowStateCategory.Rejected, to: WorkflowStateCategory.Approved, reason: 'not_cleared → cleared запрещён архитектурно' },
];

function getStateMap(definition: WorkflowDefinition): Map<string, WorkflowStateDefinition> {
  return new Map(definition.states.map((s) => [s.id, s]));
}

/** Список смежности: id состояния → все исходящие переходы (только по реально существующим from). */
function buildAdjacency(definition: WorkflowDefinition): Map<string, WorkflowTransitionDefinition[]> {
  const adjacency = new Map<string, WorkflowTransitionDefinition[]>();
  for (const t of definition.transitions) {
    const list = adjacency.get(t.from) ?? [];
    list.push(t);
    adjacency.set(t.from, list);
  }
  return adjacency;
}

function findStartStates(definition: WorkflowDefinition): WorkflowStateDefinition[] {
  return definition.states.filter((s) => s.isStart);
}

function findFinalStates(definition: WorkflowDefinition): WorkflowStateDefinition[] {
  return definition.states.filter((s) => s.isFinal);
}

/** Ссылки на несуществующие состояния в переходах (from/to не найдены в states). */
function findInvalidStateRefs(definition: WorkflowDefinition): { unknownFrom: WorkflowTransitionDefinition[]; unknownTo: WorkflowTransitionDefinition[] } {
  const stateMap = getStateMap(definition);
  const unknownFrom = definition.transitions.filter((t) => !stateMap.has(t.from));
  const unknownTo = definition.transitions.filter((t) => !stateMap.has(t.to));
  return { unknownFrom, unknownTo };
}

/**
 * Состояния, недостижимые из стартового состояния через направленные
 * переходы (BFS от каждого isStart-состояния). Если стартовых состояний нет
 * или больше одного — недостижимость не считается (это отдельная ошибка
 * валидатора 'no_start_state'/'multiple_start_states').
 */
function findUnreachableStates(definition: WorkflowDefinition): WorkflowStateDefinition[] {
  const starts = findStartStates(definition);
  if (starts.length !== 1) return [];

  const adjacency = buildAdjacency(definition);
  const visited = new Set<string>();
  const queue: string[] = [starts[0].id];
  visited.add(starts[0].id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const outgoing = adjacency.get(current) ?? [];
    for (const t of outgoing) {
      if (!visited.has(t.to)) {
        visited.add(t.to);
        queue.push(t.to);
      }
    }
  }

  return definition.states.filter((s) => !visited.has(s.id));
}

/**
 * "Висящие" состояния: не финальные (isFinal=false) и не имеющие ни одного
 * исходящего перехода. Финальные состояния намеренно исключены — терминальное
 * поглощающее состояние (например, категории Archived) обязано не иметь
 * исходящих переходов, это НЕ дефект.
 */
function findDeadEndStates(definition: WorkflowDefinition): WorkflowStateDefinition[] {
  const adjacency = buildAdjacency(definition);
  return definition.states.filter((s) => !s.isFinal && (adjacency.get(s.id) ?? []).length === 0);
}

/** Группы переходов-дублей — совпадающие по тройке (from, to, trigger). */
function findDuplicateTransitions(definition: WorkflowDefinition): WorkflowTransitionDefinition[][] {
  const groups = new Map<string, WorkflowTransitionDefinition[]>();
  for (const t of definition.transitions) {
    const key = `${t.from}::${t.to}::${t.trigger}`;
    const list = groups.get(key) ?? [];
    list.push(t);
    groups.set(key, list);
  }
  return Array.from(groups.values()).filter((list) => list.length > 1);
}

/**
 * Переходы, исходящие из состояния категории Archived — должны отсутствовать
 * для ЛЮБОГО домена (архивное состояние поглощающее по определению движка).
 */
function findArchivedCategoryOutgoing(definition: WorkflowDefinition): WorkflowTransitionDefinition[] {
  const stateMap = getStateMap(definition);
  return definition.transitions.filter((t) => stateMap.get(t.from)?.category === WorkflowStateCategory.Archived);
}

/** Переходы, нарушающие один из глобально запрещённых по категориям переходов (см. FORBIDDEN_CATEGORY_PAIRS). */
function findForbiddenCategoryTransitions(
  definition: WorkflowDefinition
): Array<{ transition: WorkflowTransitionDefinition; reason: string }> {
  const stateMap = getStateMap(definition);
  const violations: Array<{ transition: WorkflowTransitionDefinition; reason: string }> = [];

  for (const t of definition.transitions) {
    const fromCategory = stateMap.get(t.from)?.category;
    const toCategory = stateMap.get(t.to)?.category;
    if (!fromCategory || !toCategory) continue;

    for (const pair of FORBIDDEN_CATEGORY_PAIRS) {
      if (fromCategory === pair.from && toCategory === pair.to) {
        violations.push({ transition: t, reason: pair.reason });
      }
    }

    // Archived → любая не-Archived категория (отдельное правило: единственная запрещённая пара с "любой" целью).
    if (fromCategory === WorkflowStateCategory.Archived && toCategory !== WorkflowStateCategory.Archived) {
      violations.push({ transition: t, reason: 'archived → активное состояние запрещён архитектурно' });
    }
  }

  return violations;
}

/**
 * Переходы в состояние категории Approved, обходящие проверку обязательных
 * дорожек: если в WorkflowDefinition объявлена хотя бы одна обязательная
 * дорожка (lane.mandatory === true), переход в Approved-категорию обязан
 * содержать условие AllMandatoryLanesOutcome с laneOutcome='approved' —
 * иначе положительный итог мог бы быть достигнут в обход проверки дорожек.
 */
function findLaneBypassTransitions(definition: WorkflowDefinition): WorkflowTransitionDefinition[] {
  const hasMandatoryLanes = definition.lanes.some((l) => l.mandatory);
  if (!hasMandatoryLanes) return [];

  const stateMap = getStateMap(definition);
  return definition.transitions.filter((t) => {
    if (stateMap.get(t.to)?.category !== WorkflowStateCategory.Approved) return false;
    const hasGuard = t.conditions.some(
      (c) => c.kind === WorkflowConditionKind.AllMandatoryLanesOutcome && c.laneOutcome === 'approved'
    );
    return !hasGuard;
  });
}

/**
 * Простое (не исчерпывающее в патологических графах) обнаружение циклов
 * методом DFS с раскраской вершин (white/gray/black): каждый раз, когда
 * обход достигает "серой" (текущей в стеке) вершины, фиксируется цикл —
 * путь от этой вершины до вершины на вершине стека. Циклы дедуплицируются
 * по нормализованной сигнатуре (последовательность id, начиная с
 * лексикографически наименьшего элемента).
 */
function findCycles(definition: WorkflowDefinition): string[][] {
  const adjacency = buildAdjacency(definition);
  const color = new Map<string, 'white' | 'gray' | 'black'>();
  definition.states.forEach((s) => color.set(s.id, 'white'));

  const stack: string[] = [];
  const cycles: string[][] = [];
  const seenSignatures = new Set<string>();

  const normalize = (cycle: string[]): string => {
    const minIndex = cycle.reduce((best, _, i, arr) => (arr[i] < arr[best] ? i : best), 0);
    const rotated = [...cycle.slice(minIndex), ...cycle.slice(0, minIndex)];
    return rotated.join('>');
  };

  const dfs = (nodeId: string) => {
    color.set(nodeId, 'gray');
    stack.push(nodeId);

    for (const t of adjacency.get(nodeId) ?? []) {
      const nextColor = color.get(t.to);
      if (nextColor === 'gray') {
        const startIdx = stack.indexOf(t.to);
        if (startIdx !== -1) {
          const cycle = stack.slice(startIdx);
          const signature = normalize(cycle);
          if (!seenSignatures.has(signature)) {
            seenSignatures.add(signature);
            cycles.push(cycle);
          }
        }
      } else if (nextColor === 'white') {
        dfs(t.to);
      }
    }

    stack.pop();
    color.set(nodeId, 'black');
  };

  for (const state of definition.states) {
    if (color.get(state.id) === 'white') {
      dfs(state.id);
    }
  }

  return cycles;
}

/**
 * "Управляемость" цикла: цикл считается управляемым, если хотя бы одно
 * ребро цикла имеет условие, отличное от 'always' (реальный гейт,
 * зависящий от внешних данных — например, исхода дорожки проверки или
 * состояния SLA), либо явно требует текстового обоснования человека
 * (requiresJustification=true — гарантированно не может произойти
 * автоматически бесконечно). Пример допустимого управляемого цикла
 * "under_review → needs_revision → under_review" (см. согласованную
 * архитектуру personnel-clearance) проходит эту проверку структурно —
 * без хардкода конкретных id состояний, так как ребро needs_revision →
 * under_review (resubmit) инициируется ролью submitter и не имеет
 * kind='always' без условий.
 */
function isCycleControlled(cycle: string[], definition: WorkflowDefinition): boolean {
  if (cycle.length === 0) return true;
  const adjacency = buildAdjacency(definition);

  for (let i = 0; i < cycle.length; i++) {
    const from = cycle[i];
    const to = cycle[(i + 1) % cycle.length];
    const edges = (adjacency.get(from) ?? []).filter((t) => t.to === to);

    for (const edge of edges) {
      const hasRealCondition = edge.conditions.some((c) => c.kind !== WorkflowConditionKind.Always);
      if (hasRealCondition || edge.requiresJustification) {
        return true;
      }
    }
  }

  return false;
}

function findUncontrolledCycles(definition: WorkflowDefinition): string[][] {
  return findCycles(definition).filter((cycle) => !isCycleControlled(cycle, definition));
}

export const workflowGraphAnalyzer = {
  getStateMap,
  buildAdjacency,
  findStartStates,
  findFinalStates,
  findInvalidStateRefs,
  findUnreachableStates,
  findDeadEndStates,
  findDuplicateTransitions,
  findArchivedCategoryOutgoing,
  findForbiddenCategoryTransitions,
  findLaneBypassTransitions,
  findCycles,
  isCycleControlled,
  findUncontrolledCycles,
};