import { createStore } from '../../shared/createStore';
import { eventBus } from '../../event-bus';
import {
  EnqueueNotificationInput,
  NotificationAttempt,
  NotificationQueueEntry,
} from './types';

/**
 * Notification Queue Service — очередь одновременных и повторных уведомлений
 * по Пакету допуска (п.1 доработки). Архитектура повторяет остальные
 * append-only сервисы движка (decisionLogService/returnReasonService):
 * записи в очереди не удаляются, а переводятся по статусам
 * (queued → sent/failed → acknowledged).
 *
 * Фактическая доставка (email/push/SMS-интеграция) — бизнес-логика, которая
 * не реализуется на этом этапе; здесь только структура очереди и журнал.
 */
let counter = 0;
const nextId = () => `notification-${++counter}`;

let attemptCounter = 0;
const nextAttemptId = () => `notification-attempt-${++attemptCounter}`;

const store = createStore<NotificationQueueEntry[]>([]);
const attemptsStore = createStore<NotificationAttempt[]>([]);

function enqueue(input: EnqueueNotificationInput): NotificationQueueEntry {
  const entry: NotificationQueueEntry = {
    id: nextId(),
    packageId: input.packageId,
    recipientRole: input.recipientRole,
    status: 'queued',
    reason: input.reason,
    createdAt: new Date().toISOString(),
    attemptCount: 0,
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('clearance-package.notification_enqueued', entry, 'notification-queue-service');
  return entry;
}

/**
 * Одновременная постановка в очередь уведомлений сразу обеим сторонам
 * (ОТ/ПБ и Служба безопасности) — единственная точка, реализующая принцип
 * «Noventra одновременно направляет пакет обеим сторонам, ни одна не ждёт
 * решения другой» на уровне доставки уведомлений.
 */
function enqueueParallelNotifications(packageId: string, reason: string): NotificationQueueEntry[] {
  return [
    enqueue({ packageId, recipientRole: 'ot_pb', reason }),
    enqueue({ packageId, recipientRole: 'security', reason }),
  ];
}

/** Постановка повторного уведомления (например, напоминание о просроченной проверке). */
function enqueueReminder(packageId: string, recipientRole: NotificationQueueEntry['recipientRole']): NotificationQueueEntry {
  return enqueue({ packageId, recipientRole, reason: 'review_reminder' });
}

/** Запись попытки доставки в журнал уведомлений (п.1 доработки: «журнал уведомлений»). */
function recordAttempt(notificationId: string, success: boolean, failureReason?: string): NotificationAttempt {
  const attempt: NotificationAttempt = {
    id: nextAttemptId(),
    notificationId,
    attemptedAt: new Date().toISOString(),
    success,
    failureReason,
  };
  attemptsStore.setState((prev) => [attempt, ...prev]);

  store.setState((prev) =>
    prev.map((n) =>
      n.id === notificationId ? { ...n, status: success ? 'sent' : 'failed', attemptCount: n.attemptCount + 1 } : n
    )
  );

  eventBus.emit('clearance-package.notification_attempted', attempt, 'notification-queue-service');
  return attempt;
}

function acknowledge(notificationId: string): void {
  store.setState((prev) =>
    prev.map((n) => (n.id === notificationId ? { ...n, status: 'acknowledged', acknowledgedAt: new Date().toISOString() } : n))
  );
}

function listAll(): NotificationQueueEntry[] {
  return store.getState();
}

function listForPackage(packageId: string): NotificationQueueEntry[] {
  return store.getState().filter((n) => n.packageId === packageId);
}

function listAttempts(notificationId: string): NotificationAttempt[] {
  return attemptsStore.getState().filter((a) => a.notificationId === notificationId);
}

export const notificationQueueService = {
  store,
  attemptsStore,
  enqueue,
  enqueueParallelNotifications,
  enqueueReminder,
  recordAttempt,
  acknowledge,
  listAll,
  listForPackage,
  listAttempts,
};
