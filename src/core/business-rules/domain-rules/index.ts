/**
 * Domain Rules — доменные библиотеки правил Business Rules Engine.
 *
 * Каждая библиотека (equipment-clearance и будущие: document-verification,
 * training-check, medical-exam-check и т.д.) хранит и регистрирует реальные
 * бизнес-правила своего модуля, используя тот же единый ruleRegistry/ruleExecutor
 * ядра — без изменения архитектуры Business Rules Engine.
 *
 * registerAllDomainRules() — единая точка регистрации всех доменных библиотек,
 * вызывается один раз при старте приложения вместе с
 * businessRulesService.initBusinessRulesEngine().
 */
import { registerEquipmentClearanceRules } from './equipment-clearance';

let registered = false;

export function registerAllDomainRules(): void {
  if (registered) return;
  registered = true;

  registerEquipmentClearanceRules();
}

export * from './equipment-clearance';
