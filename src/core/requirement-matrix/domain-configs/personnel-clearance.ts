import { matrixDomainRegistry } from '../matrixDomainRegistry';
import { matrixCriteriaDimensionRegistry } from '../matrixCriteriaDimensionRegistry';

/**
 * Регистрация домена «Предварительный допуск персонала» в Requirement Matrix
 * Engine — пример того, как конкретный модуль подключает универсальный
 * механизм матриц требований, не изменяя его архитектуру.
 *
 * Каждое измерение критериев ссылается на список Reference Data Engine
 * (см. core/reference-data/stubLists.ts) по тому же id — сейчас это заглушки,
 * в будущем источник данных заменится без изменения этой регистрации.
 *
 * Будущие домены (допуск техники, подрядчиков, документов, нарядов-допусков)
 * регистрируются по тому же образцу в соседних файлах этой папки.
 */
const DOMAIN_ID = 'personnel-clearance';

let registered = false;

export function registerPersonnelClearanceMatrixDomain(): void {
  if (registered) return;
  registered = true;

  matrixDomainRegistry.registerDomain({
    id: DOMAIN_ID,
    labelKey: 'dict.menu:personnelClearance',
    icon: 'ShieldCheck',
  });

  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'worker-categories',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabWorkerCategories',
    icon: 'Users',
    referenceListId: 'worker-categories',
    order: 1,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'citizenships',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabCitizenships',
    icon: 'Globe2',
    referenceListId: 'citizenships',
    order: 2,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'professions',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabProfessions',
    icon: 'HardHat',
    referenceListId: 'professions',
    order: 3,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'positions',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabPositions',
    icon: 'Briefcase',
    referenceListId: 'positions',
    order: 4,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'work-types',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabWorkTypes',
    icon: 'Wrench',
    referenceListId: 'work-types',
    order: 5,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'projects',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabProjects',
    icon: 'FolderKanban',
    referenceListId: 'projects',
    order: 6,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'objects',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabObjects',
    icon: 'Boxes',
    referenceListId: 'objects',
    order: 7,
  });
  matrixCriteriaDimensionRegistry.registerDimension({
    id: 'contractors',
    domain: DOMAIN_ID,
    labelKey: 'dict.personnelClearance:tabOrganizations',
    icon: 'Building2',
    referenceListId: 'contractors',
    order: 8,
  });
}
