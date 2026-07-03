import { EntityRef } from '../types';

export interface Comment {
  id: string;
  entity: EntityRef;
  author: string;
  text: string;
  createdAt: string;
  editedAt?: string;
}

export interface AddCommentInput {
  entity: EntityRef;
  author: string;
  text: string;
}
