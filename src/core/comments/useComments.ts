import { useStore } from '../shared/useStore';
import { commentService } from './commentService';
import { EntityRef } from '../types';

export function useComments(entity: EntityRef) {
  const all = useStore(commentService.store);
  const comments = all.filter((c) => c.entity.type === entity.type && c.entity.id === entity.id);

  return {
    comments,
    add: commentService.add,
    edit: commentService.edit,
    remove: commentService.remove,
  };
}
