import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { useReferenceList } from '@/core/reference-data';
import { MatrixCriteriaDimensionDefinition, MatrixCriteriaSelection } from '@/core/requirement-matrix';

interface MatrixCriteriaDimensionTabProps {
  dimension: MatrixCriteriaDimensionDefinition;
  selection?: MatrixCriteriaSelection;
  onChange: (selection: MatrixCriteriaSelection) => void;
}

/**
 * Универсальная вкладка одного измерения критериев матрицы (используется для
 * всех вкладок, зарегистрированных через matrixCriteriaDimensionRegistry:
 * «Категории работников», «Гражданство», «Профессии», «Должности», «Виды
 * работ», «Проекты», «Объекты», «Организации» и будущих измерений других
 * доменов). Значения элементов подключены через Reference Data Engine
 * (useReferenceList) — компонент не хранит списки сам.
 *
 * Режим 'all' — измерение не ограничивает применение матрицы; 'specific' —
 * матрица применяется только к отмеченным значениям. Без бизнес-логики
 * проверки соответствия — только структура выбора.
 */
const MatrixCriteriaDimensionTab = ({ dimension, selection, onChange }: MatrixCriteriaDimensionTabProps) => {
  const { t } = useTranslate();
  const { items } = useReferenceList(dimension.referenceListId);

  const mode = selection?.mode ?? 'all';
  const selectedItemIds = selection?.selectedItemIds ?? [];
  const mandatory = selection?.mandatory ?? false;
  const enabled = selection?.enabled ?? true;

  const emit = (patch: Partial<MatrixCriteriaSelection>) => {
    onChange({
      dimensionId: dimension.id,
      enabled,
      mode,
      selectedItemIds,
      mandatory,
      ...patch,
    });
  };

  const toggleItem = (itemId: string) => {
    const next = selectedItemIds.includes(itemId)
      ? selectedItemIds.filter((id) => id !== itemId)
      : [...selectedItemIds, itemId];
    emit({ selectedItemIds: next });
  };

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name={dimension.icon} size={18} className="text-primary" />
          <h3 className="font-display text-base font-semibold">{t(dimension.labelKey)}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => emit({ mode: 'all' })}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'all' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            {t('dict.requirementMatrix:criteriaModeAll')}
          </button>
          <button
            onClick={() => emit({ mode: 'specific' })}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'specific' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'
            }`}
          >
            {t('dict.requirementMatrix:criteriaModeSpecific')}
          </button>
        </div>
      </div>

      {mode === 'specific' && (
        <div className="mb-4 space-y-2">
          {items.length > 0 ? (
            items.map((item) => (
              <label key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-2.5">
                <Checkbox checked={selectedItemIds.includes(item.id)} onCheckedChange={() => toggleItem(item.id)} />
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

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <Switch checked={mandatory} onCheckedChange={(checked) => emit({ mandatory: checked })} />
        <Label className="text-sm text-muted-foreground">{t('dict.requirementMatrix:criteriaMandatoryLabel')}</Label>
      </div>
    </div>
  );
};

export default MatrixCriteriaDimensionTab;