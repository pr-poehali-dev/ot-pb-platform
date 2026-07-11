import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTranslate } from '@/core';
import { MatrixScope, MatrixScopeType, RequirementMatrix } from '@/core/requirement-matrix';
import { MATRIX_SCOPE_KEY } from '@/data/requirementMatrixKeys';

interface MatrixScopeTabProps {
  matrix: RequirementMatrix;
  onUpdateScope: (scope: MatrixScope) => void;
}

const SCOPE_OPTIONS: MatrixScopeType[] = ['global', 'project', 'object', 'contractor'];

/**
 * Вкладка «Область применения»: тип области (глобально/проект/объект/
 * подрядчик) и уточняющее описание. На этом этапе — только редактирование
 * значения, без привязки к конкретным записям справочников проектов/объектов
 * (это делают отдельные вкладки-измерения критериев «Проекты»/«Объекты»).
 */
const MatrixScopeTab = ({ matrix, onUpdateScope }: MatrixScopeTabProps) => {
  const { t } = useTranslate();

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <h3 className="mb-4 font-display text-base font-semibold">{t('dict.requirementMatrix:tabScope')}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>{t('dict.requirementMatrix:scopeTypeLabel')}</Label>
          <Select
            value={matrix.scope.scopeType}
            onValueChange={(v) => onUpdateScope({ ...matrix.scope, scopeType: v as MatrixScopeType })}
          >
            <SelectTrigger className="border-border bg-background/60 glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              {SCOPE_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`dict.requirementMatrix:${MATRIX_SCOPE_KEY[s]}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="scope-desc">{t('dict.requirementMatrix:scopeDescLabel')}</Label>
          <Textarea
            id="scope-desc"
            value={matrix.scope.description ?? ''}
            onChange={(e) => onUpdateScope({ ...matrix.scope, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default MatrixScopeTab;
