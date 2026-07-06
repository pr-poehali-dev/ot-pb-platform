import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { DictionaryConfig, DictionaryItem, statusTone } from '@/data/dictionaries';
import { DICTIONARY_STATUS_KEY } from '@/i18n/statusKeys';
import { dictMetaTitleKey } from '@/i18n/dictionaryMetaKeys';

interface DictionaryViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: DictionaryConfig;
  item?: DictionaryItem;
}

const DictionaryViewDialog = ({ open, onOpenChange, config, item }: DictionaryViewDialogProps) => {
  const { t } = useTranslate();
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
              <Icon name={config.icon} size={16} className="text-primary" />
            </div>
            <DialogTitle className="font-display">{item.name}</DialogTitle>
          </div>
          <DialogDescription>{t(dictMetaTitleKey(config.id), { fallback: config.title })} · {item.code}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('dict.ui:code')} icon="Hash" value={item.code} mono />
            <Field label={t('dict.ui:status')} icon="CircleDot">
              <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${statusTone[item.status]}`}>
                {t(`dict.statuses:${DICTIONARY_STATUS_KEY[item.status]}`)}
              </span>
            </Field>
            <Field label={t('dict.ui:owner')} icon="UserCircle2" value={item.owner} />
            <Field label={t('dict.ui:createdAt')} icon="CalendarPlus" value={item.createdAt} />
            <Field label={t('dict.ui:updatedAt')} icon="History" value={item.updatedAt} />
          </div>
          {item.description ? (
            <div className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{t('dict.ui:description')}</div>
              <p className="text-sm text-foreground/90">{item.description as string}</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  value,
  icon,
  mono,
  children,
}: {
  label: string;
  value?: string;
  icon: string;
  mono?: boolean;
  children?: React.ReactNode;
}) => (
  <div className="flex items-start gap-2.5 rounded-xl border border-border bg-secondary/30 px-3 py-2.5">
    <Icon name={icon} size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <div className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label}</div>
      {children ?? <div className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</div>}
    </div>
  </div>
);

export default DictionaryViewDialog;