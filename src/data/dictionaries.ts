export type DictionaryStatus = 'Активен' | 'Черновик' | 'Архив';

export interface DictionaryField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

export interface DictionaryItem {
  id: string;
  code: string;
  name: string;
  status: DictionaryStatus;
  owner: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  [key: string]: unknown;
}

export interface DictionaryConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  codePrefix: string;
  fields: DictionaryField[];
  seed: DictionaryItem[];
}

const baseFields: DictionaryField[] = [
  { key: 'name', label: 'Название', type: 'text', required: true },
  { key: 'code', label: 'Код', type: 'text', required: true },
  { key: 'owner', label: 'Ответственный', type: 'text', required: true },
  { key: 'description', label: 'Описание', type: 'textarea' },
];

export const DICTIONARIES: DictionaryConfig[] = [
  {
    id: 'organizations',
    title: 'Организации',
    icon: 'Globe2',
    description: 'Организации (tenant) верхнего уровня платформы',
    codePrefix: 'ORG',
    fields: baseFields,
    seed: [
      { id: 'org-1', code: 'ORG-001', name: 'Noventra Holding', status: 'Активен', owner: 'Иванов И. И.', createdAt: '05.01.2026', updatedAt: '02.03.2026', description: 'Головная организация платформы.' },
    ],
  },
  {
    id: 'companies',
    title: 'Компании (Заказчики)',
    icon: 'Landmark',
    description: 'Юридические лица-заказчики в составе организаций',
    codePrefix: 'CMP',
    fields: baseFields,
    seed: [
      { id: 'cmp-1', code: 'CMP-001', name: 'ООО «СтройИнвест Групп»', status: 'Активен', owner: 'Иванов И. И.', createdAt: '12.01.2026', updatedAt: '02.03.2026', description: 'Генеральный заказчик реконструкции.' },
      { id: 'cmp-2', code: 'CMP-002', name: 'АО «СевТрансСтрой»', status: 'Активен', owner: 'Петров П. П.', createdAt: '03.02.2026', updatedAt: '01.03.2026', description: 'Заказчик складской инфраструктуры.' },
    ],
  },
  {
    id: 'projects',
    title: 'Проекты',
    icon: 'FolderKanban',
    description: 'Проекты в рамках компаний-заказчиков',
    codePrefix: 'PRJ',
    fields: baseFields,
    seed: [
      { id: 'prj-101', code: 'PRJ-101', name: 'Реконструкция ГПП-12', status: 'Активен', owner: 'Смирнова А. В.', createdAt: '15.01.2026', updatedAt: '28.02.2026', description: 'Реконструкция подстанции.' },
      { id: 'prj-102', code: 'PRJ-102', name: 'Строительство склада №4', status: 'Черновик', owner: 'Кузнецов Д. С.', createdAt: '20.02.2026', updatedAt: '20.02.2026', description: 'Складской комплекс класса А.' },
    ],
  },
  {
    id: 'objects',
    title: 'Объекты',
    icon: 'Boxes',
    description: 'Объекты капитального строительства',
    codePrefix: 'OBJ',
    fields: baseFields,
    seed: [
      { id: 'obj-201', code: 'OBJ-201', name: 'Подстанция 110/10 кВ', status: 'Активен', owner: 'Фёдоров Н. К.', createdAt: '18.01.2026', updatedAt: '27.02.2026', description: 'Понизительная подстанция.' },
      { id: 'obj-202', code: 'OBJ-202', name: 'Складской корпус А', status: 'Активен', owner: 'Морозова Е. П.', createdAt: '25.02.2026', updatedAt: '01.03.2026', description: 'Первая очередь склада.' },
    ],
  },
  {
    id: 'sites',
    title: 'Строительные площадки',
    icon: 'HardHat',
    description: 'Территории проведения строительных работ',
    codePrefix: 'SITE',
    fields: baseFields,
    seed: [
      { id: 'site-301', code: 'SITE-301', name: 'Площадка №1 (Северная)', status: 'Активен', owner: 'Волков С. И.', createdAt: '22.01.2026', updatedAt: '26.02.2026', description: 'Северная площадка.' },
      { id: 'site-302', code: 'SITE-302', name: 'Площадка №2 (Складская)', status: 'Активен', owner: 'Никитина О. А.', createdAt: '01.03.2026', updatedAt: '03.03.2026', description: 'Складская площадка.' },
    ],
  },
  {
    id: 'contractors',
    title: 'Подрядные организации',
    icon: 'Handshake',
    description: 'Организации-исполнители работ на площадках',
    codePrefix: 'CTR',
    fields: baseFields,
    seed: [
      { id: 'ctr-401', code: 'CTR-401', name: 'ООО «ЭнергоМонтаж»', status: 'Активен', owner: 'Соколов В. Г.', createdAt: '25.01.2026', updatedAt: '28.02.2026', description: 'Электромонтажные работы.' },
      { id: 'ctr-402', code: 'CTR-402', name: 'ООО «СтройБыстрой»', status: 'Активен', owner: 'Егорова М. В.', createdAt: '03.03.2026', updatedAt: '05.03.2026', description: 'Генеральный подрядчик.' },
    ],
  },
  {
    id: 'subdivisions',
    title: 'Подразделения подрядчиков',
    icon: 'Network',
    description: 'Бригады и участки подрядных организаций',
    codePrefix: 'SUB',
    fields: baseFields,
    seed: [
      { id: 'sub-501', code: 'SUB-501', name: 'Бригада электромонтажников №2', status: 'Активен', owner: 'Тарасов К. Л.', createdAt: '28.01.2026', updatedAt: '27.02.2026', description: 'Электромонтажные работы.' },
      { id: 'sub-502', code: 'SUB-502', name: 'Участок каменщиков', status: 'Активен', owner: 'Белова Ю. Н.', createdAt: '05.03.2026', updatedAt: '06.03.2026', description: 'Каменные работы.' },
    ],
  },
  {
    id: 'users',
    title: 'Пользователи',
    icon: 'User',
    description: 'Учётные записи сотрудников платформы',
    codePrefix: 'USR',
    fields: baseFields,
    seed: [
      { id: 'usr-601', code: 'USR-601', name: 'Дмитриев А. С.', status: 'Активен', owner: 'Тарасов К. Л.', createdAt: '29.01.2026', updatedAt: '29.01.2026', description: 'Электромонтажник 5-го разряда.' },
      { id: 'usr-602', code: 'USR-602', name: 'Романова В. И.', status: 'Активен', owner: 'Белова Ю. Н.', createdAt: '06.03.2026', updatedAt: '06.03.2026', description: 'Каменщик 4-го разряда.' },
    ],
  },
  {
    id: 'positions',
    title: 'Должности',
    icon: 'BriefcaseBusiness',
    description: 'Штатные должности сотрудников',
    codePrefix: 'POS',
    fields: baseFields,
    seed: [
      { id: 'pos-1', code: 'POS-001', name: 'Инженер по охране труда', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'pos-2', code: 'POS-002', name: 'Производитель работ', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'professions',
    title: 'Профессии',
    icon: 'HardHat',
    description: 'Рабочие профессии на объектах',
    codePrefix: 'PRF',
    fields: baseFields,
    seed: [
      { id: 'prf-1', code: 'PRF-001', name: 'Электромонтажник', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'prf-2', code: 'PRF-002', name: 'Сварщик', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'work-types',
    title: 'Виды работ',
    icon: 'Wrench',
    description: 'Классификатор выполняемых видов работ',
    codePrefix: 'WRK',
    fields: baseFields,
    seed: [
      { id: 'wrk-1', code: 'WRK-001', name: 'Электромонтажные работы', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'wrk-2', code: 'WRK-002', name: 'Работы на высоте', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'equipment-types',
    title: 'Типы техники',
    icon: 'Truck',
    description: 'Спецтехника и оборудование',
    codePrefix: 'EQP',
    fields: baseFields,
    seed: [
      { id: 'eqp-1', code: 'EQP-001', name: 'Автокран', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'eqp-2', code: 'EQP-002', name: 'Экскаватор', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'document-categories',
    title: 'Категории документов',
    icon: 'FileText',
    description: 'Классификатор типов документов платформы',
    codePrefix: 'DOC',
    fields: baseFields,
    seed: [
      { id: 'doc-1', code: 'DOC-001', name: 'Приказ', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'doc-2', code: 'DOC-002', name: 'Разрешение на работы', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'violation-types',
    title: 'Типы нарушений',
    icon: 'TriangleAlert',
    description: 'Классификатор нарушений ОТ и ПБ',
    codePrefix: 'VIO',
    fields: baseFields,
    seed: [
      { id: 'vio-1', code: 'VIO-001', name: 'Отсутствие СИЗ', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'vio-2', code: 'VIO-002', name: 'Нарушение схемы ограждения', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'risk-categories',
    title: 'Категории рисков',
    icon: 'ShieldAlert',
    description: 'Классификатор производственных рисков',
    codePrefix: 'RSK',
    fields: baseFields,
    seed: [
      { id: 'rsk-1', code: 'RSK-001', name: 'Падение с высоты', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'rsk-2', code: 'RSK-002', name: 'Поражение электротоком', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'ppe',
    title: 'СИЗ',
    icon: 'HardHat',
    description: 'Средства индивидуальной защиты',
    codePrefix: 'PPE',
    fields: baseFields,
    seed: [
      { id: 'ppe-1', code: 'PPE-001', name: 'Каска защитная', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'ppe-2', code: 'PPE-002', name: 'Страховочная привязь', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'responsibility-zones',
    title: 'Зоны ответственности',
    icon: 'MapPinned',
    description: 'Привязка людей к объектам и участкам',
    codePrefix: 'ZON',
    fields: baseFields,
    seed: [
      { id: 'zon-1', code: 'ZON-001', name: 'Зона №1 — Северная площадка', status: 'Активен', owner: 'Волков С. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'zon-2', code: 'ZON-002', name: 'Зона №2 — Складская площадка', status: 'Активен', owner: 'Никитина О. А.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'statuses',
    title: 'Статусы',
    icon: 'CircleDot',
    description: 'Статусы объектов и процессов платформы',
    codePrefix: 'STS',
    fields: baseFields,
    seed: [
      { id: 'sts-1', code: 'STS-001', name: 'Активен', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'sts-2', code: 'STS-002', name: 'В работе', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'reasons',
    title: 'Причины',
    icon: 'MessageSquareWarning',
    description: 'Классификатор причин событий и решений',
    codePrefix: 'RSN',
    fields: baseFields,
    seed: [
      { id: 'rsn-1', code: 'RSN-001', name: 'Плановая проверка', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'rsn-2', code: 'RSN-002', name: 'Внеплановая проверка', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
  {
    id: 'classifiers',
    title: 'Классификаторы',
    icon: 'ListTree',
    description: 'Общие классификаторы платформы',
    codePrefix: 'CLS',
    fields: baseFields,
    seed: [
      { id: 'cls-1', code: 'CLS-001', name: 'ОКВЭД', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
      { id: 'cls-2', code: 'CLS-002', name: 'ОКПД2', status: 'Активен', owner: 'Иванов И. И.', createdAt: '10.01.2026', updatedAt: '10.01.2026' },
    ],
  },
];

export const statusTone: Record<DictionaryStatus, string> = {
  'Активен': 'text-primary border-primary/30 bg-primary/10',
  'Черновик': 'text-muted-foreground border-border bg-secondary/60',
  'Архив': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

export const getDictionaryConfig = (id: string) => DICTIONARIES.find((d) => d.id === id);
