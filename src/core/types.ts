/**
 * Общие типы ядра Noventra Core Engine.
 * EntityRef — универсальная ссылка на любую сущность любого будущего модуля платформы.
 * Ядро ничего не знает о конкретных типах сущностей (компания, проект, нарушение и т.д.) —
 * модули сами определяют строку `type` (например, 'dictionary:companies', 'hierarchy:project').
 */
export interface EntityRef {
  type: string;
  id: string;
}

export type ISODateString = string;
