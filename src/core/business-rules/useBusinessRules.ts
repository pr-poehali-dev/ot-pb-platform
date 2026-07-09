import { useStore } from '../shared/useStore';
import { ruleRegistry } from './ruleRegistry';
import { ruleAuditLog } from './ruleAuditLog';
import { ruleExecutor } from './ruleExecutor';
import { legislationChangeRegistry } from './legislationChangeRegistry';
import { RuleCategoryValue } from './types';

/**
 * React-хук доступа к Business Rules Engine для будущих модулей платформы.
 * По образцу useAIHub (AI Engine) / useStatuses (core/statuses): объединяет
 * реактивное состояние реестра правил, журнала выполнения и предложений
 * по изменению законодательства в одном месте.
 */
export function useBusinessRules(category?: RuleCategoryValue) {
  const rulesMap = useStore(ruleRegistry.store);
  const auditEntries = useStore(ruleAuditLog.store);
  const legislationProposals = useStore(legislationChangeRegistry.store);

  const rules = Object.values(rulesMap);

  return {
    rules: category ? rules.filter((r) => r.category === category) : rules,
    auditEntries,
    pendingLegislationChanges: Object.values(legislationProposals).filter(
      (p) => p.status === 'pending_confirmation'
    ),
    execute: ruleExecutor.execute,
    executeMany: ruleExecutor.executeMany,
    executeCategory: ruleExecutor.executeCategory,
    executeRuleKey: ruleExecutor.executeRuleKey,
    defineRule: ruleRegistry.defineRule,
    updateRule: ruleRegistry.updateRule,
    proposeLegislationChange: legislationChangeRegistry.proposeChange,
    confirmLegislationChange: legislationChangeRegistry.confirmChange,
    rejectLegislationChange: legislationChangeRegistry.rejectChange,
  };
}
