import { ISODateString } from '../../types';

/**
 * AI Extension Point — архитектурная точка подключения Noventra AI Engine к
 * Пакету допуска ИСКЛЮЧИТЕЛЬНО как рекомендательного сервиса (п.7
 * доработки): «предусмотреть точку подключения Noventra AI только как
 * рекомендательного сервиса без права принятия решения».
 *
 * Это тот же архитектурный принцип, что уже используется в Business Rules
 * Engine (RuleResult.suggestedAIUse/humanDecisionRequired, см.
 * core/business-rules/types.ts): AI Engine НИКОГДА не меняет статус пакета,
 * не выносит решение проверки и не заменяет ОТ/ПБ или Службу безопасности —
 * он только формирует рекомендацию, которую человек (проверяющий) может
 * учесть или полностью проигнорировать. AIRecommendation не является полем
 * PackageReview и не может быть источником DecisionLogEntry — только сам
 * человек своим решением создаёт запись в Decision Log.
 */

/** Статус жизненного цикла рекомендации — не статус решения по пакету. */
export type AIRecommendationStatus = 'generated' | 'viewed' | 'accepted' | 'dismissed';

/**
 * Область пакета, к которой относится рекомендация — открытый строковый тип
 * (например, 'requirements_review', 'document_check', 'return_reason_draft'),
 * чтобы AI Extension Point не ограничивал будущие сценарии применения.
 */
export type AIRecommendationScope = string;

/**
 * Одна рекомендация AI по пакету. confidence и recommendationText — данные
 * от AI Engine (см. core/ai-engine), но сама запись хранится в контексте
 * Clearance Package Engine, чтобы рекомендации были прослеживаемы вместе с
 * историей и журналом решений пакета, не становясь при этом их частью.
 */
export interface AIRecommendation {
  id: string;
  packageId: string;
  scope: AIRecommendationScope;
  status: AIRecommendationStatus;
  recommendationText: string;
  /** Условная уверенность рекомендации (0..1), если AI Engine её предоставляет. */
  confidence?: number;
  relatedRequirementIds?: string[];
  generatedAt: ISODateString;
  /** Кто ознакомился/принял решение по рекомендации — человек, не AI. */
  reviewedBy?: string;
  reviewedAt?: ISODateString;
}

export interface RequestAIRecommendationInput {
  packageId: string;
  scope: AIRecommendationScope;
  relatedRequirementIds?: string[];
}
