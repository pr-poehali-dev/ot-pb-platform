import { useState } from 'react';
import { useTranslate } from '@/core';
import { MatrixDomainId, MatrixStatus, RequirementMatrix, matrixService, useRequirementMatrices } from '@/core/requirement-matrix';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import RequirementMatrixTable from './RequirementMatrixTable';
import RequirementMatrixFormDialog from './RequirementMatrixFormDialog';

interface RequirementMatrixRegistryProps {
  domain: MatrixDomainId;
  actor: string;
  onOpenMatrix: (matrix: RequirementMatrix) => void;
}

/**
 * Универсальный реестр матриц требований для одного домена применения.
 * Поверх Requirement Matrix Engine: поиск, фильтрация, создание, копирование,
 * архивирование/восстановление. Переход к карточке конкретной матрицы (все
 * её вкладки) делегируется вызывающему модулю через onOpenMatrix — сам
 * компонент не знает о маршрутизации конкретного модуля-потребителя.
 */
const RequirementMatrixRegistry = ({ domain, actor, onOpenMatrix }: RequirementMatrixRegistryProps) => {
  const { t } = useTranslate();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MatrixStatus | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);

  const { matrices, duplicateMatrix, archiveMatrix, restoreMatrix } = useRequirementMatrices({
    domain,
    search: query || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const handleDuplicate = (matrix: RequirementMatrix) => {
    const copy = duplicateMatrix(matrix.id, actor);
    if (copy) {
      toast({
        title: t('dict.requirementMatrix:toastDuplicatedTitle'),
        description: t('dict.requirementMatrix:toastDuplicatedDesc', { params: { name: copy.name } }),
      });
    }
  };

  const handleArchive = (matrix: RequirementMatrix) => {
    archiveMatrix(matrix.id, actor);
    toast({
      title: t('dict.requirementMatrix:toastArchivedTitle'),
      description: t('dict.requirementMatrix:toastArchivedDesc', { params: { name: matrix.name } }),
    });
  };

  const handleRestore = (matrix: RequirementMatrix) => {
    restoreMatrix(matrix.id, actor);
    toast({
      title: t('dict.requirementMatrix:toastRestoredTitle'),
      description: t('dict.requirementMatrix:toastRestoredDesc', { params: { name: matrix.name } }),
    });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 glow">
            <Icon name="Grid3x3" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">{t('dict.requirementMatrix:registryTitle')}</h2>
            <p className="text-sm text-muted-foreground">{t('dict.requirementMatrix:registrySubtitle')}</p>
          </div>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow"
        >
          <Icon name="Plus" size={16} />
          {t('dict.requirementMatrix:createAction')}
        </button>
      </div>

      <RequirementMatrixTable
        matrices={matrices}
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpen={onOpenMatrix}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onRestore={handleRestore}
      />

      <RequirementMatrixFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        domain={domain}
        actor={actor}
        onCreated={(id) => {
          const created = matrixService.getMatrix(id);
          if (created) onOpenMatrix(created);
        }}
      />
    </div>
  );
};

export default RequirementMatrixRegistry;