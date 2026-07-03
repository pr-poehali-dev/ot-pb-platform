import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { StoredFile, UploadFileInput } from './types';

/**
 * Файловое хранилище — реестр метаданных файлов на уровне ядра.
 * Архитектурная заглушка: фактическая загрузка байтов в S3 выполняется backend-функциями
 * конкретных модулей, а этот сервис лишь хранит и предоставляет универсальный реестр
 * ссылок на файлы (id, url, привязка к сущности), доступный всем модулям.
 */
let counter = 0;
const nextId = () => `file-${++counter}`;

const store = createStore<StoredFile[]>([]);

function register(input: UploadFileInput): StoredFile {
  const file: StoredFile = {
    id: nextId(),
    name: input.name,
    mimeType: input.mimeType,
    size: input.size,
    url: input.url,
    uploadedBy: input.uploadedBy,
    uploadedAt: new Date().toISOString(),
    relatedTo: input.relatedTo,
  };
  store.setState((prev) => [file, ...prev]);
  eventBus.emit('file.registered', file, 'file-storage-service');
  return file;
}

function remove(id: string): void {
  store.setState((prev) => prev.filter((f) => f.id !== id));
  eventBus.emit('file.removed', { id }, 'file-storage-service');
}

function listAll(): StoredFile[] {
  return store.getState();
}

function listForEntity(entity: EntityRef): StoredFile[] {
  return store.getState().filter((f) => f.relatedTo?.type === entity.type && f.relatedTo?.id === entity.id);
}

export const fileStorageService = {
  store,
  register,
  remove,
  listAll,
  listForEntity,
};
