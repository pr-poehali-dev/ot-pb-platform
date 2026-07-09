import { ruleRegistry } from '../../ruleRegistry';
import { BusinessRule, RuleCategory } from '../../types';
import { EquipmentClearanceRuleDefinition } from './types';

/**
 * Equipment Clearance Rule Library — библиотека правил допуска техники.
 *
 * Это НЕ отдельный движок и НЕ отдельное хранилище: все правила регистрируются
 * в том же едином ruleRegistry Business Rules Engine (namespace = 'equipment-clearance'),
 * архитектура движка не меняется. Библиотека — лишь доменная точка входа, которая:
 *  - хранит правила модуля допуска техники отдельно от прочего кода платформы;
 *  - переводит доменное описание правила (EquipmentClearanceRuleDefinition) в
 *    стандартный контракт RuleDefinitionInput (namespace, category, config
 *    с доменными полями description/mandatory) без изменения контракта движка;
 *  - даёт единый способ для будущих реальных правил допуска техники
 *    регистрироваться, обновляться, включаться/выключаться.
 *
 * На этом этапе — только инфраструктура и одно демонстрационное правило без
 * реальной бизнес-логики (см. rules/demoEquipmentClearanceRule.ts).
 */
const NAMESPACE = 'equipment-clearance';

/** Регистрация нового правила библиотеки допуска техники (версия 1). */
function registerRule(definition: EquipmentClearanceRuleDefinition): BusinessRule {
  return ruleRegistry.defineRule({
    id: definition.id,
    ruleKey: definition.ruleKey,
    category: definition.category ?? RuleCategory.EquipmentClearance,
    namespace: NAMESPACE,
    label: definition.label,
    priority: definition.priority,
    country: definition.country,
    source: definition.source,
    overridable: definition.overridable,
    effectiveFrom: definition.effectiveFrom,
    effectiveTo: definition.effectiveTo,
    config: {
      ...definition.config,
      description: definition.description,
      mandatory: definition.mandatory,
    },
    evaluate: definition.evaluate,
    changedBy: definition.changedBy,
    changeDescription: definition.changeDescription,
  });
}

/**
 * Версионированное обновление правила библиотеки (новая версия, запись в
 * журнале изменений) — по образцу ruleRegistry.updateRule().
 */
function updateRule(
  ruleId: string,
  patch: Partial<Omit<EquipmentClearanceRuleDefinition, 'id' | 'ruleKey'>> & {
    changedBy: string;
    changeDescription: string;
  }
): BusinessRule | undefined {
  const { description, mandatory, config, changedBy, changeDescription, ...rest } = patch;

  const existing = ruleRegistry.getRule(ruleId);
  const nextConfig =
    description !== undefined || mandatory !== undefined || config !== undefined
      ? { ...existing?.config, ...config, ...(description !== undefined ? { description } : {}), ...(mandatory !== undefined ? { mandatory } : {}) }
      : undefined;

  return ruleRegistry.updateRule(ruleId, {
    ...rest,
    ...(nextConfig ? { config: nextConfig } : {}),
    changedBy,
    changeDescription,
  });
}

/** Включение/отключение правила библиотеки без удаления его из реестра. */
function setRuleEnabled(ruleId: string, enabled: boolean, changedBy: string): void {
  ruleRegistry.setStatus(ruleId, enabled ? 'active' : 'disabled', changedBy);
}

/** Все правила библиотеки допуска техники, зарегистрированные в ruleRegistry. */
function listRules(): BusinessRule[] {
  return ruleRegistry.listByNamespace(NAMESPACE);
}

export const equipmentClearanceRuleLibrary = {
  namespace: NAMESPACE,
  registerRule,
  updateRule,
  setRuleEnabled,
  listRules,
};
