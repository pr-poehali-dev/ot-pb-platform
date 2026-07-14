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
 * Состав:
 *  - types.ts                              — единый контракт ClearancePackage/
 *                                            PackageRequirement/AppliedMatrixRef/
 *                                            PackageReview/PackageHistoryEntry/
 *                                            DecisionLogEntry, статусы (PackageStatus)
 *  - requirementCategoryRegistry.ts         — открытый реестр категорий требований
 *                                            (документы/обучение/медосмотры/
 *                                            квалификация/СБ/СИЗ и будущие категории)
 *  - registerBuiltinRequirementCategories.ts — регистрация базовых категорий (п.3 ТЗ)
 *  - clearancePackageService.ts             — реестр пакетов: createPackage()
 *                                            (версия 1) / updatePackage()
 *                                            (версионированное изменение с историей)
 *                                            / queryPackages() (поиск и фильтрация)
 *                                            / getActivePackageForWorker() /
 *                                            listArchivedForWorker() /
 *                                            transitionWorkerToNewOrganization()
 *                                            (модель хранения — см. п.10 ТЗ)
 *  - decisionLogService.ts                  — отдельный журнал оснований решений
 *                                            (Decision Log, п.7 ТЗ)
 *  - useClearancePackages.ts                — React-хук для реестра (поиск/фильтр/создание)
 *  - useClearancePackage.ts                 — React-хук для карточки одного пакета
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
 *  - На этом этапе реализована только архитектура: модели данных, хранение,
 *    версионирование, история и журнал решений. Проверка документов,
 *    автоматические расчёты и пользовательские интерфейсы проверки НЕ
 *    реализованы.
 */
import { registerBuiltinRequirementCategories } from './registerBuiltinRequirementCategories';

export * from './types';
export { requirementCategoryRegistry } from './requirementCategoryRegistry';
export { registerBuiltinRequirementCategories } from './registerBuiltinRequirementCategories';
export { clearancePackageService } from './clearancePackageService';
export { decisionLogService } from './decisionLogService';
export { useClearancePackages } from './useClearancePackages';
export { useClearancePackage } from './useClearancePackage';

let initialized = false;

/** Единая точка инициализации Clearance Package Engine (регистрация базовых категорий требований). */
export function initClearancePackageEngine(): void {
  if (initialized) return;
  initialized = true;
  registerBuiltinRequirementCategories();
}
