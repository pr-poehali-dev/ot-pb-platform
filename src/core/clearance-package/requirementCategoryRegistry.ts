import { createStore } from '../shared/createStore';
import { RequirementCategoryDefinition, RequirementCategoryId } from './types';

/**
 * Requirement Category Registry — открытый реестр категорий требований
 * Пакета допуска (документы, обучение, медосмотры, квалификация, требования
 * Службы безопасности, требования склада СИЗ и т.д.). Архитектура повторяет
 * matrixCriteriaDimensionRegistry (Requirement Matrix Engine): любая будущая
 * категория добавляется регистрацией, без изменения структуры пакета.
 */
const store = createStore<Record<RequirementCategoryId, RequirementCategoryDefinition>>({});

function registerCategory(definition: RequirementCategoryDefinition): void {
  store.setState((prev) => ({ ...prev, [definition.id]: definition }));
}

function getCategory(id: RequirementCategoryId): RequirementCategoryDefinition | undefined {
  return store.getState()[id];
}

function listCategories(): RequirementCategoryDefinition[] {
  return Object.values(store.getState());
}

export const requirementCategoryRegistry = {
  store,
  registerCategory,
  getCategory,
  listCategories,
};
