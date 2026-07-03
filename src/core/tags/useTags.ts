import { useStore } from '../shared/useStore';
import { tagService } from './tagService';
import { EntityRef } from '../types';

export function useTags(entity?: EntityRef) {
  const allTags = useStore(tagService.tagsStore);
  const assignments = useStore(tagService.assignmentsStore);

  const entityTags = entity
    ? allTags.filter((t) =>
        assignments.some((a) => a.tagId === t.id && a.entity.type === entity.type && a.entity.id === entity.id)
      )
    : [];

  return {
    allTags,
    entityTags,
    createTag: tagService.createTag,
    removeTag: tagService.removeTag,
    assignTag: tagService.assignTag,
    unassignTag: tagService.unassignTag,
  };
}
