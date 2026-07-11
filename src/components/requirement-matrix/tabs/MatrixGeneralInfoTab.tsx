import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { MatrixDomainDefinition, RequirementMatrix } from '@/core/requirement-matrix';
import { MATRIX_STATUS_KEY, MATRIX_STATUS_TONE } from '@/data/requirementMatrixKeys';

interface MatrixGeneralInfoTabProps {
  matrix: RequirementMatrix;
  domainDefinition?: MatrixDomainDefinition;
  onUpdateField: (patch: Partial<Pick<RequirementMatrix, 'name' | 'description'>>) => void;
}

/**
 * Вкладка «Общая информация» карточки матрицы: название, описание, домен
 * применения, статус, версия и служебные даты. Только редактирование полей
 * верхнего уровня — без бизнес-логики проверки.
 */
const MatrixGeneralInfoTab = ({ matrix, domainDefinition, onUpdateField }: MatrixGeneralInfoTabProps) => {
  const { t } = useTranslate();

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <h3 className="mb-4 font-display text-base font-semibold">{t('dict.requirementMatrix:tabGeneralInfo')}</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="matrix-name">{t('dict.requirementMatrix:fieldName')}</Label>
          <Input id="matrix-name" value={matrix.name} onChange={(e) => onUpdateField({ name: e.target.value })} />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="matrix-desc">{t('dict.ui:description')}</Label>
          <Textarea
            id="matrix-desc"
            value={matrix.description ?? ''}
            onChange={(e) => onUpdateField({ description: e.target.value })}
            rows={3}
          />
        </div>

        <Field label={t('dict.requirementMatrix:fieldDomain')} icon={domainDefinition?.icon ?? 'Grid3x3'}>
          {domainDefinition ? t(domainDefinition.labelKey) : matrix.domain}
        </Field>

        <Field label={t('dict.requirementMatrix:fieldStatus')} icon="CircleDot">
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${MATRIX_STATUS_TONE[matrix.status]}`}>
            {t(`dict.requirementMatrix:${MATRIX_STATUS_KEY[matrix.status]}`)}
          </span>
        </Field>

        <Field label={t('dict.requirementMatrix:columnVersion')} icon="History" mono>
          v{matrix.version}
        </Field>

        <Field label={t('dict.requirementMatrix:fieldCreatedAt')} icon="CalendarPlus" mono>
          {matrix.createdAt.slice(0, 10)}
        </Field>

        <Field label={t('dict.requirementMatrix:fieldUpdatedAt')} icon="Clock" mono>
          {matrix.updatedAt.slice(0, 10)}
        </Field>

        {matrix.duplicatedFrom && (
          <Field label={t('dict.requirementMatrix:fieldDuplicatedFrom')} icon="Copy" mono>
            {matrix.duplicatedFrom}
          </Field>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  icon,
  mono,
  children,
}: {
  label: string;
  icon: string;
  mono?: boolean;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-secondary/30 p-4">
    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon name={icon} size={13} />
      {label}
    </div>
    <div className={mono ? 'font-mono text-sm' : 'text-sm font-medium'}>{children}</div>
  </div>
);

export default MatrixGeneralInfoTab;
