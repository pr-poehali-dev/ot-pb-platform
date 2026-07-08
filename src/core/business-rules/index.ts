/**
 * Business Rules Engine — независимый движок бизнес-правил Noventra Core.
 *
 * Архитектурный принцип платформы: Noventra сначала решает задачи собственными
 * алгоритмами и бизнес-правилами. AI используется только как вспомогательный
 * инструмент, когда обычной логики недостаточно, а окончательное ответственное
 * решение в спорных или юридически значимых ситуациях принимает человек.
 * Этот движок работает полностью автономно — НЕ обращается к AI Engine
 * и не имеет от него зависимостей.
 *
 * Архитектура (по аналогии с AI Engine и остальными сервисами ядра):
 *  - types                — единый контракт BusinessRule/RuleContext/RuleResult
 *                          и перечисление категорий правил (RuleCategory)
 *  - ruleRegistry          — централизованное хранилище правил (открыт для
 *                          расширения новыми правилами без изменения движка)
 *  - ruleExecutor          — единый интерфейс выполнения правил: execute() /
 *                          executeMany() / executeCategory()
 *  - ruleAuditLog          — журнал выполнения правил, по архитектуре Audit Log /
 *                          AI Action Log; заполняется автоматически через мост
 *                          Event Bus (initRuleAuditLogBridge), без прямых записей
 *                          из ruleExecutor
 *  - businessRulesService  — единый фасад над всеми сервисами движка + точка
 *                          инициализации initBusinessRulesEngine()
 *  - useBusinessRules      — React-хук для будущих UI-модулей платформы
 *
 * Принципы:
 *  - Модули регистрируют свои правила через ruleRegistry.registerRule() и
 *    вызывают их только через ruleExecutor (или businessRulesService.executor) —
 *    движок не знает деталей конкретной проверки.
 *  - Результат правила (RuleResult) может пометить suggestedAIUse /
 *    humanDecisionRequired — это лишь метка для вызывающего модуля или будущего
 *    Decision Engine; сам Business Rules Engine AI не вызывает.
 *  - Все события (регистрация правила, выполнение, ошибка) идут только через
 *    Event Bus — по той же архитектуре, что и Audit Log / AI Action Log.
 *  - initBusinessRulesEngine() — единая точка инициализации (поднимает мост
 *    Event Bus → Rule Audit Log), вызывается один раз при старте приложения.
 *  - Движок спроектирован как готовая точка подключения для будущих
 *    Calculation Engine, Analytics Engine, Decision Engine и Dashboard —
 *    они смогут читать ruleRegistry / ruleAuditLog, не меняя архитектуру.
 */
export * from './types';
export { ruleRegistry } from './ruleRegistry';
export { ruleExecutor } from './ruleExecutor';
export { ruleAuditLog, initRuleAuditLogBridge } from './ruleAuditLog';
export { businessRulesService } from './businessRulesService';
export { useBusinessRules } from './useBusinessRules';
