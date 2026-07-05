import { LevelId } from '@/data/entities';

/**
 * Хелперы ключей словаря Translation Management для уровней иерархии
 * (namespace dict.levels, см. src/i18n/dictionary-seed/categories/hierarchyLevels.ts).
 */
const CHILD_KEY: Record<LevelId, string> = {
  root: 'childRoot',
  organization: 'childOrganization',
  company: 'childCompany',
  project: 'childProject',
  object: 'childObject',
  site: 'childSite',
  contractor: 'childContractor',
  subdivision: 'childSubdivision',
  user: '',
};

export const levelLabelKey = (level: LevelId) => `dict.levels:${level}`;
export const levelChildLabelKey = (level: LevelId) => (CHILD_KEY[level] ? `dict.levels:${CHILD_KEY[level]}` : null);
