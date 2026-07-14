import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { RecordReturnReasonInput, ReturnReason } from './types';

/**
 * Return Reason Service — накопительное (append-only) хранилище причин
 * возврата пакета на доработку (п.5 доработки): причина, комментарий, кто
 * вернул, дата возврата, срок устранения. Отдельно от PackageReview (которая
 * хранит только ТЕКУЩЕЕ состояние проверки) — пакет может возвращаться на
 * доработку многократно, каждый случай фиксируется отдельной записью.
 */
let counter = 0;
const nextId = () => `return-reason-${++counter}`;

const store = createStore<ReturnReason[]>([]);

function recordReturnReason(input: RecordReturnReasonInput): ReturnReason {
  const entry: ReturnReason = {
    id: nextId(),
    packageId: input.packageId,
    returnedBySide: input.returnedBySide,
    returnedBy: input.returnedBy,
    reason: input.reason,
    comment: input.comment,
    relatedRequirementIds: input.relatedRequirementIds,
    returnedAt: new Date().toISOString(),
    dueDate: input.dueDate,
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('clearance-package.returned_for_revision', entry, 'return-reason-service');
  return entry;
}

function listAll(): ReturnReason[] {
  return store.getState();
}

function listForPackage(packageId: string): ReturnReason[] {
  return store.getState().filter((r) => r.packageId === packageId);
}

/** Последняя (самая свежая) причина возврата для пакета — актуальная на текущий момент. */
function getLatestForPackage(packageId: string): ReturnReason | undefined {
  return listForPackage(packageId)[0];
}

export const returnReasonService = {
  store,
  recordReturnReason,
  listAll,
  listForPackage,
  getLatestForPackage,
};
