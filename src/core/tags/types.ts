import { EntityRef } from '../types';

export interface Tag {
  id: string;
  label: string;
  color: string;
}

export interface TagAssignment {
  entity: EntityRef;
  tagId: string;
}
