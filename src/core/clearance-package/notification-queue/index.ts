/**
 * Notification Queue — подсистема Clearance Package Engine, отвечающая за
 * структуру одновременных и повторных уведомлений отделу ОТ/ПБ и Службе
 * безопасности, а также журнал всех попыток доставки.
 *
 * Состав:
 *  - types.ts                     — NotificationQueueEntry/NotificationAttempt/
 *                                   NotificationRecipientRole/NotificationQueueStatus
 *  - notificationQueueService.ts   — enqueueParallelNotifications() (обе стороны
 *                                   одновременно), enqueueReminder() (повторные
 *                                   уведомления), recordAttempt()/listAttempts()
 *                                   (журнал уведомлений), acknowledge()
 *
 * Только структура очереди и журнала — фактическая доставка (email/push/SMS)
 * не реализуется.
 */
export * from './types';
export { notificationQueueService } from './notificationQueueService';
