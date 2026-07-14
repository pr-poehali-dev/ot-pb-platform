import { ISODateString } from '../../types';
import { ReviewSide } from '../types';

/**
 * Notification Queue — архитектура одновременных уведомлений отделу ОТ/ПБ и
 * Службе безопасности при отправке пакета на проверку (см. п.4–5 основного
 * ТЗ: «Noventra одновременно направляет пакет ответственному ОТ/ПБ и Службе
 * безопасности»). Очередь также обслуживает повторные уведомления
 * (напоминания, если сторона долго не реагирует) и хранит журнал всех
 * попыток доставки.
 *
 * Namespace выделен в отдельную подпапку внутри clearance-package/ (по
 * образцу core/business-rules/domain-rules/equipment-clearance/) — это
 * самостоятельная, но тесно связанная с пакетом подсистема.
 */

/** Кому адресовано уведомление. Шире ReviewSide — уведомление может уйти и подрядчику. */
export type NotificationRecipientRole = ReviewSide | 'contractor';

/** Статус одной задачи в очереди уведомлений. */
export type NotificationQueueStatus = 'queued' | 'sent' | 'failed' | 'acknowledged';

/**
 * Одна запись очереди — уведомление конкретному получателю по конкретному
 * пакету. При отправке пакета на проверку платформа создаёт ДВЕ независимые
 * записи одновременно (по одной на ОТ/ПБ и на Службу безопасности) —
 * см. enqueueParallelNotifications в notificationQueueService.
 */
export interface NotificationQueueEntry {
  id: string;
  packageId: string;
  recipientRole: NotificationRecipientRole;
  status: NotificationQueueStatus;
  /** Тип события-повода — открытый строковый тип (package_submitted/review_reminder/...). */
  reason: string;
  createdAt: ISODateString;
  /** Число уже выполненных попыток доставки (см. NotificationAttempt). */
  attemptCount: number;
  /** Когда получатель подтвердил ознакомление (если применимо). */
  acknowledgedAt?: ISODateString;
}

/** Запись журнала одной попытки доставки уведомления (для повторных уведомлений). */
export interface NotificationAttempt {
  id: string;
  notificationId: string;
  attemptedAt: ISODateString;
  success: boolean;
  /** Причина неуспеха попытки, если success = false. */
  failureReason?: string;
}

export interface EnqueueNotificationInput {
  packageId: string;
  recipientRole: NotificationRecipientRole;
  reason: string;
}
