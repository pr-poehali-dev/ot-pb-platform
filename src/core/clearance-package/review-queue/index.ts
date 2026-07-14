/**
 * Review Queue — подсистема Clearance Package Engine: очередь проверки
 * пакетов с приоритетом, SLA, признаком просрочки и срочных проверок.
 *
 * Состав:
 *  - types.ts               — ReviewQueueEntry/ReviewQueuePriority/ReviewQueueStatus
 *  - reviewQueueService.ts  — enqueueParallelReviews() (постановка сразу для
 *                             обеих сторон), markInProgress()/markCompleted()/
 *                             markOverdue(), setPriority(), isOverdue(),
 *                             listUrgent()
 *
 * Только структура очереди — расчёт SLA по времени, автоматическая пометка
 * просрочки по таймеру и распределение нагрузки между проверяющими являются
 * будущей бизнес-логикой/планировщиком и здесь не реализуются.
 */
export * from './types';
export { reviewQueueService } from './reviewQueueService';
