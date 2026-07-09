/**
 * Конфигурация вкладок модуля «Предварительный допуск персонала».
 * Только структура (id, ключ перевода, иконка, путь) — без бизнес-логики.
 * Каждая вкладка соответствует отдельной странице-заглушке в
 * src/pages/personnel-clearance/*.
 */
export interface PersonnelClearanceTab {
  id: string;
  labelKey: string;
  icon: string;
  path: string;
}

export const PERSONNEL_CLEARANCE_TABS: PersonnelClearanceTab[] = [
  { id: 'workers', labelKey: 'dict.personnelClearance:tabWorkers', icon: 'Users', path: 'workers' },
  { id: 'clearance-packages', labelKey: 'dict.personnelClearance:tabClearancePackages', icon: 'PackageCheck', path: 'clearance-packages' },
  { id: 'requirement-matrices', labelKey: 'dict.personnelClearance:tabRequirementMatrices', icon: 'Grid3x3', path: 'requirement-matrices' },
  { id: 'approval-routes', labelKey: 'dict.personnelClearance:tabApprovalRoutes', icon: 'Route', path: 'approval-routes' },
  { id: 'document-verification', labelKey: 'dict.personnelClearance:tabDocumentVerification', icon: 'FileSearch', path: 'document-verification' },
  { id: 'security-service', labelKey: 'dict.personnelClearance:tabSecurityService', icon: 'ShieldCheck', path: 'security-service' },
  { id: 'history', labelKey: 'dict.personnelClearance:tabHistory', icon: 'History', path: 'history' },
  { id: 'settings', labelKey: 'dict.personnelClearance:tabSettings', icon: 'Settings2', path: 'settings' },
];

export const DEFAULT_PERSONNEL_CLEARANCE_TAB = PERSONNEL_CLEARANCE_TABS[0].path;
