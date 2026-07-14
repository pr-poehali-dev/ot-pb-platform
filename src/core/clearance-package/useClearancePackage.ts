import { useStore } from '../shared/useStore';
import { clearancePackageService } from './clearancePackageService';
import { decisionLogService } from './decisionLogService';
import { requirementCategoryRegistry } from './requirementCategoryRegistry';

/**
 * React-хук доступа к одному Пакету допуска (используется карточкой пакета
 * и всеми её разделами): реактивная сущность пакета + журнал решений по
 * этому пакету + список зарегистрированных категорий требований.
 */
export function useClearancePackage(packageId: string | undefined) {
  const packagesMap = useStore(clearancePackageService.store);
  const decisions = useStore(decisionLogService.store);
  useStore(requirementCategoryRegistry.store);

  const pkg = packageId ? packagesMap[packageId] : undefined;

  return {
    package: pkg,
    decisions: packageId ? decisions.filter((d) => d.packageId === packageId) : [],
    requirementCategories: requirementCategoryRegistry.listCategories(),
    updatePackage: clearancePackageService.updatePackage,
    recordDecision: decisionLogService.record,
  };
}
