import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { Node } from '@/data/entities';
import { translateHistoryAction } from '@/i18n/historyActionKeys';

interface EntityHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity?: Node;
}

const EntityHistoryDialog = ({ open, onOpenChange, entity }: EntityHistoryDialogProps) => {
  const { t } = useTranslate();
  if (!entity) return null;

  const history = [...(entity.history ?? [])].reverse();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10">
              <Icon name="History" size={16} className="text-accent" />
            </div>
            <DialogTitle className="font-display">{t('dict.app:historyAction')}</DialogTitle>
          </div>
          <DialogDescription>{entity.name} · {entity.code}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[420px] overflow-y-auto pr-1">
          {history.length > 0 ? (
            <div className="relative space-y-5 py-2 pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              {history.map((event) => (
                <div key={event.id} className="relative">
                  <div className="absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary/15 ring-4 ring-background">
                    <Icon name={event.icon} size={10} className="text-primary" />
                  </div>
                  <div className="text-sm font-medium">{translateHistoryAction(event.action, t)}</div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <Icon name="UserCircle2" size={12} />
                    {event.author}
                    <span className="text-border">·</span>
                    <Icon name="Clock" size={12} />
                    {event.date}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              {t('dict.app:entityHistoryDialogEmpty')}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntityHistoryDialog;