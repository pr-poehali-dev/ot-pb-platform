import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { BusinessRule, RuleCategoryValue } from './types';

/**
 * Rule Registry — централизованное хранилище бизнес-правил платформы.
 * Архитектура идентична providerRegistry (AI Engine) / statusService (core/statuses):
 * любой модуль регистрирует правило через registerRule() — реестр открыт для
 * расширения новыми правилами без изменения самого движка.
 */
const store = createStore<Record<string, BusinessRule>>({});

function registerRule(rule: BusinessRule): void {
  store.setState((prev) => ({ ...prev, [rule.id]: rule }));
  eventBus.emit('business-rules.rule_registered', { ruleId: rule.id, category: rule.category }, 'rule-registry');
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

function listActiveRules(): BusinessRule[] {
  return listRules().filter((r) => r.status === 'active');
}

function setStatus(ruleId: string, status: BusinessRule['status']): void {
  store.setState((prev) => {
    const rule = prev[ruleId];
    if (!rule) return prev;
    return { ...prev, [ruleId]: { ...rule, status } };
  });
}

export const ruleRegistry = {
  store,
  registerRule,
  unregisterRule,
  getRule,
  listRules,
  listByCategory,
  listByNamespace,
  listActiveRules,
  setStatus,
};
