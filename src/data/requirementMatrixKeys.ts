import { MatrixPriorityLevel, MatrixPriorityLevelValue, MatrixScopeType, MatrixStatus } from '@/core/requirement-matrix';

/**
 * Сопоставление статусов/приоритетов/областей применения матрицы требований
 * с ключами словаря Translation Management (namespace dict.requirementMatrix)
 * и с цветовой индикацией — по образцу src/i18n/statusKeys.ts.
 * Универсально для любого домена применения (допуск персонала, техники,
 * подрядчиков и т.д.) — не специфично ни для одного модуля.
 */
export const MATRIX_STATUS_KEY: Record<MatrixStatus, string> = {
  draft: 'statusDraft',
  active: 'statusActive',
  archived: 'statusArchived',
};

export const MATRIX_STATUS_TONE: Record<MatrixStatus, string> = {
  draft: 'text-muted-foreground border-border bg-secondary/60',
  active: 'text-primary border-primary/30 bg-primary/10',
  archived: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

export const MATRIX_PRIORITY_KEY: Record<MatrixPriorityLevelValue, string> = {
  [MatrixPriorityLevel.Legislation]: 'priorityLegislation',
  [MatrixPriorityLevel.Corporate]: 'priorityCorporate',
  [MatrixPriorityLevel.Project]: 'priorityProject',
  [MatrixPriorityLevel.Customer]: 'priorityCustomer',
  [MatrixPriorityLevel.Temporary]: 'priorityTemporary',
};

export const MATRIX_SCOPE_KEY: Record<MatrixScopeType, string> = {
  global: 'scopeGlobal',
  project: 'scopeProject',
  object: 'scopeObject',
  contractor: 'scopeContractor',
};
