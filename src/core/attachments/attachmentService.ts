import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { Attachment, AttachFileInput } from './types';

/**
 * Сервис вложений — связывает файлы (file-storage) с любыми сущностями платформы.
 */
let counter = 0;
const nextId = () => `att-${++counter}`;

const store = createStore<Attachment[]>([]);

function attach(input: AttachFileInput): Attachment {
  const attachment: Attachment = {
    id: nextId(),
    entity: input.entity,
    fileId: input.fileId,
    attachedBy: input.attachedBy,
    note: input.note,
    attachedAt: new Date().toISOString(),
  };
  store.setState((prev) => [...prev, attachment]);
  eventBus.emit('attachment.added', attachment, 'attachment-service');
  return attachment;
}

function detach(id: string): void {
  store.setState((prev) => prev.filter((a) => a.id !== id));
}

function listForEntity(entity: EntityRef): Attachment[] {
  return store.getState().filter((a) => a.entity.type === entity.type && a.entity.id === entity.id);
}

export const attachmentService = {
  store,
  attach,
  detach,
  listForEntity,
};
