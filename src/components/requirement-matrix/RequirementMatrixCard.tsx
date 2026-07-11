import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import {
  MatrixCriteriaSelection,
  MatrixDocumentRequirement,
  MatrixPriorityLevelValue,
  MatrixScope,
  RequirementMatrix,
  UpdateMatrixInput,
  matrixDomainRegistry,
  useRequirementMatrix,
} from '@/core/requirement-matrix';
import { MATRIX_STATUS_KEY, MATRIX_STATUS_TONE } from '@/data/requirementMatrixKeys';
import { useToast } from '@/hooks/use-toast';
import MatrixGeneralInfoTab from './tabs/MatrixGeneralInfoTab';
import MatrixScopeTab from './tabs/MatrixScopeTab';
import MatrixDocumentsTab from './tabs/MatrixDocumentsTab';
import MatrixCriteriaDimensionTab from './tabs/MatrixCriteriaDimensionTab';
import MatrixMandatorySettingsTab from './tabs/MatrixMandatorySettingsTab';
import MatrixPriorityTab from './tabs/MatrixPriorityTab';
import MatrixHistoryTab from './tabs/MatrixHistoryTab';

interface RequirementMatrixCardProps {
  matrixId: string;
  actor: string;
  onBack: () => void;
}

let docIdCounter = 0;
const nextDocId = () => `doc-${++docIdCounter}`;

/**
 * Универсальная карточка матрицы требований — единый UI для любого домена
 * применения Requirement Matrix Engine.
 *
 * Состав вкладок:
 *  - 7 статичных: Общая информация, Область применения, Обязательные
 *    документы, Дополнительные документы, Настройки обязательности,
 *    Приоритет матрицы, История изменений;
 *  - N динамических: по одной вкладке на каждое измерение критериев,
 *    зарегистрированное для домена этой матрицы через
 *    matrixCriteriaDimensionRegistry (для personnel-clearance — 8 вкладок:
 *    Категории работников, Гражданство, Профессии, Должности, Виды работ,
 *    Проекты, Объекты, Организации).
 *
 * Расширение без изменения архитектуры: чтобы добавить новое измерение
 * критериев (например «Уровень допуска» для другого домена), достаточно
 * зарегистрировать его через matrixCriteriaDimensionRegistry.registerDimension() —
 * эта карточка отрисует вкладку автоматически, ничего в этом файле менять не нужно.
 */
const RequirementMatrixCard = ({ matrixId, actor, onBack }: RequirementMatrixCardProps) => {
  const { t } = useTranslate();
  const { toast } = useToast();
  const { matrix, dimensions, updateMatrix } = useRequirementMatrix(matrixId);

  if (!matrix) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-border glass py-16 text-center">
        <Icon name="FileSearch" size={32} className="mx-auto mb-3 text-muted-foreground" />
        <p className="mb-4 text-sm text-muted-foreground">{t('dict.requirementMatrix:cardNotFound')}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Icon name="ArrowLeft" size={14} />
          {t('dict.requirementMatrix:backToRegistry')}
        </button>
      </div>
    );
  }

  const domainDefinition = matrixDomainRegistry.getDomain(matrix.domain);

  const persist = (changeDescription: string, patch: Omit<UpdateMatrixInput, 'changedBy' | 'changeDescription'>) => {
    updateMatrix(matrixId, { ...patch, changedBy: actor, changeDescription });
  };

  const handleUpdateGeneral = (fieldPatch: Partial<Pick<RequirementMatrix, 'name' | 'description'>>) => {
    persist('Изменена общая информация', fieldPatch);
  };

  const handleUpdateScope = (scope: MatrixScope) => {
    persist('Изменена область применения', { scope });
  };

  const handleAddDocument = (mandatory: boolean) => (documentTypeId: string) => {
    const requirement: MatrixDocumentRequirement = { id: nextDocId(), documentTypeId, mandatory };
    if (mandatory) {
      persist('Добавлен обязательный документ', { requiredDocuments: [...matrix.requiredDocuments, requirement] });
    } else {
      persist('Добавлен дополнительный документ', { optionalDocuments: [...matrix.optionalDocuments, requirement] });
    }
  };

  const handleCriteriaChange = (selection: MatrixCriteriaSelection) => {
    const next = matrix.criteria.filter((c) => c.dimensionId !== selection.dimensionId);
    persist('Изменены критерии применения', { criteria: [...next, selection] });
  };

  const handleToggleMandatory = (mandatory: boolean) => {
    persist('Изменена обязательность матрицы', { mandatory });
  };

  const handleChangePriority = (priority: MatrixPriorityLevelValue) => {
    persist('Изменён приоритет матрицы', { priority });
  };

  const withToast = <T extends unknown[]>(fn: (...args: T) => void) => (...args: T) => {
    fn(...args);
    toast({
      title: t('dict.requirementMatrix:toastUpdatedTitle'),
      description: t('dict.requirementMatrix:toastUpdatedDesc', { params: { name: matrix.name } }),
    });
  };

  return (
    <div>
      {/* Back */}
      <div className="mb-6 flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Icon name="ArrowLeft" size={14} />
          {t('dict.requirementMatrix:backToRegistry')}
        </button>
      </div>

      {/* Header */}
      <header className="mb-8 rounded-2xl border border-border glass p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/10 glow">
              <Icon name={domainDefinition?.icon ?? 'Grid3x3'} size={30} className="text-primary" />
            </div>
            <div>
              {domainDefinition && (
                <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                  {t(domainDefinition.labelKey)}
                </div>
              )}
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{matrix.name}</h1>
              <span className="font-mono text-xs text-muted-foreground">
                {t('dict.requirementMatrix:cardVersionLabel', { params: { version: matrix.version } })}
              </span>
            </div>
          </div>
          <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${MATRIX_STATUS_TONE[matrix.status]}`}>
            {t(`dict.requirementMatrix:${MATRIX_STATUS_KEY[matrix.status]}`)}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 h-auto flex-wrap gap-1 rounded-xl border border-border glass p-1.5">
          <TabsTrigger value="general" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="LayoutPanelLeft" size={15} />
            {t('dict.requirementMatrix:tabGeneralInfo')}
          </TabsTrigger>
          <TabsTrigger value="scope" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="Target" size={15} />
            {t('dict.requirementMatrix:tabScope')}
          </TabsTrigger>
          <TabsTrigger value="required-docs" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="FileCheck2" size={15} />
            {t('dict.requirementMatrix:tabRequiredDocuments')}
          </TabsTrigger>
          <TabsTrigger value="optional-docs" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="FilePlus2" size={15} />
            {t('dict.requirementMatrix:tabOptionalDocuments')}
          </TabsTrigger>

          {dimensions.map((dimension) => (
            <TabsTrigger
              key={dimension.id}
              value={`dimension-${dimension.id}`}
              className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Icon name={dimension.icon} size={15} />
              {t(dimension.labelKey)}
            </TabsTrigger>
          ))}

          <TabsTrigger value="mandatory" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="ToggleLeft" size={15} />
            {t('dict.requirementMatrix:tabMandatorySettings')}
          </TabsTrigger>
          <TabsTrigger value="priority" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="ArrowUpDown" size={15} />
            {t('dict.requirementMatrix:tabPriority')}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Icon name="History" size={15} />
            {t('dict.requirementMatrix:tabChangeHistory')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <MatrixGeneralInfoTab matrix={matrix} domainDefinition={domainDefinition} onUpdateField={handleUpdateGeneral} />
        </TabsContent>

        <TabsContent value="scope" className="mt-0">
          <MatrixScopeTab matrix={matrix} onUpdateScope={handleUpdateScope} />
        </TabsContent>

        <TabsContent value="required-docs" className="mt-0">
          <MatrixDocumentsTab documents={matrix.requiredDocuments} mandatory onAdd={handleAddDocument(true)} />
        </TabsContent>

        <TabsContent value="optional-docs" className="mt-0">
          <MatrixDocumentsTab documents={matrix.optionalDocuments} mandatory={false} onAdd={handleAddDocument(false)} />
        </TabsContent>

        {dimensions.map((dimension) => (
          <TabsContent key={dimension.id} value={`dimension-${dimension.id}`} className="mt-0">
            <MatrixCriteriaDimensionTab
              dimension={dimension}
              selection={matrix.criteria.find((c) => c.dimensionId === dimension.id)}
              onChange={withToast(handleCriteriaChange)}
            />
          </TabsContent>
        ))}

        <TabsContent value="mandatory" className="mt-0">
          <MatrixMandatorySettingsTab matrix={matrix} onToggleMandatory={withToast(handleToggleMandatory)} />
        </TabsContent>

        <TabsContent value="priority" className="mt-0">
          <MatrixPriorityTab matrix={matrix} onChangePriority={withToast(handleChangePriority)} />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <MatrixHistoryTab matrix={matrix} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequirementMatrixCard;