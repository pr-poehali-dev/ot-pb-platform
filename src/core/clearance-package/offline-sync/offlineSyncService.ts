import { createStore } from '../../shared/createStore';
import { eventBus } from '../../event-bus';
import { clearancePackageService } from '../clearancePackageService';
import { ConflictResolution, OfflineChangeEntry, QueueOfflineChangeInput, SyncConflict } from './types';

/**
 * Offline Sync Service — очередь изменений пакета, накопленных без
 * подключения к интернету, и контроль конфликтов после восстановления связи
 * (п.3 доработки). Только структура очереди/конфликтов: фактическое
 * применение payload к ClearancePackage и алгоритм автоматического слияния
 * — будущая бизнес-логика, не реализуется здесь.
 */
let changeCounter = 0;
const nextChangeId = () => `offline-change-${++changeCounter}`;

let conflictCounter = 0;
const nextConflictId = () => `sync-conflict-${++conflictCounter}`;

const changesStore = createStore<OfflineChangeEntry[]>([]);
const conflictsStore = createStore<SyncConflict[]>([]);

/** Постановка офлайн-изменения в очередь синхронизации (вызывается клиентом при работе без сети). */
function queueChange(input: QueueOfflineChangeInput): OfflineChangeEntry {
  const entry: OfflineChangeEntry = {
    id: nextChangeId(),
    packageId: input.packageId,
    baseVersion: input.baseVersion,
    changeDescription: input.changeDescription,
    payload: input.payload,
    createdBy: input.createdBy,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  changesStore.setState((prev) => [entry, ...prev]);
  eventBus.emit('clearance-package.offline_change_queued', entry, 'offline-sync-service');
  return entry;
}

/**
 * Попытка синхронизации одного офлайн-изменения после восстановления связи.
 * Сравнивает baseVersion изменения с текущей версией пакета на сервере:
 * если версии расходятся — фиксирует SyncConflict вместо применения
 * изменения; фактическое слияние/применение payload не реализуется.
 */
function attemptSync(changeId: string): OfflineChangeEntry | undefined {
  const change = changesStore.getState().find((c) => c.id === changeId);
  if (!change) return undefined;

  const pkg = clearancePackageService.getPackage(change.packageId);
  if (!pkg) {
    changesStore.setState((prev) => prev.map((c) => (c.id === changeId ? { ...c, status: 'failed' } : c)));
    return changesStore.getState().find((c) => c.id === changeId);
  }

  if (pkg.version !== change.baseVersion) {
    const conflict: SyncConflict = {
      id: nextConflictId(),
      changeId: change.id,
      packageId: change.packageId,
      serverVersion: pkg.version,
      detectedAt: new Date().toISOString(),
    };
    conflictsStore.setState((prev) => [conflict, ...prev]);
    changesStore.setState((prev) => prev.map((c) => (c.id === changeId ? { ...c, status: 'conflict' } : c)));
    eventBus.emit('clearance-package.sync_conflict_detected', conflict, 'offline-sync-service');
    return changesStore.getState().find((c) => c.id === changeId);
  }

  changesStore.setState((prev) => prev.map((c) => (c.id === changeId ? { ...c, status: 'synced' } : c)));
  eventBus.emit('clearance-package.offline_change_synced', change, 'offline-sync-service');
  return changesStore.getState().find((c) => c.id === changeId);
}

function resolveConflict(conflictId: string, resolution: ConflictResolution, resolvedBy: string): void {
  conflictsStore.setState((prev) =>
    prev.map((c) => (c.id === conflictId ? { ...c, resolution, resolvedBy, resolvedAt: new Date().toISOString() } : c))
  );
}

function listPendingChanges(): OfflineChangeEntry[] {
  return changesStore.getState().filter((c) => c.status === 'pending');
}

function listChangesForPackage(packageId: string): OfflineChangeEntry[] {
  return changesStore.getState().filter((c) => c.packageId === packageId);
}

function listConflicts(): SyncConflict[] {
  return conflictsStore.getState();
}

function listUnresolvedConflicts(): SyncConflict[] {
  return conflictsStore.getState().filter((c) => !c.resolution);
}

export const offlineSyncService = {
  changesStore,
  conflictsStore,
  queueChange,
  attemptSync,
  resolveConflict,
  listPendingChanges,
  listChangesForPackage,
  listConflicts,
  listUnresolvedConflicts,
};
