import { EntityRef } from '../types';

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

export interface ChangeRecord {
  id: string;
  entity: EntityRef;
  author: string;
  timestamp: string;
  changes: FieldChange[];
}

export interface RecordChangeInput {
  entity: EntityRef;
  author: string;
  changes: FieldChange[];
}
