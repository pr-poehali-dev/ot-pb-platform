import { EntityRef } from '../types';

export interface StoredFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  /** Сущность, к которой привязан файл (опционально) */
  relatedTo?: EntityRef;
}

export interface UploadFileInput {
  name: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  relatedTo?: EntityRef;
}
