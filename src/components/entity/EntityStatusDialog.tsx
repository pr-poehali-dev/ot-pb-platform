import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { Node } from '@/data/entities';
import { useToast } from '@/hooks/use-toast';
import { useEntityStore } from '@/context/EntityStoreContext';

interface EntityStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'archive' | 'restore';
  entity?: Node;
}

const EntityStatusDialog = ({ open, onOpenChange, action, entity }: EntityStatusDialogProps) => {
  const { archiveEntity, restoreEntity } = useEntityStore();
  const { toast } = useToast();

  if (!entity) return null;

  const isArchive = action === 'archive';

  const handleConfirm = () => {
    if (isArchive) {
      archiveEntity(entity.id);
      toast({ title: 'Сущность архивирована', description: `«${entity.name}» переведена в статус «Архив»` });
    } else {
      restoreEntity(entity.id);
      toast({ title: 'Сущность восстановлена', description: `«${entity.name}» переведена в статус «Активен»` });
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass border-border">
        <AlertDialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className={`grid h-9 w-9 place-items-center rounded-lg ${isArchive ? 'bg-amber-400/10' : 'bg-primary/10'}`}>
              <Icon name={isArchive ? 'Archive' : 'RotateCcw'} size={16} className={isArchive ? 'text-amber-400' : 'text-primary'} />
            </div>
            <AlertDialogTitle className="font-display">
              {isArchive ? 'Архивировать сущность?' : 'Восстановить сущность?'}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {isArchive
              ? `«${entity.name}» получит статус «Архив». Данные сохраняются, физическое удаление не выполняется.`
              : `«${entity.name}» получит статус «Активен» и вернётся в рабочий контур.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <button
            onClick={handleConfirm}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isArchive
                ? 'bg-amber-400/15 text-amber-400 hover:bg-amber-400/25'
                : 'bg-primary text-primary-foreground hover:glow'
            }`}
          >
            <Icon name={isArchive ? 'Archive' : 'RotateCcw'} size={15} />
            {isArchive ? 'Архивировать' : 'Восстановить'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EntityStatusDialog;
