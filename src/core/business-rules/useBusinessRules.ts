import { useStore } from '../shared/useStore';
import { ruleRegistry } from './ruleRegistry';
import { ruleAuditLog } from './ruleAuditLog';
import { ruleExecutor } from './ruleExecutor';
import { RuleCategoryValue } from './types';

/**
 * React-хук доступа к Business Rules Engine для будущих модулей платформы.
 * По образцу useAIHub (AI Engine) / useStatuses (core/statuses): объединяет
 * реактивное состояние реестра правил и журнала их выполнения в одном месте.
 */
export function useBusinessRules(category?: RuleCategoryValue) {
  const rulesMap = useStore(ruleRegistry.store);
  const auditEntries = useStore(ruleAuditLog.store);

  const rules = Object.values(rulesMap);

  return {
    rules: category ? rules.filter((r) => r.category === category) : rules,
    auditEntries,
    execute: ruleExecutor.execute,
    executeMany: ruleExecutor.executeMany,
    executeCategory: ruleExecutor.executeCategory,
    registerRule: ruleRegistry.registerRule,
  };
}
