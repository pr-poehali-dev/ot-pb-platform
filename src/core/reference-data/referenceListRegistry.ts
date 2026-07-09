import { createStore } from '../shared/createStore';
import { ReferenceItem, ReferenceListDefinition, ReferenceListId } from './types';

/**
 * Reference List Registry — центральный реестр справочных списков.
 * Архитектура идентична ruleRegistry (Business Rules Engine) / statusService:
 * любой модуль регистрирует список через registerList(), любой модуль
 * читает его только через getList()/listAll() — без прямого знания источника
 * данных (сейчас — заглушка, в будущем — реальный Reference Data Engine).
 */
const store = createStore<Record<ReferenceListId, ReferenceListDefinition>>({});

function registerList(definition: ReferenceListDefinition): void {
  store.setState((prev) => ({ ...prev, [definition.id]: definition }));
}

function getList(id: ReferenceListId): ReferenceListDefinition | undefined {
  return store.getState()[id];
}

function getItems(id: ReferenceListId): ReferenceItem[] {
  return store.getState()[id]?.items ?? [];
}

function listAll(): ReferenceListDefinition[] {
  return Object.values(store.getState());
}

export const referenceListRegistry = {
  store,
  registerList,
  getList,
  getItems,
  listAll,
};
