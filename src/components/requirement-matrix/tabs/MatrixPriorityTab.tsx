import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTranslate } from '@/core';
import { MatrixPriorityLevel, MatrixPriorityLevelValue, RequirementMatrix } from '@/core/requirement-matrix';
import { MATRIX_PRIORITY_KEY } from '@/data/requirementMatrixKeys';

interface MatrixPriorityTabProps {
  matrix: RequirementMatrix;
  onChangePriority: (priority: MatrixPriorityLevelValue) => void;
}

const PRIORITY_OPTIONS: MatrixPriorityLevelValue[] = [
  MatrixPriorityLevel.Legislation,
  MatrixPriorityLevel.Corporate,
  MatrixPriorityLevel.Project,
  MatrixPriorityLevel.Customer,
  MatrixPriorityLevel.Temporary,
];

/**
 * Вкладка «Приоритет матрицы»: пятиуровневая шкала (законодательство →
 * корпоративное → проектное → заказчика → временное), определяющая, какая
 * матрица применяется при пересечении нескольких требований для одной
 * ситуации. Только выбор значения — без логики разрешения конфликтов.
 */
const MatrixPriorityTab = ({ matrix, onChangePriority }: MatrixPriorityTabProps) => {
  const { t } = useTranslate();

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <h3 className="mb-2 font-display text-base font-semibold">{t('dict.requirementMatrix:tabPriority')}</h3>
      <p className="mb-4 max-w-2xl text-sm text-muted-foreground">{t('dict.requirementMatrix:priorityTabDesc')}</p>

      <div className="max-w-xs">
        <Label className="mb-2 block">{t('dict.requirementMatrix:columnPriority')}</Label>
        <Select value={matrix.priority} onValueChange={(v) => onChangePriority(v as MatrixPriorityLevelValue)}>
          <SelectTrigger className="border-border bg-background/60 glass">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-border">
            {PRIORITY_OPTIONS.map((p) => (
              <SelectItem key={p} value={p}>
                {t(`dict.requirementMatrix:${MATRIX_PRIORITY_KEY[p]}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MatrixPriorityTab;
