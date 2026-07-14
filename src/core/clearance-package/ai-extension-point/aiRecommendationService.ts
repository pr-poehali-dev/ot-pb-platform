import { createStore } from '../../shared/createStore';
import { eventBus } from '../../event-bus';
import { AIRecommendation, RequestAIRecommendationInput } from './types';

/**
 * AI Recommendation Service — хранилище рекомендаций Noventra AI по Пакету
 * допуска (AI Extension Point, п.7 доработки).
 *
 * АРХИТЕКТУРНОЕ ОГРАНИЧЕНИЕ: этот сервис не имеет ни одного метода, который
 * менял бы PackageStatus, ReviewDecisionStatus или создавал DecisionLogEntry.
 * Он может только породить и хранить AIRecommendation — решение по ней
 * принимает исключительно человек через обычные методы clearancePackageService
 * / decisionLogService, вне этого сервиса.
 *
 * requestRecommendation() на этом этапе НЕ обращается к core/ai-engine —
 * фактический вызов AI Engine (aiRouter.converse / aiEngineService.send) и
 * генерация текста рекомендации являются бизнес-логикой и подключаются
 * отдельно; здесь только структура хранения и жизненного цикла рекомендации.
 */
let counter = 0;
const nextId = () => `ai-recommendation-${++counter}`;

const store = createStore<AIRecommendation[]>([]);

/**
 * Регистрирует новую рекомендацию (обычно — результат вызова AI Engine,
 * выполненного вызывающим кодом). Сам этот метод не запрашивает AI Engine —
 * он лишь фиксирует уже полученный текст рекомендации в структуре пакета.
 */
function recordRecommendation(
  input: RequestAIRecommendationInput & { recommendationText: string; confidence?: number }
): AIRecommendation {
  const recommendation: AIRecommendation = {
    id: nextId(),
    packageId: input.packageId,
    scope: input.scope,
    status: 'generated',
    recommendationText: input.recommendationText,
    confidence: input.confidence,
    relatedRequirementIds: input.relatedRequirementIds,
    generatedAt: new Date().toISOString(),
  };
  store.setState((prev) => [recommendation, ...prev]);
  eventBus.emit('clearance-package.ai_recommendation_generated', recommendation, 'ai-recommendation-service');
  return recommendation;
}

function markViewed(recommendationId: string, reviewedBy: string): void {
  store.setState((prev) =>
    prev.map((r) => (r.id === recommendationId ? { ...r, status: 'viewed', reviewedBy, reviewedAt: new Date().toISOString() } : r))
  );
}

/** Человек принял рекомендацию к сведению — НЕ меняет статус пакета/проверки, только статус самой рекомендации. */
function markAccepted(recommendationId: string, reviewedBy: string): void {
  store.setState((prev) =>
    prev.map((r) => (r.id === recommendationId ? { ...r, status: 'accepted', reviewedBy, reviewedAt: new Date().toISOString() } : r))
  );
}

function markDismissed(recommendationId: string, reviewedBy: string): void {
  store.setState((prev) =>
    prev.map((r) => (r.id === recommendationId ? { ...r, status: 'dismissed', reviewedBy, reviewedAt: new Date().toISOString() } : r))
  );
}

function listAll(): AIRecommendation[] {
  return store.getState();
}

function listForPackage(packageId: string): AIRecommendation[] {
  return store.getState().filter((r) => r.packageId === packageId);
}

export const aiRecommendationService = {
  store,
  recordRecommendation,
  markViewed,
  markAccepted,
  markDismissed,
  listAll,
  listForPackage,
};
