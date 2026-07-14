import { createStore } from '../../shared/createStore';
import { eventBus } from '../../event-bus';
import { ReviewSide } from '../types';
import { EnqueueReviewInput, ReviewQueueEntry } from './types';

/**
 * Review Queue Service — очередь проверки Пакетов допуска с приоритетом и
 * SLA (п.2 доработки). Хранение и выборка по статусам/просрочке — только
 * структура, без автоматических таймеров и расчёта приоритетов (это будущая
 * бизнес-логика/планировщик).
 */
let counter = 0;
const nextId = () => `review-queue-${++counter}`;

const store = createStore<ReviewQueueEntry[]>([]);

function enqueue(input: EnqueueReviewInput): ReviewQueueEntry {
  const entry: ReviewQueueEntry = {
    id: nextId(),
    packageId: input.packageId,
    side: input.side,
    priority: input.priority,
    status: 'queued',
    enqueuedAt: new Date().toISOString(),
    dueAt: input.dueAt,
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('clearance-package.review_enqueued', entry, 'review-queue-service');
  return entry;
}

/** Постановка в очередь ОБЕИХ сторон одновременно (по образцу notificationQueueService.enqueueParallelNotifications). */
function enqueueParallelReviews(packageId: string, dueAt: string, priority: ReviewQueueEntry['priority'] = 'normal'): ReviewQueueEntry[] {
  return [
    enqueue({ packageId, side: 'ot_pb', dueAt, priority }),
    enqueue({ packageId, side: 'security', dueAt, priority }),
  ];
}

function markInProgress(entryId: string): void {
  store.setState((prev) => prev.map((e) => (e.id === entryId ? { ...e, status: 'in_progress' } : e)));
}

function markCompleted(entryId: string): void {
  store.setState((prev) =>
    prev.map((e) => (e.id === entryId ? { ...e, status: 'completed', completedAt: new Date().toISOString() } : e))
  );
}

function markOverdue(entryId: string): void {
  store.setState((prev) => prev.map((e) => (e.id === entryId ? { ...e, status: 'overdue' } : e)));
}

function setPriority(entryId: string, priority: ReviewQueueEntry['priority']): void {
  store.setState((prev) => prev.map((e) => (e.id === entryId ? { ...e, priority } : e)));
}

/** Проверка просрочки элемента очереди относительно текущего момента (только сравнение дат, без побочных эффектов). */
function isOverdue(entry: ReviewQueueEntry, now: Date = new Date()): boolean {
  return entry.status !== 'completed' && new Date(entry.dueAt).getTime() < now.getTime();
}

function listAll(): ReviewQueueEntry[] {
  return store.getState();
}

function listForPackage(packageId: string): ReviewQueueEntry[] {
  return store.getState().filter((e) => e.packageId === packageId);
}

function listForSide(side: ReviewSide): ReviewQueueEntry[] {
  return store.getState().filter((e) => e.side === side);
}

function listUrgent(): ReviewQueueEntry[] {
  return store.getState().filter((e) => e.priority === 'urgent' && e.status !== 'completed');
}

export const reviewQueueService = {
  store,
  enqueue,
  enqueueParallelReviews,
  markInProgress,
  markCompleted,
  markOverdue,
  setPriority,
  isOverdue,
  listAll,
  listForPackage,
  listForSide,
  listUrgent,
};
