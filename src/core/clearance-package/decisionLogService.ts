import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { DecisionLogEntry, RecordDecisionInput } from './types';

/**
 * Decision Log — отдельная от Пакета допуска структура хранения оснований
 * ВСЕХ решений пользователей (п.7 ТЗ): отправка на проверку, одобрение,
 * отклонение, возврат на доработку и т.д. Хранится отдельно от
 * PackageHistoryEntry (которая фиксирует факт изменения), так как решение
 * всегда обязано иметь зафиксированное обоснование (justification) и роль
 * автора — это разные срезы одних и тех же событий: «что изменилось»
 * (история) и «на каком основании» (журнал решений).
 *
 * Архитектура повторяет auditLogService (Audit Log ядра): неизменяемый
 * append-only журнал в памяти, доступный по packageId.
 */
let counter = 0;
const nextId = () => `decision-${++counter}`;

const store = createStore<DecisionLogEntry[]>([]);

function record(input: RecordDecisionInput): DecisionLogEntry {
  const entry: DecisionLogEntry = {
    id: nextId(),
    packageId: input.packageId,
    actor: input.actor,
    role: input.role,
    decisionType: input.decisionType,
    justification: input.justification,
    relatedRequirementIds: input.relatedRequirementIds,
    timestamp: new Date().toISOString(),
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('clearance-package.decision_recorded', entry, 'decision-log-service');
  return entry;
}

function listAll(): DecisionLogEntry[] {
  return store.getState();
}

function listForPackage(packageId: string): DecisionLogEntry[] {
  return store.getState().filter((entry) => entry.packageId === packageId);
}

export const decisionLogService = {
  store,
  record,
  listAll,
  listForPackage,
};
