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
import { useTranslate } from '@/core';
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
  const { t } = useTranslate();

  if (!item) return null;

  const isArchive = action === 'archive';

  const handleConfirm = () => {
    if (isArchive) {
      archiveItem(config.id, item.id);
      toast({
        title: t('dict.app:dictStatusToastArchivedTitle'),
        description: t('dict.app:dictStatusToastArchivedDesc', { params: { name: item.name } }),
      });
    } else {
      restoreItem(config.id, item.id);
      toast({
        title: t('dict.app:dictStatusToastRestoredTitle'),
        description: t('dict.app:dictStatusToastRestoredDesc', { params: { name: item.name } }),
      });
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
              {isArchive ? t('dict.app:dictStatusArchiveTitle') : t('dict.app:dictStatusRestoreTitle')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {isArchive
              ? t('dict.app:dictStatusArchiveDesc', { params: { name: item.name } })
              : t('dict.app:dictStatusRestoreDesc', { params: { name: item.name } })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('dict.buttons:cancel')}</AlertDialogCancel>
          <button
            onClick={handleConfirm}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isArchive
                ? 'bg-amber-400/15 text-amber-400 hover:bg-amber-400/25'
                : 'bg-primary text-primary-foreground hover:glow'
            }`}
          >
            <Icon name={isArchive ? 'Archive' : 'RotateCcw'} size={15} />
            {isArchive ? t('dict.buttons:archive') : t('dict.buttons:restore')}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DictionaryStatusDialog;
