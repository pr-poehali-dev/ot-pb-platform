import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { MatrixCriteriaDimensionDefinition, MatrixCriteriaSelection } from '@/core/requirement-matrix';
import MatrixCriterionRow from './MatrixCriterionRow';

interface MatrixCriteriaSectionTabProps {
  dimensions: MatrixCriteriaDimensionDefinition[];
  criteria: MatrixCriteriaSelection[];
  onAdd: (dimensionId: string) => void;
  onRemove: (dimensionId: string) => void;
  onChange: (selection: MatrixCriteriaSelection) => void;
}

/**
 * Единый раздел «Критерии применения» карточки матрицы.
 *
 * Заменяет собой N отдельных вкладок по измерениям критериев одним общим
 * разделом: администратор явно добавляет нужные критерии из списка
 * зарегистрированных типов (matrixCriteriaDimensionRegistry), настраивает
 * каждый добавленный критерий (значения, включён/выключен, обязательность)
 * и может удалить критерий из матрицы.
 *
 * Расширяемость: чтобы добавить новый тип критерия (например «Уровень
 * допуска» для другого домена), достаточно зарегистрировать его через
 * matrixCriteriaDimensionRegistry.registerDimension() — он автоматически
 * появится в выпадающем списке добавления, без изменения этого компонента.
 */
const MatrixCriteriaSectionTab = ({ dimensions, criteria, onAdd, onRemove, onChange }: MatrixCriteriaSectionTabProps) => {
  const { t } = useTranslate();
  const [selectedDimensionId, setSelectedDimensionId] = useState<string>('');

  const addedDimensionIds = new Set(criteria.map((c) => c.dimensionId));
  const availableDimensions = dimensions.filter((d) => !addedDimensionIds.has(d.id));

  const addedCriteria = criteria
    .map((selection) => ({
      selection,
      dimension: dimensions.find((d) => d.id === selection.dimensionId),
    }))
    .filter((entry): entry is { selection: MatrixCriteriaSelection; dimension: MatrixCriteriaDimensionDefinition } => !!entry.dimension);

  const handleAdd = () => {
    if (!selectedDimensionId) return;
    onAdd(selectedDimensionId);
    setSelectedDimensionId('');
  };

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold">{t('dict.requirementMatrix:tabCriteria')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t('dict.requirementMatrix:criteriaSectionDesc')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedDimensionId} onValueChange={setSelectedDimensionId}>
            <SelectTrigger className="w-64 border-border bg-background/60 glass">
              <SelectValue placeholder={t('dict.requirementMatrix:criteriaTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              {availableDimensions.length > 0 ? (
                availableDimensions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {t(d.labelKey)}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{t('dict.requirementMatrix:criteriaAllTypesAdded')}</div>
              )}
            </SelectContent>
          </Select>
          <button
            onClick={handleAdd}
            disabled={!selectedDimensionId}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-all hover:glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="Plus" size={15} />
            {t('dict.requirementMatrix:criteriaAddAction')}
          </button>
        </div>
      </div>

      {addedCriteria.length > 0 ? (
        <div className="space-y-3">
          {addedCriteria.map(({ selection, dimension }) => (
            <MatrixCriterionRow
              key={selection.dimensionId}
              dimension={dimension}
              selection={selection}
              onChange={onChange}
              onRemove={() => onRemove(selection.dimensionId)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t('dict.requirementMatrix:criteriaSectionEmpty')}
        </div>
      )}
    </div>
  );
};

export default MatrixCriteriaSectionTab;
