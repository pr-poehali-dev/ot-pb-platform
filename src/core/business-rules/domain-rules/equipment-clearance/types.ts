import { ISODateString } from '../../../types';
import {
  RuleCategoryValue,
  RuleContext,
  RuleCountryCode,
  RulePriorityValue,
  RuleResult,
  RuleSource,
} from '../../types';

/**
 * Входные метаданные для регистрации правила библиотеки допуска техники.
 * НЕ создаёт нового контракта движка — это доменная обёртка над стандартным
 * RuleDefinitionInput Business Rules Engine (см. equipmentClearanceRuleLibrary.registerRule),
 * которая явно перечисляет поля, требуемые для модуля допуска техники:
 * id, название (label), описание, категория, приоритет, уровень (=priority),
 * страна применения, даты действия, обязательность (mandatory), возможность
 * включения/отключения (через status/ruleRegistry.setStatus) и автор изменения.
 *
 * `mandatory` и `description` — доменные поля, отсутствующие в универсальном
 * контракте BusinessRule. Они сохраняются через штатную точку расширения
 * движка `BusinessRule.config` (см. types.ts, BusinessRule.config) — то есть
 * без изменения архитектуры Business Rules Engine.
 */
export interface EquipmentClearanceRuleDefinition {
  /** Уникальный идентификатор правила в реестре */
  id: string;
  /** Идентификатор делового вопроса (группирует версии/приоритеты одного правила) */
  ruleKey: string;
  /** Название правила */
  label: string;
  /** Описание правила — что и зачем оно проверяет */
  description: string;
  /** Категория Business Rules Engine (по умолчанию RuleCategory.EquipmentClearance) */
  category?: RuleCategoryValue;
  /** Уровень: Законодательство / Корпоративное / Проект / Заказчик / Временное */
  priority: RulePriorityValue;
  /** Страна применения (ISO 3166-1 alpha-2) или GLOBAL_JURISDICTION */
  country: RuleCountryCode;
  /** Источник требования (документ/политика + ссылка) */
  source: RuleSource;
  /** Допускает ли переопределение более специфичным правилом нижестоящего уровня */
  overridable: boolean;
  /** Обязательность правила (не путать с severity результата) */
  mandatory: boolean;
  /** Дата вступления правила в силу */
  effectiveFrom?: ISODateString;
  /** Дата окончания действия правила */
  effectiveTo?: ISODateString;
  /** Дополнительные параметры конкретной проверки (пороги, списки и т.д.) */
  config?: Record<string, unknown>;
  /** Логика проверки. На этапе инфраструктуры может быть демонстрационной заглушкой. */
  evaluate: (context: RuleContext) => Promise<RuleResult> | RuleResult;
  /** Автор регистрации/изменения правила */
  changedBy: string;
  /** Описание причины регистрации/изменения — формирует запись в журнале изменений */
  changeDescription: string;
}
