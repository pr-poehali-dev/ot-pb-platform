import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { useReferenceList } from '@/core/reference-data';
import { MatrixCriteriaDimensionDefinition, MatrixCriteriaSelection } from '@/core/requirement-matrix';

interface MatrixCriterionRowProps {
  dimension: MatrixCriteriaDimensionDefinition;
  selection: MatrixCriteriaSelection;
  onChange: (selection: MatrixCriteriaSelection) => void;
  onRemove: () => void;
}

/**
 * Один критерий применения в разделе «Критерии применения»: заголовок с типом
 * критерия, переключателем включён/выключен, отметкой обязательности и
 * кнопкой удаления, плюс раскрываемый выбор конкретных значений
 * (Reference Data Engine, useReferenceList) — используется для любого типа
 * критерия одинаково, без специфичного для типа кода.
 */
const MatrixCriterionRow = ({ dimension, selection, onChange, onRemove }: MatrixCriterionRowProps) => {
  const { t } = useTranslate();
  const { items } = useReferenceList(dimension.referenceListId);
  const [expanded, setExpanded] = useState(false);

  const emit = (patch: Partial<MatrixCriteriaSelection>) => {
    onChange({ ...selection, ...patch });
  };

  const toggleItem = (itemId: string) => {
    const next = selection.selectedItemIds.includes(itemId)
      ? selection.selectedItemIds.filter((id) => id !== itemId)
      : [...selection.selectedItemIds, itemId];
    emit({ selectedItemIds: next });
  };

  return (
    <div className={`rounded-xl border p-4 transition-colors ${selection.enabled ? 'border-border bg-secondary/30' : 'border-dashed border-border bg-secondary/10 opacity-60'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => setExpanded((e) => !e)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
          <Icon name={dimension.icon} size={17} className="shrink-0 text-primary" />
          <span className="truncate text-sm font-medium">{t(dimension.labelKey)}</span>
          <Icon name={expanded ? 'ChevronUp' : 'ChevronDown'} size={15} className="shrink-0 text-muted-foreground" />
          {selection.mode === 'specific' && selection.selectedItemIds.length > 0 && (
            <span className="shrink-0 rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {selection.selectedItemIds.length}
            </span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={selection.mandatory} onCheckedChange={(checked) => emit({ mandatory: checked })} />
            {t('dict.requirementMatrix:criteriaMandatoryLabel')}
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={selection.enabled} onCheckedChange={(checked) => emit({ enabled: checked })} />
            {t(selection.enabled ? 'dict.requirementMatrix:criteriaEnabled' : 'dict.requirementMatrix:criteriaDisabled')}
          </label>

          <button
            onClick={onRemove}
            className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
            title={t('dict.buttons:delete')}
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-2">
            <button
              onClick={() => emit({ mode: 'all' })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                selection.mode === 'all' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              {t('dict.requirementMatrix:criteriaModeAll')}
            </button>
            <button
              onClick={() => emit({ mode: 'specific' })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                selection.mode === 'specific' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'
              }`}
            >
              {t('dict.requirementMatrix:criteriaModeSpecific')}
            </button>
          </div>

          {selection.mode === 'specific' && (
            <div className="space-y-2">
              {items.length > 0 ? (
                items.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-2.5">
                    <Checkbox checked={selection.selectedItemIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  {t('dict.requirementMatrix:criteriaEmptyState')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatrixCriterionRow;