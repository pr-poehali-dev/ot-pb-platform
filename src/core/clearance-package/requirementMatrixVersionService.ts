import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { RequirementMatrixVersionSnapshot } from './types';

/**
 * Requirement Matrix Version Service — хранилище снимков точных версий
 * матриц требований (п.4 доработки): пакет должен хранить точную версию
 * матрицы, по которой была выполнена проверка, даже если матрица позже
 * изменится. Снимок делается ОДИН РАЗ на момент фиксации (например, когда
 * проверяющая сторона начинает проверку) и больше не меняется —
 * append-only хранилище, по архитектуре decisionLogService.
 */
let counter = 0;
const nextId = () => `matrix-snapshot-${++counter}`;

const store = createStore<RequirementMatrixVersionSnapshot[]>([]);

interface CaptureSnapshotInput {
  packageId: string;
  matrixId: string;
  matrixVersion: number;
  snapshot: RequirementMatrixVersionSnapshot['snapshot'];
}

function captureSnapshot(input: CaptureSnapshotInput): RequirementMatrixVersionSnapshot {
  const entry: RequirementMatrixVersionSnapshot = {
    id: nextId(),
    packageId: input.packageId,
    matrixId: input.matrixId,
    matrixVersion: input.matrixVersion,
    snapshot: input.snapshot,
    capturedAt: new Date().toISOString(),
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('clearance-package.matrix_version_captured', entry, 'requirement-matrix-version-service');
  return entry;
}

function listAll(): RequirementMatrixVersionSnapshot[] {
  return store.getState();
}

function listForPackage(packageId: string): RequirementMatrixVersionSnapshot[] {
  return store.getState().filter((s) => s.packageId === packageId);
}

function getSnapshot(id: string): RequirementMatrixVersionSnapshot | undefined {
  return store.getState().find((s) => s.id === id);
}

export const requirementMatrixVersionService = {
  store,
  captureSnapshot,
  listAll,
  listForPackage,
  getSnapshot,
};
