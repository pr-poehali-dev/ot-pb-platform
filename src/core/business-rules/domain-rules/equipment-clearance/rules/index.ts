import { demoEquipmentClearanceRule } from './demoEquipmentClearanceRule';
import { EquipmentClearanceRuleDefinition } from '../types';

/**
 * Список правил библиотеки допуска техники первого этапа (инфраструктура).
 * Чтобы добавить новое реальное правило — достаточно создать новый файл
 * (по образцу demoEquipmentClearanceRule.ts) и добавить его в этот список;
 * ни Business Rules Engine, ни equipmentClearanceRuleLibrary менять не нужно.
 */
export const equipmentClearanceRules: EquipmentClearanceRuleDefinition[] = [demoEquipmentClearanceRule];

export { demoEquipmentClearanceRule };
