/**
 * Reference Data Engine — будущий единый движок справочных данных Noventra Core.
 *
 * На этом этапе — минимальный каркас, достаточный для того, чтобы Requirement
 * Matrix Engine (и любые будущие модули) получали списки значений (профессии,
 * должности, гражданства, объекты, подрядчики и т.д.) через единый контракт,
 * а не хранили их у себя.
 *
 * Состав:
 *  - types.ts                  — ReferenceListDefinition/ReferenceItem/ReferenceListId
 *  - referenceListRegistry.ts   — реестр списков: registerList()/getList()/getItems()/listAll()
 *  - stubLists.ts               — временные заглушки списков (см. комментарий в файле);
 *                                будут заменены реальными источниками данных без
 *                                изменения контракта и потребителей
 *  - useReferenceList.ts        — React-хук для компонентов
 *  - registerStubReferenceLists() — регистрирует заглушки один раз при старте приложения
 */
import { referenceListRegistry } from './referenceListRegistry';
import { STUB_REFERENCE_LISTS } from './stubLists';

let registered = false;

/** Регистрирует временные заглушки справочных списков (см. stubLists.ts). */
export function registerStubReferenceLists(): void {
  if (registered) return;
  registered = true;

  STUB_REFERENCE_LISTS.forEach((list) => referenceListRegistry.registerList(list));
}

export * from './types';
export { referenceListRegistry } from './referenceListRegistry';
export { useReferenceList } from './useReferenceList';
