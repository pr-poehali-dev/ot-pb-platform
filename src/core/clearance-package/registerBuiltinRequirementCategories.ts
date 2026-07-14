import { requirementCategoryRegistry } from './requirementCategoryRegistry';

/**
 * Регистрация базовых категорий требований Пакета допуска (п.3 ТЗ):
 * документы, обучение, медосмотры, квалификация, требования Службы
 * безопасности, требования склада СИЗ. Это только архитектура хранения —
 * сами требования (проверка, загрузка документов) не реализуются.
 *
 * Новая категория добавляется по этому же образцу — без изменения структуры
 * ClearancePackage/PackageRequirement.
 */
let registered = false;

export function registerBuiltinRequirementCategories(): void {
  if (registered) return;
  registered = true;

  requirementCategoryRegistry.registerCategory({
    id: 'documents',
    labelKey: 'dict.clearancePackage:categoryDocuments',
    icon: 'FileText',
  });
  requirementCategoryRegistry.registerCategory({
    id: 'training',
    labelKey: 'dict.clearancePackage:categoryTraining',
    icon: 'GraduationCap',
  });
  requirementCategoryRegistry.registerCategory({
    id: 'medical-exams',
    labelKey: 'dict.clearancePackage:categoryMedicalExams',
    icon: 'Stethoscope',
  });
  requirementCategoryRegistry.registerCategory({
    id: 'qualification',
    labelKey: 'dict.clearancePackage:categoryQualification',
    icon: 'Award',
  });
  requirementCategoryRegistry.registerCategory({
    id: 'security-requirements',
    labelKey: 'dict.clearancePackage:categorySecurityRequirements',
    icon: 'ShieldAlert',
  });
  requirementCategoryRegistry.registerCategory({
    id: 'ppe-warehouse',
    labelKey: 'dict.clearancePackage:categoryPpeWarehouse',
    icon: 'HardHat',
  });
}
