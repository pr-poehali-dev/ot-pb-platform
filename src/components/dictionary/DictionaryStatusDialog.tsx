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
import { DictionaryConfig, DictionaryItem } from '@/data/dictionaries';
import { useDictionaryStore } from '@/context/DictionaryStoreContext';
import { useToast } from '@/hooks/use-toast';

interface DictionaryStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'archive' | 'restore';
  config: DictionaryConfig;
  item?: DictionaryItem;
}

const DictionaryStatusDialog = ({ open, onOpenChange, action, config, item }: DictionaryStatusDialogProps) => {
  const { archiveItem, restoreItem } = useDictionaryStore();
  const { toast } = useToast();

  if (!item) return null;

  const isArchive = action === 'archive';

  const handleConfirm = () => {
    if (isArchive) {
      archiveItem(config.id, item.id);
      toast({ title: 'Запись архивирована', description: `«${item.name}» переведена в статус «Архив»` });
    } else {
      restoreItem(config.id, item.id);
      toast({ title: 'Запись восстановлена', description: `«${item.name}» переведена в статус «Активен»` });
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
              {isArchive ? 'Архивировать запись?' : 'Восстановить запись?'}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {isArchive
              ? `«${item.name}» получит статус «Архив». Физическое удаление не выполняется.`
              : `«${item.name}» получит статус «Активен».`}
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

export default DictionaryStatusDialog;
