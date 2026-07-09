import { createStore } from '../shared/createStore';
import { MatrixDomainDefinition, MatrixDomainId } from './types';

/**
 * Matrix Domain Registry — реестр доменов применения матриц требований.
 * Каждый будущий модуль платформы (допуск персонала, допуск техники,
 * подрядчиков, документов, нарядов-допусков и т.д.) регистрирует свой домен
 * через registerDomain() — Requirement Matrix Engine работает с любым доменом
 * одинаково, не зная о его бизнес-специфике.
 */
const store = createStore<Record<MatrixDomainId, MatrixDomainDefinition>>({});

function registerDomain(definition: MatrixDomainDefinition): void {
  store.setState((prev) => ({ ...prev, [definition.id]: definition }));
}

function getDomain(id: MatrixDomainId): MatrixDomainDefinition | undefined {
  return store.getState()[id];
}

function listDomains(): MatrixDomainDefinition[] {
  return Object.values(store.getState());
}

export const matrixDomainRegistry = {
  store,
  registerDomain,
  getDomain,
  listDomains,
};
