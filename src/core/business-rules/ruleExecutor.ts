import { eventBus } from '../event-bus';
import { ruleRegistry } from './ruleRegistry';
import { RuleContext, RuleResult } from './types';

/**
 * Rule Executor — единый интерфейс выполнения бизнес-правил.
 *
 * Выполняет правило ЛОКАЛЬНО, без обращения к AI Engine — движок работает
 * полностью автономно на собственных алгоритмах, как того требует архитектура
 * платформы (Noventra сначала решает задачи собственной логикой). Правило
 * само определяет через RuleResult, требуется ли AI/человек для дальнейшей
 * обработки — Rule Executor лишь передаёт этот результат вызывающему коду.
 *
 * Каждое выполнение публикуется в Event Bus (business-rules.rule_evaluated /
 * rule_failed) — Rule Audit Log слушает эти события через initRuleAuditLogBridge,
 * поэтому executor не обязан писать в журнал напрямую (по образцу того, как
 * aiEngineService не пишет напрямую в AI Action Log).
 */
async function execute(ruleId: string, context: RuleContext): Promise<RuleResult> {
  const rule = ruleRegistry.getRule(ruleId);

  if (!rule) {
    const error = `Business rule "${ruleId}" is not registered`;
    eventBus.emit(
      'business-rules.rule_failed',
      { ruleId, category: undefined, actor: context.actor, entity: context.entity, error },
      'rule-executor'
    );
    throw new Error(error);
  }

  if (rule.status !== 'active') {
    const error = `Business rule "${ruleId}" is not active (status: ${rule.status})`;
    eventBus.emit(
      'business-rules.rule_failed',
      { ruleId, category: rule.category, actor: context.actor, entity: context.entity, error },
      'rule-executor'
    );
    throw new Error(error);
  }

  try {
    const result = await rule.evaluate(context);
    eventBus.emit(
      'business-rules.rule_evaluated',
      { ruleId, category: rule.category, actor: context.actor, entity: context.entity, result },
      'rule-executor'
    );
    return result;
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    eventBus.emit(
      'business-rules.rule_failed',
      { ruleId, category: rule.category, actor: context.actor, entity: context.entity, error },
      'rule-executor'
    );
    throw err;
  }
}

/** Последовательное выполнение нескольких правил с одним и тем же контекстом. */
async function executeMany(ruleIds: string[], context: RuleContext): Promise<RuleResult[]> {
  const results: RuleResult[] = [];
  for (const ruleId of ruleIds) {
    results.push(await execute(ruleId, context));
  }
  return results;
}

/** Выполнение всех активных правил заданной категории с одним и тем же контекстом. */
async function executeCategory(
  category: Parameters<typeof ruleRegistry.listByCategory>[0],
  context: RuleContext
): Promise<RuleResult[]> {
  const ruleIds = ruleRegistry
    .listByCategory(category)
    .filter((r) => r.status === 'active')
    .map((r) => r.id);
  return executeMany(ruleIds, context);
}

export const ruleExecutor = {
  execute,
  executeMany,
  executeCategory,
};
