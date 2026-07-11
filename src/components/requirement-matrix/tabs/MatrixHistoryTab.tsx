import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { RequirementMatrix } from '@/core/requirement-matrix';

interface MatrixHistoryTabProps {
  matrix: RequirementMatrix;
}

/**
 * Вкладка «История изменений»: полная неизменяемая история версий матрицы
 * (версия, автор, дата, причина изменения) — по образцу EntityHistoryDialog/
 * ruleRegistry.history. Данные читаются напрямую из matrix.history, отдельного
 * журнала для этого не требуется.
 */
const MatrixHistoryTab = ({ matrix }: MatrixHistoryTabProps) => {
  const { t } = useTranslate();
  const history = [...matrix.history].reverse();

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <h3 className="mb-4 font-display text-base font-semibold">{t('dict.requirementMatrix:tabChangeHistory')}</h3>

      {history.length > 0 ? (
        <div className="relative space-y-5 py-2 pl-6">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
          {history.map((entry) => (
            <div key={entry.version} className="relative">
              <div className="absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary/15 ring-4 ring-background">
                <Icon name="History" size={10} className="text-primary" />
              </div>
              <div className="text-sm font-medium">
                {t('dict.requirementMatrix:historyVersionEntry', { params: { version: entry.version } })} — {entry.changeDescription}
              </div>
              <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <Icon name="UserCircle2" size={12} />
                {entry.changedBy}
                <span className="text-border">·</span>
                <Icon name="Clock" size={12} />
                {entry.changedAt.slice(0, 16).replace('T', ' ')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t('dict.requirementMatrix:historyEmptyState')}
        </div>
      )}
    </div>
  );
};

export default MatrixHistoryTab;
