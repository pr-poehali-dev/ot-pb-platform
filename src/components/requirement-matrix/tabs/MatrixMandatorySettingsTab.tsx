import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTranslate } from '@/core';
import { RequirementMatrix } from '@/core/requirement-matrix';

interface MatrixMandatorySettingsTabProps {
  matrix: RequirementMatrix;
  onToggleMandatory: (mandatory: boolean) => void;
}

/**
 * Вкладка «Настройки обязательности»: единый флаг, обязательна ли матрица
 * целиком к применению (mandatory) или носит рекомендательный характер.
 * Не путать с mandatory на уровне отдельного документа/измерения критериев —
 * это отдельные более гранулярные флаги внутри соответствующих вкладок.
 */
const MatrixMandatorySettingsTab = ({ matrix, onToggleMandatory }: MatrixMandatorySettingsTabProps) => {
  const { t } = useTranslate();

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <h3 className="mb-4 font-display text-base font-semibold">{t('dict.requirementMatrix:tabMandatorySettings')}</h3>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/30 p-4">
        <div>
          <Label className="text-sm font-medium">{t('dict.requirementMatrix:mandatoryToggleLabel')}</Label>
          <p className="mt-1 text-xs text-muted-foreground">{t('dict.requirementMatrix:mandatoryToggleDesc')}</p>
        </div>
        <Switch checked={matrix.mandatory} onCheckedChange={onToggleMandatory} />
      </div>
    </div>
  );
};

export default MatrixMandatorySettingsTab;
