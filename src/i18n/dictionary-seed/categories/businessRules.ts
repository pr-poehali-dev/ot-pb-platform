import { TermTuple } from '../types';

/**
 * Business Rules Engine — единый перечень статусов результата (namespace: dict.businessRules).
 * Соответствует RuleOutcome/RULE_OUTCOME_DEFINITIONS (src/core/business-rules/types.ts):
 * passed 🟢 / warning 🟡 / failed 🔴 / pendingDecision 🔵.
 */
export const businessRulesTerms: TermTuple[] = [
  ['outcome.passed', 'Допущено', 'Passed', 'Рұқсат етілді', 'İzin Verildi', '已通过'],
  ['outcome.warning', 'Замечание', 'Warning', 'Ескерту', 'Uyarı', '警告'],
  ['outcome.failed', 'Не допущено', 'Failed', 'Рұқсат етілмеді', 'İzin Verilmedi', '不通过'],
  ['outcome.pendingDecision', 'Ожидает решения', 'Pending Decision', 'Шешім күтілуде', 'Karar Bekleniyor', '等待决定'],
];
