export interface StatusDefinition {
  id: string;
  label: string;
  color: string;
  /** Группа статусов, к которой относится определение (например, 'dictionary', 'entity') */
  scope: string;
}

export interface EntityStatusState {
  entityType: string;
  entityId: string;
  statusId: string;
  changedAt: string;
  changedBy: string;
}
