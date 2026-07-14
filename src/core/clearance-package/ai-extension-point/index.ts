/**
 * AI Extension Point — архитектурная точка подключения Noventra AI к Пакету
 * допуска ИСКЛЮЧИТЕЛЬНО как рекомендательного сервиса, без права принятия
 * решения (п.7 доработки).
 *
 * Состав:
 *  - types.ts                    — AIRecommendation/AIRecommendationStatus/
 *                                  AIRecommendationScope
 *  - aiRecommendationService.ts  — recordRecommendation()/markViewed()/
 *                                  markAccepted()/markDismissed() — управляют
 *                                  только жизненным циклом самой рекомендации
 *
 * Принцип (как в Business Rules Engine — RuleResult.suggestedAIUse /
 * humanDecisionRequired): AI Engine не имеет доступа к изменению
 * PackageStatus, ReviewDecisionStatus или Decision Log — рекомендация может
 * быть только прочитана и учтена человеком, который самостоятельно
 * совершает любое реальное действие через штатные сервисы пакета.
 */
export * from './types';
export { aiRecommendationService } from './aiRecommendationService';
