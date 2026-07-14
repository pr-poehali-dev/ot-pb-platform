import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { clearancePackageService } from './clearancePackageService';
import { ResubmissionEntry, ResubmitPackageInput } from './types';

/**
 * Resubmission Service — повторная отправка ТОГО ЖЕ пакета после устранения
 * замечаний (п.6 доработки): «повторная отправка того же пакета после
 * исправлений без создания нового». Хранит append-only журнал попыток
 * повторной отправки и делегирует смену статуса пакета/инкремент счётчика
 * clearancePackageService.updatePackage() — сам сервис не содержит логики
 * проверки готовности требований к повторной отправке (это будущая
 * бизнес-логика).
 */
let counter = 0;
const nextId = () => `resubmission-${++counter}`;

const store = createStore<ResubmissionEntry[]>([]);

function resubmitPackage(input: ResubmitPackageInput): ResubmissionEntry | undefined {
  const pkg = clearancePackageService.getPackage(input.packageId);
  if (!pkg) return undefined;

  const attemptNumber = pkg.resubmissionCount + 1;

  const entry: ResubmissionEntry = {
    id: nextId(),
    packageId: input.packageId,
    returnReasonId: input.returnReasonId,
    resubmittedBy: input.resubmittedBy,
    comment: input.comment,
    updatedRequirementIds: input.updatedRequirementIds,
    resubmittedAt: new Date().toISOString(),
    attemptNumber,
  };
  store.setState((prev) => [entry, ...prev]);

  clearancePackageService.updatePackage(input.packageId, {
    status: 'under_review',
    resubmissionCount: attemptNumber,
    changedBy: input.resubmittedBy,
    changeDescription: `Пакет повторно отправлен на проверку (попытка №${attemptNumber})`,
  });

  eventBus.emit('clearance-package.resubmitted', entry, 'resubmission-service');
  return entry;
}

function listAll(): ResubmissionEntry[] {
  return store.getState();
}

function listForPackage(packageId: string): ResubmissionEntry[] {
  return store.getState().filter((r) => r.packageId === packageId);
}

export const resubmissionService = {
  store,
  resubmitPackage,
  listAll,
  listForPackage,
};
