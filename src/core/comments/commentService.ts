import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { AddCommentInput, Comment } from './types';

/**
 * Сервис комментариев — универсальный, привязывается к любой сущности через EntityRef.
 * Может использоваться карточками любых будущих модулей (не только HSE).
 */
let counter = 0;
const nextId = () => `cmt-${++counter}`;

const store = createStore<Comment[]>([]);

function add(input: AddCommentInput): Comment {
  const comment: Comment = {
    id: nextId(),
    entity: input.entity,
    author: input.author,
    text: input.text,
    createdAt: new Date().toISOString(),
  };
  store.setState((prev) => [...prev, comment]);
  eventBus.emit('comment.added', comment, 'comment-service');
  return comment;
}

function edit(id: string, text: string): void {
  store.setState((prev) =>
    prev.map((c) => (c.id === id ? { ...c, text, editedAt: new Date().toISOString() } : c))
  );
}

function remove(id: string): void {
  store.setState((prev) => prev.filter((c) => c.id !== id));
}

function listForEntity(entity: EntityRef): Comment[] {
  return store.getState().filter((c) => c.entity.type === entity.type && c.entity.id === entity.id);
}

export const commentService = {
  store,
  add,
  edit,
  remove,
  listForEntity,
};
