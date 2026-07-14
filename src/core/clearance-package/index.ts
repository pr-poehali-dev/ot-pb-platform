/**
 * Clearance Package Engine — центральная сущность модуля «Предварительный
 * допуск персонала».
 *
 * Пакет допуска — главный объект, вокруг которого строится весь процесс
 * допуска работника: к нему применяются матрицы требований (Requirement
 * Matrix Engine), из применённых матриц формируются требования (обязательные
 * и дополнительные), пакет проходит две полностью независимые параллельные
 * проверки (ОТ/ПБ и Служба безопасности), и платформа рассчитывает итоговый
 * статус после решений обеих сторон.
 *
 * Ядро (плоские файлы этой папки):
 *  - types.ts                              — единый контракт ClearancePackage/
 *                                            PackageRequirement/AppliedMatrixRef/
 *                                            PackageReview/PackageHistoryEntry/
 *                                            DecisionLogEntry/ReturnReason/
 *                                            ResubmissionEntry/RequirementMatrixVersionSnapshot,
 *                                            статусы (PackageStatus), ReviewSide
 *  - requirementCategoryRegistry.ts         — открытый реестр категорий требований
 *  - registerBuiltinRequirementCategories.ts — регистрация базовых категорий
 *  - clearancePackageService.ts             — реестр пакетов (create/update/query,
 *                                            модель «один активный пакет + архив»)
 *  - decisionLogService.ts                  — журнал оснований решений (Decision Log)
 *  - requirementMatrixVersionService.ts     — снимки точных версий матриц,
 *                                            по которым выполнялась проверка
 *  - returnReasonService.ts                 — накопительный журнал причин
 *                                            возврата пакета на доработку
 *  - resubmissionService.ts                 — повторная отправка ТОГО ЖЕ пакета
 *                                            после устранения замечаний
 *  - useClearancePackages.ts / useClearancePackage.ts — React-хуки
 *
 * Подсистемы (отдельные подпапки, по образцу core/business-rules/domain-rules/):
 *  - notification-queue/  — одновременные и повторные уведомления ОТ/ПБ и
 *                           Службе безопасности + журнал доставки
 *  - review-queue/         — очередь проверки: приоритет, SLA, просрочка,
 *                           срочные проверки
 *  - offline-sync/         — формирование пакета офлайн, очередь
 *                           синхронизации, контроль конфликтов версий
 *  - ai-extension-point/   — точка подключения Noventra AI ТОЛЬКО как
 *                           рекомендательного сервиса, без права решения
 *
 * Принципы:
 *  - Пакет НЕ хранит бизнес-логику проверки — только структуру данных,
 *    статусы жизненного цикла и версионированную историю.
 *  - Проверки ОТ/ПБ и Службы безопасности (otPbReview/securityReview) —
 *    независимые поля одинаковой структуры (PackageReview): каждая сторона
 *    меняет только своё поле и лишь читает состояние другого; расчёт
 *    итогового PackageStatus по обоим решениям — бизнес-логика, которая
 *    будет реализована отдельно и не входит в этот этап.
 *  - После отправки пакета (status !== 'draft') подрядчик не может изменять
 *    требования; редактирование возможно только в статусе 'needs_revision'
 *    и только для требований, явно указанных проверяющим
 *    (PackageReview.requestedRevisionRequirementIds) — сама проверка этого
 *    правила (enforcement) относится к будущей бизнес-логике.
 *  - Категории требований — открытый реестр: новая категория добавляется
 *    регистрацией, без изменения структуры ClearancePackage.
 *  - Noventra AI (ai-extension-point) не имеет доступа к изменению
 *    PackageStatus/ReviewDecisionStatus/Decision Log — только формирует
 *    рекомендацию, которую человек может учесть или отклонить.
 *  - На этом этапе реализована только архитектура: модели данных, хранение,
 *    версионирование, история и журналы. Проверка документов, автоматические
 *    расчёты, реальная доставка уведомлений, планировщик SLA, слияние офлайн-
 *    изменений и вызовы AI Engine НЕ реализованы.
 */
import { registerBuiltinRequirementCategories } from './registerBuiltinRequirementCategories';

export * from './types';
export { requirementCategoryRegistry } from './requirementCategoryRegistry';
export { registerBuiltinRequirementCategories } from './registerBuiltinRequirementCategories';
export { clearancePackageService } from './clearancePackageService';
export { decisionLogService } from './decisionLogService';
export { requirementMatrixVersionService } from './requirementMatrixVersionService';
export { returnReasonService } from './returnReasonService';
export { resubmissionService } from './resubmissionService';
export { useClearancePackages } from './useClearancePackages';
export { useClearancePackage } from './useClearancePackage';

export * from './notification-queue';
export * from './review-queue';
export * from './offline-sync';
export * from './ai-extension-point';

let initialized = false;

/** Единая точка инициализации Clearance Package Engine (регистрация базовых категорий требований). */
export function initClearancePackageEngine(): void {
  if (initialized) return;
  initialized = true;
  registerBuiltinRequirementCategories();
}