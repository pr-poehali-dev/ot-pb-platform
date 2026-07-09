import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import {
  BusinessRule,
  RuleApplicabilityCheck,
  RuleContext,
  RuleCountryCode,
  RuleCategoryValue,
  RuleDefinitionInput,
  RuleUpdateInput,
  GLOBAL_JURISDICTION,
} from './types';

/**
 * Rule Registry — централизованное хранилище бизнес-правил платформы.
 * Архитектура идентична providerRegistry (AI Engine) / statusService (core/statuses):
 * любой модуль регистрирует правило через defineRule() — реестр открыт для
 * расширения новыми правилами без изменения самого движка.
 *
 * Каждое правило версионируется: defineRule() создаёт версию 1 с первой записью
 * истории, updateRule() увеличивает версию и добавляет запись с автором и
 * описанием изменения — правило никогда не редактируется "молча".
 */
const store = createStore<Record<string, BusinessRule>>({});

function defineRule(input: RuleDefinitionInput): BusinessRule {
  const rule: BusinessRule = {
    id: input.id,
    ruleKey: input.ruleKey,
    category: input.category,
    namespace: input.namespace,
    label: input.label,
    status: input.status ?? 'active',
    priority: input.priority,
    country: input.country,
    source: input.source,
    overridable: input.overridable,
    effectiveFrom: input.effectiveFrom,
    effectiveTo: input.effectiveTo,
    config: input.config,
    evaluate: input.evaluate,
    version: 1,
    history: [
      {
        version: 1,
        changedBy: input.changedBy,
        changedAt: new Date().toISOString(),
        changeDescription: input.changeDescription,
      },
    ],
  };
  store.setState((prev) => ({ ...prev, [rule.id]: rule }));
  eventBus.emit(
    'business-rules.rule_registered',
    { ruleId: rule.id, ruleKey: rule.ruleKey, category: rule.category, priority: rule.priority, version: rule.version },
    'rule-registry'
  );
  return rule;
}

/**
 * Версионированное обновление существующего правила. Никогда не перезаписывает
 * правило "молча" — каждый вызов обязан указать автора (changedBy) и причину
 * (changeDescription), которые добавляются в неизменяемую историю изменений.
 */
function updateRule(ruleId: string, input: RuleUpdateInput): BusinessRule | undefined {
  const existing = store.getState()[ruleId];
  if (!existing) return undefined;

  const { changedBy, changeDescription, ...patch } = input;
  const nextVersion = existing.version + 1;

  const updated: BusinessRule = {
    ...existing,
    ...patch,
    version: nextVersion,
    history: [
      ...existing.history,
      {
        version: nextVersion,
        changedBy,
        changedAt: new Date().toISOString(),
        changeDescription,
      },
    ],
  };

  store.setState((prev) => ({ ...prev, [ruleId]: updated }));
  eventBus.emit(
    'business-rules.rule_updated',
    { ruleId: updated.id, ruleKey: updated.ruleKey, version: updated.version, changedBy },
    'rule-registry'
  );
  return updated;
}

function unregisterRule(ruleId: string): void {
  store.setState((prev) => {
    const next = { ...prev };
    delete next[ruleId];
    return next;
  });
}

function getRule(ruleId: string): BusinessRule | undefined {
  return store.getState()[ruleId];
}

function listRules(): BusinessRule[] {
  return Object.values(store.getState());
}

function listByCategory(category: RuleCategoryValue): BusinessRule[] {
  return listRules().filter((r) => r.category === category);
}

function listByNamespace(namespace: string): BusinessRule[] {
  return listRules().filter((r) => r.namespace === namespace);
}

/** Все зарегистрированные версии/приоритеты правил, отвечающих за один деловой вопрос. */
function listByRuleKey(ruleKey: string): BusinessRule[] {
  return listRules().filter((r) => r.ruleKey === ruleKey);
}

function listActiveRules(): BusinessRule[] {
  return listRules().filter((r) => r.status === 'active');
}

function setStatus(ruleId: string, status: BusinessRule['status'], changedBy: string): void {
  const existing = store.getState()[ruleId];
  if (!existing) return;
  updateRule(ruleId, {
    status,
    changedBy,
    changeDescription: `Status changed to "${status}"`,
  });
}

/**
 * Проверка применимости правила к контексту выполнения: активность, страна
 * (с учётом GLOBAL_JURISDICTION), даты вступления/окончания действия
 * относительно RuleContext.asOf (по умолчанию — текущий момент). Не проверяет
 * бизнес-условия самого правила — это делает evaluate().
 */
function isApplicable(rule: BusinessRule, context: RuleContext): RuleApplicabilityCheck {
  if (rule.status !== 'active') {
    return { applicable: false, reason: `Rule status is "${rule.status}"` };
  }

  const country: RuleCountryCode | undefined = context.country;
  if (country && rule.country !== GLOBAL_JURISDICTION && rule.country !== country) {
    return { applicable: false, reason: `Rule applies to "${rule.country}", context is "${country}"` };
  }

  const asOf = context.asOf ? new Date(context.asOf) : new Date();

  if (rule.effectiveFrom && asOf < new Date(rule.effectiveFrom)) {
    return { applicable: false, reason: `Rule is not yet effective (from ${rule.effectiveFrom})` };
  }

  if (rule.effectiveTo && asOf > new Date(rule.effectiveTo)) {
    return { applicable: false, reason: `Rule has expired (until ${rule.effectiveTo})` };
  }

  return { applicable: true };
}

export const ruleRegistry = {
  store,
  defineRule,
  updateRule,
  unregisterRule,
  getRule,
  listRules,
  listByCategory,
  listByNamespace,
  listByRuleKey,
  listActiveRules,
  setStatus,
  isApplicable,
};
