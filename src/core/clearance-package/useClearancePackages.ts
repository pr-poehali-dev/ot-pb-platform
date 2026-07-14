import { useMemo } from 'react';
import { useStore } from '../shared/useStore';
import { clearancePackageService } from './clearancePackageService';
import { ClearancePackageQueryFilter } from './types';

/**
 * React-хук доступа к реестру Пакетов допуска (используется вкладкой
 * «Пакеты допуска»): реактивный список, отфильтрованный по
 * ClearancePackageQueryFilter, плюс действие создания.
 */
export function useClearancePackages(filter: ClearancePackageQueryFilter = {}) {
  const packagesMap = useStore(clearancePackageService.store);

  const packages = useMemo(
    () => clearancePackageService.queryPackages(filter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [packagesMap, filter.search, filter.workerId, filter.organizationId, filter.projectId, filter.objectId, filter.status]
  );

  return {
    packages,
    createPackage: clearancePackageService.createPackage,
  };
}
