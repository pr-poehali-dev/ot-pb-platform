import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { Tag, TagAssignment } from './types';

/**
 * Сервис тегов — глобальный реестр тегов + назначение тегов любым сущностям.
 * Независим от конкретных модулей: тег можно навесить на что угодно через EntityRef.
 */
let counter = 0;
const nextId = () => `tag-${++counter}`;

const tagsStore = createStore<Tag[]>([]);
const assignmentsStore = createStore<TagAssignment[]>([]);

function createTag(label: string, color = 'primary'): Tag {
  const tag: Tag = { id: nextId(), label, color };
  tagsStore.setState((prev) => [...prev, tag]);
  eventBus.emit('tag.created', tag, 'tag-service');
  return tag;
}

function removeTag(tagId: string): void {
  tagsStore.setState((prev) => prev.filter((t) => t.id !== tagId));
  assignmentsStore.setState((prev) => prev.filter((a) => a.tagId !== tagId));
}

function assignTag(entity: EntityRef, tagId: string): void {
  const exists = assignmentsStore
    .getState()
    .some((a) => a.entity.type === entity.type && a.entity.id === entity.id && a.tagId === tagId);
  if (exists) return;
  assignmentsStore.setState((prev) => [...prev, { entity, tagId }]);
}

function unassignTag(entity: EntityRef, tagId: string): void {
  assignmentsStore.setState((prev) =>
    prev.filter((a) => !(a.entity.type === entity.type && a.entity.id === entity.id && a.tagId === tagId))
  );
}

function listAllTags(): Tag[] {
  return tagsStore.getState();
}

function listTagsForEntity(entity: EntityRef): Tag[] {
  const ids = assignmentsStore
    .getState()
    .filter((a) => a.entity.type === entity.type && a.entity.id === entity.id)
    .map((a) => a.tagId);
  return tagsStore.getState().filter((t) => ids.includes(t.id));
}

export const tagService = {
  tagsStore,
  assignmentsStore,
  createTag,
  removeTag,
  assignTag,
  unassignTag,
  listAllTags,
  listTagsForEntity,
};
