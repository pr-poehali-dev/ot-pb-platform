import { EntityStatus } from '@/data/entities';
import { DictionaryStatus } from '@/data/dictionaries';

/**
 * Сопоставление внутренних (русских) значений статусов с ключами
 * словаря Translation Management (namespace dict.statuses).
 * Данные (EntityStatus/DictionaryStatus) остаются как есть — переводится
 * только отображение в UI через t(`dict.statuses:${key}`).
 */
export const ENTITY_STATUS_KEY: Record<EntityStatus, string> = {
  'Активен': 'active',
  'В работе': 'inProgress',
  'Черновик': 'draft',
  'Архив': 'archived',
};

export const DICTIONARY_STATUS_KEY: Record<DictionaryStatus, string> = {
  'Активен': 'active',
  'Черновик': 'draft',
  'Архив': 'archived',
};
