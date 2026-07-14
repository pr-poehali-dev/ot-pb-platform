import { ISODateString } from '../../types';
import { ReviewSide } from '../types';

/**
 * Review Queue — архитектура очереди проверки Пакетов допуска (п.2
 * доработки): приоритет, SLA (срок, за который проверка должна быть
 * выполнена), просрочка, срочные проверки. Отдельная от самого пакета
 * структура — один пакет требует ДВУХ независимых элементов очереди (по
 * одному на каждую проверяющую сторону), так как проверки идут параллельно
 * и у каждой стороны собственная нагрузка/SLA.
 */

/** Приоритет элемента очереди проверки. 'urgent' — срочная проверка (п.2 доработки). */
export type ReviewQueuePriority = 'normal' | 'high' | 'urgent';

/** Статус элемента очереди — независим от ReviewDecisionStatus самой проверки. */
export type ReviewQueueStatus = 'queued' | 'in_progress' | 'completed' | 'overdue';

/**
 * Один элемент очереди проверки — задача для конкретной проверяющей стороны
 * по конкретному пакету. dueAt — расчётный срок SLA; просрочка (status =
 * 'overdue') определяется сравнением текущего времени с dueAt (сам расчёт —
 * бизнес-логика, не реализуется здесь).
 */
export interface ReviewQueueEntry {
  id: string;
  packageId: string;
  side: ReviewSide;
  priority: ReviewQueuePriority;
  status: ReviewQueueStatus;
  enqueuedAt: ISODateString;
  /** Срок SLA — момент, до которого проверка должна быть завершена. */
  dueAt: ISODateString;
  completedAt?: ISODateString;
}

export interface EnqueueReviewInput {
  packageId: string;
  side: ReviewSide;
  priority: ReviewQueuePriority;
  dueAt: ISODateString;
}
