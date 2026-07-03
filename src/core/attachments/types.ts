import { EntityRef } from '../types';

/**
 * Вложение — связь между файлом (из file-storage) и произвольной сущностью.
 * Разделение с file-storage: file-storage хранит физические файлы,
 * attachments — это связи "какой файл к какой сущности прикреплён и кем".
 */
export interface Attachment {
  id: string;
  entity: EntityRef;
  fileId: string;
  attachedBy: string;
  attachedAt: string;
  note?: string;
}

export interface AttachFileInput {
  entity: EntityRef;
  fileId: string;
  attachedBy: string;
  note?: string;
}
