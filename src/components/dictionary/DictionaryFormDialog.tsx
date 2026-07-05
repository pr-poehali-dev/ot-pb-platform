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
import { DictionaryConfig, DictionaryItem } from '@/data/dictionaries';
import { useDictionaryStore } from '@/context/DictionaryStoreContext';
import { useToast } from '@/hooks/use-toast';

interface DictionaryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  config: DictionaryConfig;
  item?: DictionaryItem;
}

const DictionaryFormDialog = ({ open, onOpenChange, mode, config, item }: DictionaryFormDialogProps) => {
  const { createItem, updateItem } = useDictionaryStore();
  const { toast } = useToast();
  const { t } = useTranslate();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [owner, setOwner] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setName(item?.name ?? '');
      setCode(item?.code ?? '');
      setOwner(item?.owner ?? '');
      setDescription((item?.description as string) ?? '');
    }
  }, [open, item]);

  const isValid = name.trim().length > 0 && code.trim().length > 0 && owner.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    if (mode === 'create') {
      const created = createItem(config.id, config.codePrefix, {
        name: name.trim(),
        code: code.trim(),
        owner: owner.trim(),
        description: description.trim() || undefined,
      });
      toast({
        title: t('dict.app:dictFormToastCreatedTitle'),
        description: t('dict.app:dictFormToastCreatedDesc', { params: { name: created.name, title: config.title } }),
      });
    } else if (item) {
      updateItem(config.id, item.id, {
        name: name.trim(),
        code: code.trim(),
        owner: owner.trim(),
        description: description.trim() || undefined,
      });
      toast({
        title: t('dict.app:dictFormToastUpdatedTitle'),
        description: t('dict.app:dictFormToastUpdatedDesc', { params: { name: name.trim() } }),
      });
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
                ? t('dict.app:dictFormCreateTitle', { params: { title: config.title } })
                : t('dict.app:dictFormEditTitle')}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === 'create'
              ? t('dict.app:dictFormCreateDesc', { params: { title: config.title } })
              : t('dict.app:dictFormEditDesc')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="dict-name">{t('dict.ui:name')}</Label>
            <Input id="dict-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('dict.app:dictFormNamePlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dict-code">{t('dict.ui:code')}</Label>
            <Input id="dict-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder={t('dict.app:dictFormCodePlaceholder', { params: { prefix: config.codePrefix } })} className="font-mono" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dict-owner">{t('dict.ui:owner')}</Label>
            <Input id="dict-owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder={t('dict.app:ownerPlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dict-desc">{t('dict.ui:description')}</Label>
            <Textarea id="dict-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('dict.app:dictFormDescPlaceholder')} rows={3} />
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

export default DictionaryFormDialog;
