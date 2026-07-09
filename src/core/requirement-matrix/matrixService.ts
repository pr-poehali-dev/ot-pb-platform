import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import {
  CreateMatrixInput,
  MatrixQueryFilter,
  RequirementMatrix,
  UpdateMatrixInput,
} from './types';

/**
 * Matrix Service — центральный реестр матриц требований.
 * Архитектура повторяет ruleRegistry (Business Rules Engine): версионированное
 * хранение в памяти через createStore, каждое изменение обязано указывать
 * автора и причину (changedBy/changeDescription), которые фиксируются
 * в неизменяемой истории изменений матрицы.
 */
let counter = 0;
const nextId = () => `matrix-${++counter}`;

const store = createStore<Record<string, RequirementMatrix>>({});

function createMatrix(input: CreateMatrixInput): RequirementMatrix {
  const now = new Date().toISOString();
  const matrix: RequirementMatrix = {
    id: nextId(),
    name: input.name,
    description: input.description,
    domain: input.domain,
    status: 'draft',
    priority: input.priority,
    mandatory: input.mandatory,
    scope: input.scope,
    requiredDocuments: [],
    optionalDocuments: [],
    criteria: [],
    version: 1,
    history: [
      {
        version: 1,
        changedBy: input.changedBy,
        changedAt: now,
        changeDescription: input.changeDescription,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  store.setState((prev) => ({ ...prev, [matrix.id]: matrix }));
  eventBus.emit('requirement-matrix.created', { matrixId: matrix.id, domain: matrix.domain }, 'matrix-service');
  return matrix;
}

/** Версионированное обновление матрицы — новая версия и запись в истории изменений. */
function updateMatrix(matrixId: string, input: UpdateMatrixInput): RequirementMatrix | undefined {
  const existing = store.getState()[matrixId];
  if (!existing) return undefined;

  const { changedBy, changeDescription, ...patch } = input;
  const nextVersion = existing.version + 1;
  const now = new Date().toISOString();

  const updated: RequirementMatrix = {
    ...existing,
    ...patch,
    version: nextVersion,
    updatedAt: now,
    history: [
      ...existing.history,
      { version: nextVersion, changedBy, changedAt: now, changeDescription },
    ],
  };

  store.setState((prev) => ({ ...prev, [matrixId]: updated }));
  eventBus.emit('requirement-matrix.updated', { matrixId, version: nextVersion, changedBy }, 'matrix-service');
  return updated;
}

/** Копирование существующей матрицы в новую (версия 1, статус «Черновик»). */
function duplicateMatrix(matrixId: string, changedBy: string): RequirementMatrix | undefined {
  const source = store.getState()[matrixId];
  if (!source) return undefined;

  const now = new Date().toISOString();
  const copy: RequirementMatrix = {
    ...source,
    id: nextId(),
    name: `${source.name} (копия)`,
    status: 'draft',
    version: 1,
    history: [
      {
        version: 1,
        changedBy,
        changedAt: now,
        changeDescription: `Копия матрицы «${source.name}»`,
      },
    ],
    duplicatedFrom: source.id,
    createdAt: now,
    updatedAt: now,
  };

  store.setState((prev) => ({ ...prev, [copy.id]: copy }));
  eventBus.emit('requirement-matrix.duplicated', { matrixId: copy.id, sourceId: source.id }, 'matrix-service');
  return copy;
}

function archiveMatrix(matrixId: string, changedBy: string): RequirementMatrix | undefined {
  return updateMatrix(matrixId, { status: 'archived', changedBy, changeDescription: 'Матрица архивирована' });
}

function restoreMatrix(matrixId: string, changedBy: string): RequirementMatrix | undefined {
  return updateMatrix(matrixId, { status: 'active', changedBy, changeDescription: 'Матрица восстановлена из архива' });
}

function getMatrix(matrixId: string): RequirementMatrix | undefined {
  return store.getState()[matrixId];
}

function listAll(): RequirementMatrix[] {
  return Object.values(store.getState());
}

/** Поиск и фильтрация матриц реестра (вкладка «Матрицы требований»). */
function queryMatrices(filter: MatrixQueryFilter = {}): RequirementMatrix[] {
  const { search, domain, status, priority } = filter;
  return listAll().filter((matrix) => {
    if (domain && matrix.domain !== domain) return false;
    if (status && matrix.status !== status) return false;
    if (priority && matrix.priority !== priority) return false;
    if (search && !matrix.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}

export const matrixService = {
  store,
  createMatrix,
  updateMatrix,
  duplicateMatrix,
  archiveMatrix,
  restoreMatrix,
  getMatrix,
  listAll,
  queryMatrices,
};
