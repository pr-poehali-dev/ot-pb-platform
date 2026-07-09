import { eventBus } from '../event-bus';
import { ruleRegistry } from './ruleRegistry';
import { rulePrecedenceResolver } from './rulePrecedenceResolver';
import { BusinessRule, RuleCategoryValue, RuleContext, RuleExecutionResult, RuleExplanation } from './types';

/**
 * Rule Executor — единый интерфейс выполнения бизнес-правил.
 *
 * Выполняет правило ЛОКАЛЬНО, без обращения к AI Engine — движок работает
 * полностью автономно на собственных алгоритмах, как того требует архитектура
 * платформы (Noventra сначала решает задачи собственной логикой). Правило
 * само определяет через RuleResult, требуется ли AI/человек для дальнейшей
 * обработки — Rule Executor лишь передаёт этот результат вызывающему коду.
 *
 * Каждый ответ движка — RuleExecutionResult — обязательно включает explanation
 * (требование объяснимости): какое правило сработало, почему, из какого
 * источника, с каким приоритетом и версией. Ни один результат не возвращается
 * без этого объяснения.
 *
 * Каждое выполнение публикуется в Event Bus (business-rules.rule_evaluated /
 * rule_failed) — Rule Audit Log слушает эти события через initRuleAuditLogBridge,
 * поэтому executor не обязан писать в журнал напрямую (по образцу того, как
 * aiEngineService не пишет напрямую в AI Action Log).
 */
function buildExplanation(rule: BusinessRule, reason: string): RuleExplanation {
  return {
    ruleId: rule.id,
    ruleKey: rule.ruleKey,
    ruleLabel: rule.label,
    reason,
    priority: rule.priority,
    version: rule.version,
    source: rule.source,
    country: rule.country,
    overridable: rule.overridable,
  };
}

function emitFailure(ruleId: string, category: RuleCategoryValue | undefined, context: RuleContext, error: string): void {
  eventBus.emit(
    'business-rules.rule_failed',
    { ruleId, category, actor: context.actor, entity: context.entity, error },
    'rule-executor'
  );
}

async function execute(ruleId: string, context: RuleContext): Promise<RuleExecutionResult> {
  const rule = ruleRegistry.getRule(ruleId);

  if (!rule) {
    const error = `Business rule "${ruleId}" is not registered`;
    emitFailure(ruleId, undefined, context, error);
    throw new Error(error);
  }

  const applicability = ruleRegistry.isApplicable(rule, context);
  if (!applicability.applicable) {
    const error = `Business rule "${ruleId}" is not applicable: ${applicability.reason}`;
    emitFailure(ruleId, rule.category, context, error);
    throw new Error(error);
  }

  try {
    const result = await rule.evaluate(context);
    const explanation = buildExplanation(rule, result.message);
    eventBus.emit(
      'business-rules.rule_evaluated',
      { ruleId, category: rule.category, actor: context.actor, entity: context.entity, result, explanation },
      'rule-executor'
    );
    return { result, explanation };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    emitFailure(ruleId, rule.category, context, error);
    throw err;
  }
}

/** Последовательное выполнение нескольких правил с одним и тем же контекстом. */
async function executeMany(ruleIds: string[], context: RuleContext): Promise<RuleExecutionResult[]> {
  const results: RuleExecutionResult[] = [];
  for (const ruleId of ruleIds) {
    results.push(await execute(ruleId, context));
  }
  return results;
}

/** Выполнение всех активных применимых правил заданной категории с одним и тем же контекстом. */
async function executeCategory(category: RuleCategoryValue, context: RuleContext): Promise<RuleExecutionResult[]> {
  const ruleIds = ruleRegistry
    .listByCategory(category)
    .filter((r) => ruleRegistry.isApplicable(r, context).applicable)
    .map((r) => r.id);
  return executeMany(ruleIds, context);
}

/**
 * Выполнение делового вопроса (ruleKey) с учётом приоритетов и переопределений:
 * rulePrecedenceResolver определяет итоговый набор правил (законодательство,
 * не переопределённое overridable-исключениями, + применимые более специфичные
 * уровни), затем каждое из них выполняется по очереди с общим контекстом.
 * Это единственная точка, где законодательные требования гарантированно
 * не могут быть "тихо" отброшены нижестоящими уровнями приоритета.
 */
async function executeRuleKey(ruleKey: string, context: RuleContext): Promise<RuleExecutionResult[]> {
  const applicable = ruleRegistry
    .listByRuleKey(ruleKey)
    .filter((r) => ruleRegistry.isApplicable(r, context).applicable);
  const resolved = rulePrecedenceResolver.resolve(applicable);
  return executeMany(
    resolved.map((r) => r.id),
    context
  );
}

export const ruleExecutor = {
  execute,
  executeMany,
  executeCategory,
  executeRuleKey,
};
