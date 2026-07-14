import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import {
  ClearancePackage,
  ClearancePackageQueryFilter,
  CreateClearancePackageInput,
  PackageHistoryEntry,
  UpdateClearancePackageInput,
} from './types';

/**
 * Clearance Package Service — центральный реестр Пакетов допуска.
 * Архитектура повторяет matrixService (Requirement Matrix Engine):
 * версионированное хранение в памяти через createStore, каждое изменение
 * обязано указывать автора и описание, которые фиксируются в неизменяемой
 * истории изменений пакета (п.6 ТЗ).
 *
 * Модель хранения (п.10 ТЗ): один работник — одна текущая организация —
 * один активный пакет; предыдущие пакеты остаются в реестре со статусом
 * 'archived' (архив). getActivePackageForWorker()/listArchivedForWorker()
 * реализуют выборку по этой модели без какой-либо бизнес-логики проверки.
 *
 * Бизнес-логика проверки документов, расчёт итогового статуса по решениям
 * ОТ/ПБ и Службы безопасности, автоматические переходы статусов — НЕ
 * реализованы. Здесь только версионированное хранение и структура.
 */
let counter = 0;
const nextId = () => `clearance-package-${++counter}`;

let packageNumberCounter = 0;
const nextPackageNumber = () => {
  packageNumberCounter += 1;
  const year = new Date().getFullYear();
  return `CP-${year}-${String(packageNumberCounter).padStart(6, '0')}`;
};

let historyCounter = 0;
const nextHistoryId = () => `pkg-history-${++historyCounter}`;

const store = createStore<Record<string, ClearancePackage>>({});

function makeHistoryEntry(action: string, description: string, actor: string): PackageHistoryEntry {
  return {
    id: nextHistoryId(),
    action,
    description,
    actor,
    timestamp: new Date().toISOString(),
  };
}

function createPackage(input: CreateClearancePackageInput): ClearancePackage {
  const now = new Date().toISOString();
  const pkg: ClearancePackage = {
    id: nextId(),
    packageNumber: nextPackageNumber(),
    workerId: input.workerId,
    workerName: input.workerName,
    scope: input.scope,
    status: 'draft',
    createdAt: now,
    createdBy: input.createdBy,
    updatedAt: now,
    version: 1,
    appliedMatrices: [],
    requirements: [],
    otPbReview: { status: 'pending' },
    securityReview: { status: 'pending' },
    history: [makeHistoryEntry('create', 'Пакет допуска создан', input.createdBy)],
    resubmissionCount: 0,
  };

  store.setState((prev) => ({ ...prev, [pkg.id]: pkg }));
  eventBus.emit('clearance-package.created', { packageId: pkg.id, workerId: pkg.workerId }, 'clearance-package-service');
  return pkg;
}

/** Версионированное обновление пакета — новая версия и запись в истории изменений. */
function updatePackage(packageId: string, input: UpdateClearancePackageInput): ClearancePackage | undefined {
  const existing = store.getState()[packageId];
  if (!existing) return undefined;

  const { changedBy, changeDescription, ...patch } = input;
  const now = new Date().toISOString();

  const updated: ClearancePackage = {
    ...existing,
    ...patch,
    version: existing.version + 1,
    updatedAt: now,
    history: [...existing.history, makeHistoryEntry('update', changeDescription, changedBy)],
  };

  store.setState((prev) => ({ ...prev, [packageId]: updated }));
  eventBus.emit('clearance-package.updated', { packageId, version: updated.version, changedBy }, 'clearance-package-service');
  return updated;
}

function getPackage(packageId: string): ClearancePackage | undefined {
  return store.getState()[packageId];
}

function listAll(): ClearancePackage[] {
  return Object.values(store.getState());
}

/** Поиск и фильтрация пакетов реестра (вкладка «Пакеты допуска»). */
function queryPackages(filter: ClearancePackageQueryFilter = {}): ClearancePackage[] {
  const { search, workerId, organizationId, projectId, objectId, status } = filter;
  return listAll().filter((pkg) => {
    if (workerId && pkg.workerId !== workerId) return false;
    if (organizationId && pkg.scope.organizationId !== organizationId) return false;
    if (projectId && pkg.scope.projectId !== projectId) return false;
    if (objectId && pkg.scope.objectId !== objectId) return false;
    if (status && pkg.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      const matches = pkg.packageNumber.toLowerCase().includes(q) || (pkg.workerName ?? '').toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

/**
 * Активный пакет работника в его текущей организации (п.10 ТЗ: «один
 * активный Пакет допуска»). Архивные пакеты (status = 'archived') в выборку
 * не попадают.
 */
function getActivePackageForWorker(workerId: string, organizationId: string): ClearancePackage | undefined {
  return listAll().find(
    (pkg) => pkg.workerId === workerId && pkg.scope.organizationId === organizationId && pkg.status !== 'archived'
  );
}

/** Архив предыдущих пакетов работника (п.10 ТЗ). */
function listArchivedForWorker(workerId: string): ClearancePackage[] {
  return listAll().filter((pkg) => pkg.workerId === workerId && pkg.status === 'archived');
}

/**
 * Переход работника в другую организацию (п.10 ТЗ): предыдущий активный
 * пакет архивируется, создаётся новый пакет для новой организации — без
 * бизнес-логики проверки, только оркестрация хранения.
 */
function transitionWorkerToNewOrganization(
  workerId: string,
  workerName: string | undefined,
  newScope: CreateClearancePackageInput['scope'],
  actor: string
): ClearancePackage {
  const previous = listAll().find(
    (pkg) => pkg.workerId === workerId && pkg.scope.organizationId !== newScope.organizationId && pkg.status !== 'archived'
  );

  if (previous) {
    updatePackage(previous.id, {
      status: 'archived',
      changedBy: actor,
      changeDescription: 'Пакет архивирован в связи с переходом работника в другую организацию',
    });
  }

  const created = createPackage({
    workerId,
    workerName,
    scope: newScope,
    createdBy: actor,
  });

  if (previous) {
    updatePackage(created.id, {
      previousPackageId: previous.id,
      changedBy: actor,
      changeDescription: `Пакет создан взамен предыдущего (${previous.packageNumber}) при переходе в новую организацию`,
    });
  }

  return store.getState()[created.id];
}

export const clearancePackageService = {
  store,
  createPackage,
  updatePackage,
  getPackage,
  listAll,
  queryPackages,
  getActivePackageForWorker,
  listArchivedForWorker,
  transitionWorkerToNewOrganization,
};