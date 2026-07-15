/**
 * Universal Workflow State Machine — универсальный, domain-agnostic движок
 * жизненного цикла сущностей платформы Noventra Core, реализованный как
 * расширение Business Rules Engine (переиспользует те же архитектурные
 * принципы: открытые реестры, версионирование, декларативные условия), но
 * НЕ изменяет ни один существующий файл core/business-rules/*, core/
 * requirement-matrix/*, core/ai-engine/* или core/clearance-package/*.
 *
 * Ядро этого модуля ничего не знает о персонале, технике, подрядчиках,
 * документах или нарядах-допусках — каждый домен регистрирует собственный
 * WorkflowDefinition через workflowRegistry.registerWorkflow(), не меняя
 * типы и сервисы этого модуля (по тому же принципу, что и
 * matrixDomainRegistry/ruleRegistry).
 *
 * Состав:
 *  - types.ts                       — единый контракт WorkflowDefinition/
 *                                     WorkflowStateDefinition/
 *                                     WorkflowTransitionDefinition/
 *                                     WorkflowReviewLaneDefinition/
 *                                     WorkflowConflictResolutionPolicy/
 *                                     WorkflowEscalationRule/WorkflowActorRole/
 *                                     WorkflowCondition/WorkflowAction/
 *                                     WorkflowSlaPolicy/WorkflowStateCategory
 *  - workflowGraphAnalyzer.ts        — чистый структурный анализ графа
 *                                     состояний (недостижимость, dead-end,
 *                                     дубли переходов, запрещённые переходы
 *                                     по категориям, обход обязательных
 *                                     дорожек, обнаружение циклов)
 *  - workflowDefinitionValidator.ts   — полная проверка WorkflowDefinition
 *                                     перед регистрацией; при любой ошибке
 *                                     возвращает WorkflowValidationResult с
 *                                     полным списком проблем
 *  - workflowRegistry.ts             — реестр WorkflowDefinition по
 *                                     (domainId, version); registerWorkflow()
 *                                     ВСЕГДА выполняет валидацию перед записью
 *  - workflowTransitionGuard.ts       — структурная проверка попытки перехода
 *                                     (белый список + роль + обязательное
 *                                     обоснование), без исполнения перехода
 *                                     и без доступа к данным сущности
 *
 * Принципы:
 *  - Force Transition существует ТОЛЬКО как обычная запись
 *    WorkflowTransitionDefinition с isForceTransition=true и
 *    requiresJustification=true, явно перечисленная в белом списке домена —
 *    универсального правила «любое состояние → любое состояние» в движке
 *    нет и не может быть зарегистрировано.
 *  - Пять пар категорий состояний глобально запрещены для ЛЮБОГО домена
 *    (см. workflowGraphAnalyzer.findForbiddenCategoryTransitions):
 *    Draft→Approved, Draft→Rejected, Blocked→Approved, Rejected→Approved,
 *    Archived→любая не-Archived категория.
 *  - Положительный итог (переход в состояние категории Approved) при
 *    наличии хотя бы одной обязательной дорожки обязан быть защищён
 *    условием AllMandatoryLanesOutcome(approved) — иначе регистрация
 *    отклоняется как lane_bypass.
 *  - Ни одна роль не может представлять ИИ: workflowDefinitionValidator
 *    структурно отклоняет роли с AI-подобными токенами id
 *    (ai/ии/assistant/bot/copilot/llm) — AI Extension Point (см.
 *    core/clearance-package/ai-extension-point) остаётся исключительно
 *    рекомендательным и не подключается как участник workflow.
 *  - Условие custom_rule лишь ХРАНИТ ссылку (ruleKey) на существующий
 *    Business Rules Engine — Workflow Engine не создаёт второй движок
 *    исполнения условий и не содержит зависимости от ruleExecutor
 *    (фактический вызов — задача будущей реализации перехода).
 *  - SLA полностью конфигурируется на уровне каждой WorkflowReviewLaneDefinition
 *    (WorkflowSlaPolicy) — движок не содержит ни одного зашитого значения
 *    длительности, расписания или числа напоминаний.
 *  - На этом этапе реализованы только типы, реестр, валидатор и
 *    структурный guard переходов. Исполнение переходов, генерация очередей
 *    (Notification Queue/Review Queue), обработчики событий и прикладные
 *    правила конкретного домена (personnel-clearance и т.д.) НЕ реализованы
 *    и не входят в этот этап.
 */
export * from './types';
export { workflowGraphAnalyzer } from './workflowGraphAnalyzer';
export { workflowDefinitionValidator, WORKFLOW_VALIDATION_CODES } from './workflowDefinitionValidator';
export { workflowRegistry } from './workflowRegistry';
export { workflowTransitionGuard } from './workflowTransitionGuard';
