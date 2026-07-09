import { ReferenceListDefinition } from './types';

/**
 * Заглушки справочных списков для этапа архитектуры.
 *
 * ВАЖНО: это временные данные для демонстрации того, что Requirement Matrix
 * Engine работает через контракт Reference Data Engine, а не хранит списки
 * у себя. Когда появится реальный Reference Data Engine (синхронизация
 * с «Едиными справочниками» и другими источниками), этот файл будет удалён,
 * а registerList() будет вызываться реальными поставщиками данных —
 * ни один потребитель (карточка матрицы, будущие модули допуска техники,
 * подрядчиков и т.д.) при этом не изменится.
 */
export const STUB_REFERENCE_LISTS: ReferenceListDefinition[] = [
  {
    id: 'worker-categories',
    labelKey: 'dict.personnelClearance:refWorkerCategories',
    items: [
      { id: 'staff', label: 'Штатный персонал' },
      { id: 'contractor-personnel', label: 'Персонал подрядчика' },
      { id: 'visitor', label: 'Посетитель' },
      { id: 'temporary', label: 'Временный персонал' },
    ],
  },
  {
    id: 'citizenships',
    labelKey: 'dict.personnelClearance:refCitizenships',
    items: [
      { id: 'kz', label: 'Казахстан' },
      { id: 'ru', label: 'Россия' },
      { id: 'uz', label: 'Узбекистан' },
      { id: 'other', label: 'Другое' },
    ],
  },
  {
    id: 'professions',
    labelKey: 'dict.menu:professions',
    items: [
      { id: 'welder', label: 'Сварщик' },
      { id: 'electrician', label: 'Электромонтёр' },
      { id: 'crane-operator', label: 'Крановщик' },
    ],
  },
  {
    id: 'positions',
    labelKey: 'dict.menu:positions',
    items: [
      { id: 'foreman', label: 'Прораб' },
      { id: 'engineer', label: 'Инженер' },
      { id: 'safety-officer', label: 'Инженер по ОТ и ТБ' },
    ],
  },
  {
    id: 'work-types',
    labelKey: 'dict.menu:workTypes',
    items: [
      { id: 'height-works', label: 'Работы на высоте' },
      { id: 'hot-works', label: 'Огневые работы' },
      { id: 'confined-space', label: 'Работы в замкнутом пространстве' },
    ],
  },
  {
    id: 'projects',
    labelKey: 'dict.menu:projects',
    items: [
      { id: 'project-1', label: 'Проект «Северный»' },
      { id: 'project-2', label: 'Проект «Магистраль-2»' },
    ],
  },
  {
    id: 'objects',
    labelKey: 'dict.menu:objects',
    items: [
      { id: 'object-1', label: 'Объект №1' },
      { id: 'object-2', label: 'Объект №2' },
    ],
  },
  {
    id: 'contractors',
    labelKey: 'dict.menu:contractors',
    items: [
      { id: 'contractor-1', label: 'ТОО «СтройМонтаж»' },
      { id: 'contractor-2', label: 'ТОО «ПромСервис»' },
    ],
  },
  {
    id: 'document-types',
    labelKey: 'dict.personnelClearance:refDocumentTypes',
    items: [
      { id: 'safety-briefing-cert', label: 'Удостоверение о прохождении инструктажа по ОТ и ТБ' },
      { id: 'medical-exam-cert', label: 'Заключение медицинского осмотра' },
      { id: 'height-work-permit', label: 'Удостоверение допуска к работам на высоте' },
      { id: 'electrical-safety-cert', label: 'Удостоверение по электробезопасности' },
      { id: 'identity-document', label: 'Документ, удостоверяющий личность' },
    ],
  },
];