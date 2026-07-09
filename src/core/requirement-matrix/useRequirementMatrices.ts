import { useMemo } from 'react';
import { useStore } from '../shared/useStore';
import { matrixService } from './matrixService';
import { matrixDomainRegistry } from './matrixDomainRegistry';
import { MatrixQueryFilter } from './types';

/**
 * React-хук доступа к реестру матриц требований (используется вкладкой
 * «Матрицы требований»): реактивный список, отфильтрованный по MatrixQueryFilter,
 * плюс действия create/duplicate/archive/restore.
 */
export function useRequirementMatrices(filter: MatrixQueryFilter = {}) {
  const matricesMap = useStore(matrixService.store);
  const domainsMap = useStore(matrixDomainRegistry.store);

  const matrices = useMemo(
    () => matrixService.queryMatrices(filter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matricesMap, filter.search, filter.domain, filter.status, filter.priority]
  );

  return {
    matrices,
    domains: Object.values(domainsMap),
    createMatrix: matrixService.createMatrix,
    duplicateMatrix: matrixService.duplicateMatrix,
    archiveMatrix: matrixService.archiveMatrix,
    restoreMatrix: matrixService.restoreMatrix,
  };
}
