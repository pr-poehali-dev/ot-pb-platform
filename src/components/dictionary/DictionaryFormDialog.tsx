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
      toast({ title: 'Запись создана', description: `«${created.name}» добавлена в справочник «${config.title}»` });
    } else if (item) {
      updateItem(config.id, item.id, {
        name: name.trim(),
        code: code.trim(),
        owner: owner.trim(),
        description: description.trim() || undefined,
      });
      toast({ title: 'Изменения сохранены', description: `Запись «${name.trim()}» обновлена` });
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
              {mode === 'create' ? `Новая запись: ${config.title}` : `Редактирование записи`}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === 'create'
              ? `Заполните данные для справочника «${config.title}».`
              : 'Изменения будут сохранены в записи справочника.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="dict-name">Название</Label>
            <Input id="dict-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название записи" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dict-code">Код</Label>
            <Input id="dict-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder={`Например, ${config.codePrefix}-003`} className="font-mono" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dict-owner">Ответственный</Label>
            <Input id="dict-owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ФИО ответственного" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dict-desc">Описание</Label>
            <Textarea id="dict-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание (необязательно)" rows={3} />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name={mode === 'create' ? 'Plus' : 'Check'} size={15} />
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DictionaryFormDialog;
