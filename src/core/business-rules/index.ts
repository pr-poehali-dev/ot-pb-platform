/**
 * Business Rules Engine — независимый движок бизнес-правил Noventra Core.
 *
 * Архитектурный принцип платформы: Noventra сначала решает задачи собственными
 * алгоритмами и бизнес-правилами. AI используется только как вспомогательный
 * инструмент по инициативе пользователя или в случаях, прямо предусмотренных
 * архитектурой, а окончательное ответственное решение в спорных или юридически
 * значимых ситуациях принимает человек. Этот движок работает полностью
 * автономно — НЕ обращается к AI Engine и не имеет от него зависимостей.
 *
 * Архитектура:
 *  - types                       — единый контракт BusinessRule/RuleContext/
 *                                  RuleResult/RuleExecutionResult/RuleExplanation,
 *                                  перечисление категорий (RuleCategory) и
 *                                  пяти уровней приоритета (RulePriority)
 *  - ruleRegistry                 — централизованное хранилище правил: defineRule()
 *                                  (первичная регистрация, версия 1) / updateRule()
 *                                  (версионированное изменение с историей) /
 *                                  isApplicable() (страна, даты действия, статус)
 *  - rulePrecedenceResolver        — разрешение конфликтов между правилами одного
 *                                  ruleKey по пяти уровням приоритета: законодательство
 *                                  → корпоративные → проектные → заказчика → временные;
 *                                  законодательные требования с overridable: false
 *                                  никогда не исключаются нижестоящими уровнями
 *  - legislationChangeRegistry     — фиксация изменений законодательства: proposeChange()
 *                                  создаёт предложение, которое НЕ действует, пока
 *                                  ответственный специалист не вызовет confirmChange()
 *                                  (или отклонит через rejectChange())
 *  - ruleExecutor                  — единый интерфейс выполнения: execute() /
 *                                  executeMany() / executeCategory() / executeRuleKey()
 *                                  (с учётом rulePrecedenceResolver); каждый ответ —
 *                                  RuleExecutionResult с обязательным explanation
 *  - ruleAuditLog                  — журнал выполнения правил (кто, что, почему,
 *                                  какой источник/приоритет/версия), по архитектуре
 *                                  Audit Log / AI Action Log; заполняется автоматически
 *                                  через мост Event Bus (initRuleAuditLogBridge)
 *  - businessRulesService          — единый фасад над всеми сервисами движка + точка
 *                                  инициализации initBusinessRulesEngine()
 *  - useBusinessRules              — React-хук для будущих UI-модулей платформы
 *
 * Принципы:
 *  - Все правила конфигурируемые: в движке нет ни одного захардкоженного
 *    бизнес-правила. Организация параметризует поведение через `config`
 *    (данные) и данные RuleContext, не изменяя код платформы.
 *  - Каждое правило хранит версию, полную историю изменений (автор, дата,
 *    причина), дату вступления в силу и окончания действия, источник
 *    требования со ссылкой на нормативный документ, страну применения
 *    (или GLOBAL_JURISDICTION), возможность отключения (status: 'disabled')
 *    и возможность переопределения нижестоящими уровнями (overridable).
 *  - Любой результат объясним: RuleExecutionResult.explanation всегда содержит
 *    сработавшее правило, причину, источник, приоритет и версию.
 *  - Единый перечень статусов результата (RuleOutcome) для всей платформы:
 *    passed 🟢 Допущено / warning 🟡 Замечание / failed 🔴 Не допущено /
 *    pendingDecision 🔵 Ожидает решения. Статус pendingDecision (и/или
 *    RuleResult.humanDecisionRequired) сигнализирует, что окончательное
 *    решение обязан принять человек — движок никогда не принимает юридически
 *    значимое решение самостоятельно.
 *  - suggestedAIUse — лишь метка для вызывающего модуля; сам движок AI не вызывает
 *    и не имеет зависимостей от core/ai-engine.
 *  - Многострановая работа обеспечена полем country (ISO 3166-1 alpha-2) на
 *    уровне правила и RuleContext — без изменения архитектуры движка.
 *  - Законодательство не обновляется автоматически: только подтверждённое
 *    через legislationChangeRegistry.confirmChange() изменение попадает
 *    в ruleRegistry и начинает применяться.
 *  - Все события (регистрация/обновление правила, выполнение, ошибка,
 *    предложение/подтверждение/отклонение изменения законодательства) идут
 *    только через Event Bus — по той же архитектуре, что и Audit Log.
 *  - initBusinessRulesEngine() — единая точка инициализации, вызывается один
 *    раз при старте приложения.
 *  - Движок спроектирован как готовая точка подключения для будущих
 *    Calculation Engine, Analytics Engine, Decision Engine и Dashboard —
 *    они смогут читать ruleRegistry / ruleAuditLog / legislationChangeRegistry,
 *    не меняя архитектуру.
 */
export * from './types';
export { ruleRegistry } from './ruleRegistry';
export { rulePrecedenceResolver } from './rulePrecedenceResolver';
export { legislationChangeRegistry } from './legislationChangeRegistry';
export { ruleExecutor } from './ruleExecutor';
export { ruleAuditLog, initRuleAuditLogBridge } from './ruleAuditLog';
export { businessRulesService } from './businessRulesService';
export { useBusinessRules } from './useBusinessRules';