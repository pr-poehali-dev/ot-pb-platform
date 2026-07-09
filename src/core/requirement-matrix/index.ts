/**
 * Requirement Matrix Engine — универсальный движок матриц требований
 * Noventra Core.
 *
 * Это НЕ инструмент, специфичный для допуска персонала. Один и тот же
 * механизм в будущем используется для допуска техники, подрядчиков,
 * документов, нарядов-допусков и других модулей — они лишь регистрируют
 * свой домен применения (matrixDomainRegistry) и нужные измерения критериев
 * (matrixCriteriaDimensionRegistry), не меняя архитектуру движка.
 *
 * Состав:
 *  - types.ts                          — единый контракт RequirementMatrix/
 *                                        MatrixCriteriaSelection/
 *                                        MatrixDocumentRequirement/MatrixScope,
 *                                        приоритеты (MatrixPriorityLevel),
 *                                        статусы (MatrixStatus)
 *  - matrixDomainRegistry.ts            — реестр доменов применения матриц
 *                                        (personnel-clearance, будущие:
 *                                        equipment-clearance, contractor-clearance
 *                                        и т.д.)
 *  - matrixCriteriaDimensionRegistry.ts  — реестр измерений критериев (каждое
 *                                        измерение ссылается на список
 *                                        Reference Data Engine и подписывает
 *                                        одну вкладку карточки матрицы)
 *  - matrixService.ts                   — реестр самих матриц: createMatrix()
 *                                        (версия 1) / updateMatrix()
 *                                        (версионированное изменение с историей)
 *                                        / duplicateMatrix() / archiveMatrix()
 *                                        / restoreMatrix() / queryMatrices()
 *                                        (поиск и фильтрация)
 *  - useRequirementMatrices.ts           — React-хук для реестра (поиск/фильтр/
 *                                        создание/копирование/архивирование)
 *  - useRequirementMatrix.ts             — React-хук для карточки одной матрицы
 *
 * Принципы:
 *  - Справочные данные (профессии, должности, гражданства, объекты,
 *    подрядчики и т.д.) движок не хранит сам — только ссылается на списки
 *    Reference Data Engine (core/reference-data) по ReferenceListId.
 *  - Каждая матрица версионируется, хранит полную историю изменений (автор,
 *    дата, причина), может быть скопирована, архивирована и восстановлена —
 *    без физического удаления.
 *  - Домены применения и измерения критериев — открытые реестры: новый домен
 *    или новое измерение добавляются регистрацией, без изменения кода движка.
 *  - На этом этапе реализована только архитектура: бизнес-логика проверки
 *    (сопоставление матрицы с конкретным работником/техникой/подрядчиком),
 *    автоматические расчёты, загрузка документов и согласование не реализованы.
 */
export * from './types';
export { matrixDomainRegistry } from './matrixDomainRegistry';
export { matrixCriteriaDimensionRegistry } from './matrixCriteriaDimensionRegistry';
export { matrixService } from './matrixService';
export { useRequirementMatrices } from './useRequirementMatrices';
export { useRequirementMatrix } from './useRequirementMatrix';
