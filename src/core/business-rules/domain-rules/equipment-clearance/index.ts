/**
 * Библиотека правил допуска техники (Equipment Clearance Rule Library).
 *
 * Доменный модуль Business Rules Engine: хранит и регистрирует реальные
 * бизнес-правила модуля допуска техники ОТДЕЛЬНО от основной логики движка
 * (src/core/business-rules/*), но выполняется через тот же единый
 * ruleRegistry/ruleExecutor — архитектура Business Rules Engine не меняется.
 *
 * Состав:
 *  - types.ts                          — EquipmentClearanceRuleDefinition:
 *                                        доменное описание правила (название,
 *                                        описание, категория, приоритет/уровень,
 *                                        страна, даты действия, версия — через
 *                                        ruleRegistry, обязательность, автор)
 *  - equipmentClearanceRuleLibrary.ts   — регистрация (registerRule), версионированное
 *                                        обновление (updateRule), включение/отключение
 *                                        (setRuleEnabled), список правил библиотеки
 *                                        (listRules) — тонкая обёртка над ruleRegistry
 *  - rules/                             — по одному файлу на правило; на этом этапе
 *                                        только demoEquipmentClearanceRule.ts —
 *                                        демонстрационная заглушка без реальной
 *                                        бизнес-логики
 *  - registerEquipmentClearanceRules()  — регистрирует все правила библиотеки
 *                                        в ruleRegistry, вызывается один раз при
 *                                        старте приложения (по образцу
 *                                        registerBuiltinProviders() в AI Engine)
 *
 * Каждое правило возвращает только один из результатов Business Rules Engine:
 * passed 🟢 Допущено / warning 🟡 Замечание / failed 🔴 Не допущено /
 * pendingDecision 🔵 Ожидает решения — вместе с объяснением (какое правило
 * сработало, почему, источник, приоритет, версия), которое всегда возвращает
 * ruleExecutor.execute()/executeRuleKey(). Библиотека не использует AI Engine.
 */
import { ruleRegistry } from '../../ruleRegistry';
import { equipmentClearanceRuleLibrary } from './equipmentClearanceRuleLibrary';
import { equipmentClearanceRules } from './rules';

let registered = false;

/** Регистрирует все правила библиотеки допуска техники в ruleRegistry. */
export function registerEquipmentClearanceRules(): void {
  if (registered) return;
  registered = true;

  equipmentClearanceRules.forEach((rule) => equipmentClearanceRuleLibrary.registerRule(rule));
}

export { equipmentClearanceRuleLibrary };
export { equipmentClearanceRules, demoEquipmentClearanceRule } from './rules';
export type { EquipmentClearanceRuleDefinition } from './types';

/** Список зарегистрированных правил допуска техники (для отладки/диагностики). */
export function listEquipmentClearanceRules() {
  return ruleRegistry.listByNamespace(equipmentClearanceRuleLibrary.namespace);
}
