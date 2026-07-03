import { useStore } from '../shared/useStore';
import { attachmentService } from './attachmentService';
import { EntityRef } from '../types';

export function useAttachments(entity: EntityRef) {
  const all = useStore(attachmentService.store);
  const attachments = all.filter((a) => a.entity.type === entity.type && a.entity.id === entity.id);

  return {
    attachments,
    attach: attachmentService.attach,
    detach: attachmentService.detach,
  };
}
