import { ruleRegistry } from './ruleRegistry';
import { ruleExecutor } from './ruleExecutor';
import { ruleAuditLog, initRuleAuditLogBridge } from './ruleAuditLog';
import { rulePrecedenceResolver } from './rulePrecedenceResolver';
import { legislationChangeRegistry } from './legislationChangeRegistry';

/**
 * Business Rules Engine — единый сервис для вызова бизнес-правил из любого
 * будущего модуля платформы. По аналогии с aiCore (AI Engine): объединяет
 * Rule Registry, Rule Executor, Rule Audit Log, Rule Precedence Resolver и
 * Legislation Change Registry в один фасад, оставляя возможность
 * импортировать сервисы по отдельности.
 *
 * initBusinessRulesEngine() — единая точка инициализации (поднимает мост
 * Event Bus → Rule Audit Log), вызывается один раз при старте приложения,
 * по образцу initAICore() / initAuditEventBridge() в App.tsx.
 *
 * Business Rules Engine работает полностью автономно, без AI Engine —
 * это независимое ядро платформы, готовое для подключения будущих
 * Calculation Engine, Analytics Engine, Decision Engine и Dashboard,
 * которые смогут читать зарегистрированные правила и их результаты,
 * не меняя архитектуру этого движка.
 */
let initialized = false;

function initBusinessRulesEngine(): void {
  if (initialized) return;
  initialized = true;

  initRuleAuditLogBridge();
}

export const businessRulesService = {
  initBusinessRulesEngine,
  registry: ruleRegistry,
  executor: ruleExecutor,
  auditLog: ruleAuditLog,
  precedence: rulePrecedenceResolver,
  legislation: legislationChangeRegistry,
};
