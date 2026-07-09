import { BusinessRule, RULE_PRIORITY_RANK } from './types';

/**
 * Rule Precedence Resolver — разрешение конфликтов между правилами одного
 * делового вопроса (ruleKey), зарегистрированными на разных уровнях приоритета:
 * законодательство → корпоративные требования → требования проекта →
 * требования заказчика → временные правила.
 *
 * Принципы разрешения:
 *  - Правила сортируются по возрастанию ранга приоритета (законодательство первым).
 *  - Более специфичное правило (ниже по приоритету) переопределяет более общее
 *    ТОЛЬКО если общее правило помечено overridable: true.
 *  - Законодательное правило с overridable: false — абсолютный минимум:
 *    ни одно правило нижестоящего уровня не может его исключить из применения.
 *  - Resolver не выполняет правила — только определяет ПОРЯДОК и ДОПУСТИМОСТЬ
 *    применения; фактическое выполнение остаётся за Rule Executor.
 */

/** Правила одного ruleKey, отсортированные от законодательства к временным. */
function sortByPrecedence(rules: BusinessRule[]): BusinessRule[] {
  return [...rules].sort((a, b) => RULE_PRIORITY_RANK[a.priority] - RULE_PRIORITY_RANK[b.priority]);
}

/**
 * Итоговый упорядоченный список правил, которые должны быть выполнены для
 * данного ruleKey с учётом переопределений: если правило верхнего уровня
 * не overridable — все правила нижних уровней остаются в списке ПОСЛЕ него
 * (выполняются как дополнительные проверки, не заменяя базовое требование).
 * Если правило overridable, и существует правило более низкого уровня —
 * оно исключается из итогового списка (переопределено более специфичным).
 */
function resolve(rules: BusinessRule[]): BusinessRule[] {
  const ordered = sortByPrecedence(rules);
  const result: BusinessRule[] = [];

  ordered.forEach((rule, index) => {
    const isOverriddenByMoreSpecific =
      rule.overridable && ordered.slice(index + 1).some((candidate) => candidate.ruleKey === rule.ruleKey);
    if (!isOverriddenByMoreSpecific) {
      result.push(rule);
    }
  });

  return result;
}

/** Правило наивысшего применимого приоритета для ruleKey (без учёта переопределений). */
function highestPriorityRule(rules: BusinessRule[]): BusinessRule | undefined {
  return sortByPrecedence(rules)[0];
}

export const rulePrecedenceResolver = {
  sortByPrecedence,
  resolve,
  highestPriorityRule,
};
