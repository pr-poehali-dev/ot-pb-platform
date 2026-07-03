import { useStore } from '../shared/useStore';
import { fileStorageService } from './fileStorageService';
import { EntityRef } from '../types';

export function useFileStorage(entity?: EntityRef) {
  const files = useStore(fileStorageService.store);
  const filtered = entity
    ? files.filter((f) => f.relatedTo?.type === entity.type && f.relatedTo?.id === entity.id)
    : files;

  return {
    files: filtered,
    register: fileStorageService.register,
    remove: fileStorageService.remove,
  };
}
