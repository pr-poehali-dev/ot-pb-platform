import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { Node, LevelMeta } from '@/data/entities';
import { useToast } from '@/hooks/use-toast';
import { useEntityStore } from '@/context/EntityStoreContext';
import { levelLabelKey } from '@/i18n/levelKeys';

interface EntityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  meta: LevelMeta;
  parentId?: string;
  entity?: Node;
  onDone?: (node: Node) => void;
}

const EntityFormDialog = ({ open, onOpenChange, mode, meta, parentId, entity, onDone }: EntityFormDialogProps) => {
  const { createEntity, updateEntity } = useEntityStore();
  const { toast } = useToast();
  const { t } = useTranslate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setName(entity?.name ?? '');
      setCode(entity?.code ?? '');
      setOwner(entity?.owner ?? '');
      setDescription(entity?.description ?? '');
    }
  }, [open, entity]);

  const isValid = name.trim().length > 0 && code.trim().length > 0 && owner.trim().length > 0;
  const levelLabel = t(levelLabelKey(meta.id));

  const handleSubmit = () => {
    if (!isValid) return;

    if (mode === 'create' && parentId) {
      const node = createEntity({
        level: meta.id,
        parentId,
        name: name.trim(),
        code: code.trim(),
        owner: owner.trim(),
        description: description.trim() || undefined,
      });
      toast({
        title: t('dict.app:entityFormToastCreatedTitle'),
        description: t('dict.app:entityFormToastCreatedDesc', { params: { name: node.name, label: levelLabel } }),
      });
      onDone?.(node);
    } else if (mode === 'edit' && entity) {
      updateEntity(entity.id, {
        name: name.trim(),
        code: code.trim(),
        owner: owner.trim(),
        description: description.trim() || undefined,
      });
      toast({
        title: t('dict.app:entityFormToastUpdatedTitle'),
        description: t('dict.app:entityFormToastUpdatedDesc', { params: { name: name.trim() } }),
      });
      onDone?.(entity);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
              <Icon name={mode === 'create' ? 'Plus' : 'Pencil'} size={16} className="text-primary" />
            </div>
            <DialogTitle className="font-display">
              {mode === 'create'
                ? t('dict.app:entityFormCreateTitle', { params: { label: levelLabel } })
                : t('dict.app:entityFormEditTitle', { params: { label: levelLabel } })}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === 'create'
              ? t('dict.app:entityFormCreateDesc')
              : t('dict.app:entityFormEditDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="entity-name">{t('dict.ui:name')}</Label>
            <Input id="entity-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('dict.app:entityFormNamePlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entity-code">{t('dict.ui:code')}</Label>
            <Input id="entity-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('dict.app:entityFormCodePlaceholder')} className="font-mono" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entity-owner">{t('dict.ui:owner')}</Label>
            <Input id="entity-owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder={t('dict.app:ownerPlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entity-desc">{t('dict.ui:description')}</Label>
            <Textarea id="entity-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('dict.app:entityFormDescPlaceholder')} rows={3} />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('dict.buttons:cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name={mode === 'create' ? 'Plus' : 'Check'} size={15} />
            {mode === 'create' ? t('dict.buttons:create') : t('dict.buttons:save')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntityFormDialog;
