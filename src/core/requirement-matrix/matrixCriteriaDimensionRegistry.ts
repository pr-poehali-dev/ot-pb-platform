import { createStore } from '../shared/createStore';
import { MatrixCriteriaDimensionDefinition, MatrixDomainId } from './types';

/**
 * Matrix Criteria Dimension Registry — реестр измерений критериев матрицы
 * («Категории работников», «Гражданство», «Профессии», «Должности», «Виды
 * работ», «Проекты», «Объекты», «Организации» и будущие измерения других
 * доменов). Каждое измерение регистрируется один раз и ссылается на список
 * Reference Data Engine (ReferenceListId) — карточка матрицы строит вкладки
 * по данным этого реестра, не хардкодя набор критериев в UI.
 */
const store = createStore<Record<string, MatrixCriteriaDimensionDefinition>>({});

function registerDimension(definition: MatrixCriteriaDimensionDefinition): void {
  store.setState((prev) => ({ ...prev, [definition.id]: definition }));
}

function getDimension(id: string): MatrixCriteriaDimensionDefinition | undefined {
  return store.getState()[id];
}

function listDimensions(): MatrixCriteriaDimensionDefinition[] {
  return Object.values(store.getState());
}

/** Измерения критериев конкретного домена, отсортированные по order (для вкладок карточки). */
function listByDomain(domain: MatrixDomainId): MatrixCriteriaDimensionDefinition[] {
  return listDimensions()
    .filter((d) => d.domain === domain)
    .sort((a, b) => a.order - b.order);
}

export const matrixCriteriaDimensionRegistry = {
  store,
  registerDimension,
  getDimension,
  listDimensions,
  listByDomain,
};