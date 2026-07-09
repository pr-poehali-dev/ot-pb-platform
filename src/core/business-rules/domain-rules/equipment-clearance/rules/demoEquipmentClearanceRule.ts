import { RulePriority, RuleResult, GLOBAL_JURISDICTION } from '../../../types';
import { EquipmentClearanceRuleDefinition } from '../types';

/**
 * Демонстрационное правило библиотеки допуска техники.
 *
 * ВАЖНО: это НЕ реальная бизнес-проверка — evaluate() всегда возвращает
 * фиксированный результат 'passed' и служит только для подтверждения того,
 * что инфраструктура библиотеки (регистрация, версия, история, включение/
 * отключение, объяснение) работает end-to-end. Реальная логика допуска
 * техники (проверка осмотра, документов, сроков и т.д.) будет добавлена
 * позже отдельными правилами через equipmentClearanceRuleLibrary.registerRule().
 */
function evaluateDemo(): RuleResult {
  return {
    outcome: 'passed',
    severity: 'low',
    message: 'Демонстрационное правило допуска техники: инфраструктура библиотеки работает корректно.',
    metadata: { demo: true },
  };
}

export const demoEquipmentClearanceRule: EquipmentClearanceRuleDefinition = {
  id: 'equipment-clearance.demo-placeholder',
  ruleKey: 'equipment-clearance.demo-placeholder',
  label: 'Демонстрационное правило допуска техники',
  description:
    'Заглушка для проверки инфраструктуры библиотеки правил допуска техники. Не содержит реальной бизнес-логики.',
  priority: RulePriority.Temporary,
  country: GLOBAL_JURISDICTION,
  source: { name: 'Business Rules Engine — демонстрационная запись' },
  overridable: true,
  mandatory: false,
  evaluate: evaluateDemo,
  changedBy: 'system-seed',
  changeDescription: 'Первичная регистрация демонстрационного правила библиотеки допуска техники',
};
