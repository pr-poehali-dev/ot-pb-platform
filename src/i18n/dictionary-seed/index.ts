import { dictionaryService } from '@/core';
import { buildTerms } from './types';
import { uiTerms } from './categories/ui';
import { menuTerms } from './categories/menu';
import { buttonsTerms } from './categories/buttons';
import { statusesTerms } from './categories/statuses';
import { rolesTerms } from './categories/roles';
import { dictionariesTerms } from './categories/dictionaries';
import { documentsTerms } from './categories/documents';
import { hseTerms } from './categories/hse';
import { constructionTerms } from './categories/construction';
import { industrialSafetyTerms } from './categories/industrialSafety';
import { laborProtectionTerms } from './categories/laborProtection';
import { environmentTerms } from './categories/environment';
import { fireSafetyTerms } from './categories/fireSafety';
import { contractorsTerms } from './categories/contractors';
import { equipmentTerms } from './categories/equipment';
import { investigationsTerms } from './categories/investigations';
import { inspectionsTerms } from './categories/inspections';
import { analyticsTerms } from './categories/analytics';
import { formsTerms } from './categories/forms';
import { tablesTerms } from './categories/tables';
import { notificationsTerms } from './categories/notifications';
import { errorsTerms } from './categories/errors';
import { trainingTerms } from './categories/training';
import { accessTerms } from './categories/access';
import { organizationStructureTerms } from './categories/organizationStructure';
import { projectManagementTerms } from './categories/projectManagement';
import { timeTerms } from './categories/timeAndDate';
import { meetingsTerms } from './categories/meetings';
import { permitsTerms } from './categories/permits';
import { generalTerms } from './categories/general';
import { riskManagementTerms } from './categories/riskManagement';
import { qualityManagementTerms } from './categories/qualityManagement';
import { appTexts } from './categories/appTexts';
import { hierarchyLevelsTerms } from './categories/hierarchyLevels';
import { dictionaryCategoriesTerms } from './categories/dictionaryCategories';
import { dictionaryMetaTerms } from './categories/dictionaryMeta';
import { aiEngineTerms } from './categories/aiEngine';
import { businessRulesTerms } from './categories/businessRules';
import { personnelClearanceTerms } from './categories/personnelClearance';
import { requirementMatrixTerms } from './categories/requirementMatrix';
import { clearancePackageTerms } from './categories/clearancePackage';

/**
 * Базовый словарь Translation Management — центрального словаря переводов
 * платформы Noventra. Загружается один раз при старте приложения через
 * dictionaryService.bulkImport(), что автоматически синхронизирует переводы
 * в существующий translationRegistry Language Engine (без изменения его кода).
 *
 * Каждая категория — отдельный namespace вида "dict.<категория>", что позволяет
 * любому будущему модулю ссылаться на нужные термины через useTranslate(),
 * например t('dict.hse:hazard') или t('dict.buttons:save').
 */
let seeded = false;

export function seedTranslationDictionary(): void {
  if (seeded) return;
  seeded = true;

  dictionaryService.bulkImport([
    ...buildTerms('dict.ui', uiTerms),
    ...buildTerms('dict.menu', menuTerms),
    ...buildTerms('dict.buttons', buttonsTerms),
    ...buildTerms('dict.statuses', statusesTerms),
    ...buildTerms('dict.roles', rolesTerms),
    ...buildTerms('dict.dictionaries', dictionariesTerms),
    ...buildTerms('dict.documents', documentsTerms),
    ...buildTerms('dict.hse', hseTerms),
    ...buildTerms('dict.construction', constructionTerms),
    ...buildTerms('dict.industrialSafety', industrialSafetyTerms),
    ...buildTerms('dict.laborProtection', laborProtectionTerms),
    ...buildTerms('dict.environment', environmentTerms),
    ...buildTerms('dict.fireSafety', fireSafetyTerms),
    ...buildTerms('dict.contractors', contractorsTerms),
    ...buildTerms('dict.equipment', equipmentTerms),
    ...buildTerms('dict.investigations', investigationsTerms),
    ...buildTerms('dict.inspections', inspectionsTerms),
    ...buildTerms('dict.analytics', analyticsTerms),
    ...buildTerms('dict.forms', formsTerms),
    ...buildTerms('dict.tables', tablesTerms),
    ...buildTerms('dict.notifications', notificationsTerms),
    ...buildTerms('dict.errors', errorsTerms),
    ...buildTerms('dict.training', trainingTerms),
    ...buildTerms('dict.access', accessTerms),
    ...buildTerms('dict.orgStructure', organizationStructureTerms),
    ...buildTerms('dict.projectManagement', projectManagementTerms),
    ...buildTerms('dict.time', timeTerms),
    ...buildTerms('dict.meetings', meetingsTerms),
    ...buildTerms('dict.permits', permitsTerms),
    ...buildTerms('dict.general', generalTerms),
    ...buildTerms('dict.riskManagement', riskManagementTerms),
    ...buildTerms('dict.quality', qualityManagementTerms),
    ...buildTerms('dict.app', appTexts),
    ...buildTerms('dict.levels', hierarchyLevelsTerms),
    ...buildTerms('dict.dictCategories', dictionaryCategoriesTerms),
    ...buildTerms('dict.dictMeta', dictionaryMetaTerms),
    ...buildTerms('ai-engine', aiEngineTerms),
    ...buildTerms('dict.businessRules', businessRulesTerms),
    ...buildTerms('dict.personnelClearance', personnelClearanceTerms),
    ...buildTerms('dict.requirementMatrix', requirementMatrixTerms),
    ...buildTerms('dict.clearancePackage', clearancePackageTerms),
  ]);
}

export const DICTIONARY_CATEGORY_COUNTS: Record<string, number> = {
  'dict.ui': uiTerms.length,
  'dict.menu': menuTerms.length,
  'dict.buttons': buttonsTerms.length,
  'dict.statuses': statusesTerms.length,
  'dict.roles': rolesTerms.length,
  'dict.dictionaries': dictionariesTerms.length,
  'dict.documents': documentsTerms.length,
  'dict.hse': hseTerms.length,
  'dict.construction': constructionTerms.length,
  'dict.industrialSafety': industrialSafetyTerms.length,
  'dict.laborProtection': laborProtectionTerms.length,
  'dict.environment': environmentTerms.length,
  'dict.fireSafety': fireSafetyTerms.length,
  'dict.contractors': contractorsTerms.length,
  'dict.equipment': equipmentTerms.length,
  'dict.investigations': investigationsTerms.length,
  'dict.inspections': inspectionsTerms.length,
  'dict.analytics': analyticsTerms.length,
  'dict.forms': formsTerms.length,
  'dict.tables': tablesTerms.length,
  'dict.notifications': notificationsTerms.length,
  'dict.errors': errorsTerms.length,
  'dict.training': trainingTerms.length,
  'dict.access': accessTerms.length,
  'dict.orgStructure': organizationStructureTerms.length,
  'dict.projectManagement': projectManagementTerms.length,
  'dict.time': timeTerms.length,
  'dict.meetings': meetingsTerms.length,
  'dict.permits': permitsTerms.length,
  'dict.general': generalTerms.length,
  'dict.riskManagement': riskManagementTerms.length,
  'dict.quality': qualityManagementTerms.length,
  'dict.app': appTexts.length,
  'dict.levels': hierarchyLevelsTerms.length,
  'dict.dictCategories': dictionaryCategoriesTerms.length,
  'dict.dictMeta': dictionaryMetaTerms.length,
  'ai-engine': aiEngineTerms.length,
  'dict.businessRules': businessRulesTerms.length,
  'dict.personnelClearance': personnelClearanceTerms.length,
  'dict.requirementMatrix': requirementMatrixTerms.length,
  'dict.clearancePackage': clearancePackageTerms.length,
};

export const TOTAL_DICTIONARY_TERMS = Object.values(DICTIONARY_CATEGORY_COUNTS).reduce((sum, n) => sum + n, 0);