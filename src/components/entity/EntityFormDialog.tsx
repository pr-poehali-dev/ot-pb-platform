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
import { Node, LevelMeta } from '@/data/entities';
import { useToast } from '@/hooks/use-toast';
import { useEntityStore } from '@/context/EntityStoreContext';

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
      toast({ title: 'Сущность создана', description: `«${node.name}» добавлена в раздел «${meta.label}»` });
      onDone?.(node);
    } else if (mode === 'edit' && entity) {
      updateEntity(entity.id, {
        name: name.trim(),
        code: code.trim(),
        owner: owner.trim(),
        description: description.trim() || undefined,
      });
      toast({ title: 'Изменения сохранены', description: `Карточка «${name.trim()}» обновлена` });
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
              {mode === 'create' ? `Новая сущность: ${meta.label}` : `Редактирование: ${meta.label}`}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === 'create'
              ? 'Заполните карточку по единому стандарту Noventra Core.'
              : 'Изменения будут зафиксированы в истории сущности.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="entity-name">Название</Label>
            <Input id="entity-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, ООО «СтройИнвест Групп»" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entity-code">Код</Label>
            <Input id="entity-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Например, CMP-003" className="font-mono" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entity-owner">Ответственный</Label>
            <Input id="entity-owner" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ФИО ответственного" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="entity-desc">Описание</Label>
            <Textarea id="entity-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание сущности (необязательно)" rows={3} />
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

export default EntityFormDialog;
