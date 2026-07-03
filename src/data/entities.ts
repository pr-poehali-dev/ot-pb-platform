export type LevelId = 'root' | 'organization' | 'company' | 'project' | 'object' | 'site' | 'contractor' | 'subdivision' | 'user';

export type EntityStatus = 'Активен' | 'В работе' | 'Черновик' | 'Архив';

export interface EntityDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface EntityHistoryEvent {
  id: string;
  action: string;
  author: string;
  date: string;
  icon: string;
}

export interface Node {
  id: string;
  level: LevelId;
  name: string;
  code: string;
  status?: EntityStatus;
  parentId: string | null;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  relatedUsers?: string[];
  documents?: EntityDocument[];
  history?: EntityHistoryEvent[];
}

export interface LevelMeta {
  id: LevelId;
  label: string;
  icon: string;
  childLabel: string | null;
}

export const LEVELS_META: LevelMeta[] = [
  { id: 'root', label: 'Noventra Core', icon: 'Hexagon', childLabel: 'Организации' },
  { id: 'organization', label: 'Организация (Tenant)', icon: 'Globe2', childLabel: 'Компании организации' },
  { id: 'company', label: 'Компания (Заказчик)', icon: 'Landmark', childLabel: 'Проекты компании' },
  { id: 'project', label: 'Проект', icon: 'FolderKanban', childLabel: 'Объекты проекта' },
  { id: 'object', label: 'Объект', icon: 'Boxes', childLabel: 'Строительные площадки объекта' },
  { id: 'site', label: 'Строительная площадка', icon: 'HardHat', childLabel: 'Подрядные организации площадки' },
  { id: 'contractor', label: 'Подрядная организация', icon: 'Handshake', childLabel: 'Подразделения подрядчика' },
  { id: 'subdivision', label: 'Подразделение подрядчика', icon: 'Network', childLabel: 'Пользователи подразделения' },
  { id: 'user', label: 'Пользователь', icon: 'User', childLabel: null },
];

const defaultDocs: EntityDocument[] = [
  { id: 'doc-1', name: 'Приказ о назначении ответственного.pdf', type: 'PDF', size: '312 КБ', uploadedAt: '20.01.2026' },
  { id: 'doc-2', name: 'Разрешение на производство работ.docx', type: 'DOCX', size: '148 КБ', uploadedAt: '24.01.2026' },
];

const defaultHistory: EntityHistoryEvent[] = [
  { id: 'h-1', action: 'Сущность создана', author: 'Иванов И. И.', date: '12.01.2026 09:14', icon: 'Sparkles' },
  { id: 'h-2', action: 'Изменён ответственный', author: 'Смирнова А. В.', date: '18.01.2026 15:02', icon: 'UserCog' },
  { id: 'h-3', action: 'Обновлён статус', author: 'Петров П. П.', date: '02.02.2026 11:47', icon: 'RefreshCcw' },
];

export const NODES: Node[] = [
  { id: 'root', level: 'root', name: 'Noventra Core', code: '—', parentId: null },

  { id: 'org-1', level: 'organization', name: 'Noventra Holding', code: 'ORG-001', status: 'Активен', parentId: 'root', owner: 'Иванов И. И.', createdAt: '05.01.2026', updatedAt: '02.03.2026', description: 'Головная организация (tenant) платформы — управляет всеми компаниями-заказчиками в рамках единого контура Noventra Core.', relatedUsers: ['Иванов И. И.', 'Петров П. П.'], documents: defaultDocs, history: defaultHistory },

  { id: 'cmp-1', level: 'company', name: 'ООО «СтройИнвест Групп»', code: 'CMP-001', status: 'Активен', parentId: 'org-1', owner: 'Иванов И. И.', createdAt: '12.01.2026', updatedAt: '02.03.2026', description: 'Генеральный заказчик по реконструкции энергетических объектов и строительству складской инфраструктуры.', relatedUsers: ['Иванов И. И.', 'Смирнова А. В.', 'Волкова Т. Н.'], documents: defaultDocs, history: defaultHistory },
  { id: 'cmp-2', level: 'company', name: 'АО «СевТрансСтрой»', code: 'CMP-002', status: 'Активен', parentId: 'org-1', owner: 'Петров П. П.', createdAt: '03.02.2026', updatedAt: '01.03.2026', description: 'Заказчик строительства логистических и складских комплексов.', relatedUsers: ['Петров П. П.', 'Кузнецов Д. С.'], documents: defaultDocs, history: defaultHistory },

  { id: 'prj-101', level: 'project', name: 'Реконструкция ГПП-12', code: 'PRJ-101', status: 'В работе', parentId: 'cmp-1', owner: 'Смирнова А. В.', createdAt: '15.01.2026', updatedAt: '28.02.2026', description: 'Реконструкция главной понизительной подстанции ГПП-12 с заменой оборудования РУ.', relatedUsers: ['Смирнова А. В.', 'Фёдоров Н. К.', 'Лебедев А. О.'], documents: defaultDocs, history: defaultHistory },
  { id: 'prj-103', level: 'project', name: 'Модернизация ЛЭП №7', code: 'PRJ-103', status: 'Черновик', parentId: 'cmp-1', owner: 'Волкова Т. Н.', createdAt: '02.02.2026', updatedAt: '02.02.2026', description: 'Модернизация линии электропередачи №7, замена опор и проводов.', relatedUsers: ['Волкова Т. Н.'], documents: defaultDocs, history: defaultHistory },
  { id: 'prj-102', level: 'project', name: 'Строительство склада №4', code: 'PRJ-102', status: 'Черновик', parentId: 'cmp-2', owner: 'Кузнецов Д. С.', createdAt: '20.02.2026', updatedAt: '20.02.2026', description: 'Строительство складского комплекса класса А общей площадью 12 000 м².', relatedUsers: ['Кузнецов Д. С.', 'Морозова Е. П.'], documents: defaultDocs, history: defaultHistory },

  { id: 'obj-201', level: 'object', name: 'Подстанция 110/10 кВ', code: 'OBJ-201', status: 'В работе', parentId: 'prj-101', owner: 'Фёдоров Н. К.', createdAt: '18.01.2026', updatedAt: '27.02.2026', description: 'Объект капитального строительства — понизительная подстанция 110/10 кВ.', relatedUsers: ['Фёдоров Н. К.', 'Волков С. И.'], documents: defaultDocs, history: defaultHistory },
  { id: 'obj-203', level: 'object', name: 'РУ-10 кВ Корпус 2', code: 'OBJ-203', status: 'Черновик', parentId: 'prj-101', owner: 'Лебедев А. О.', createdAt: '22.01.2026', updatedAt: '22.01.2026', description: 'Распределительное устройство 10 кВ в корпусе 2.', relatedUsers: ['Лебедев А. О.'], documents: defaultDocs, history: defaultHistory },
  { id: 'obj-204', level: 'object', name: 'Опора №12', code: 'OBJ-204', status: 'Черновик', parentId: 'prj-103', owner: 'Волкова Т. Н.', createdAt: '05.02.2026', updatedAt: '05.02.2026', description: 'Опора линии электропередачи №12 в составе ЛЭП №7.', relatedUsers: ['Волкова Т. Н.'], documents: defaultDocs, history: defaultHistory },
  { id: 'obj-202', level: 'object', name: 'Складской корпус А', code: 'OBJ-202', status: 'Активен', parentId: 'prj-102', owner: 'Морозова Е. П.', createdAt: '25.02.2026', updatedAt: '01.03.2026', description: 'Складской корпус А, первая очередь строительства.', relatedUsers: ['Морозова Е. П.'], documents: defaultDocs, history: defaultHistory },

  { id: 'site-301', level: 'site', name: 'Площадка №1 (Северная)', code: 'SITE-301', status: 'Активен', parentId: 'obj-201', owner: 'Волков С. И.', createdAt: '22.01.2026', updatedAt: '26.02.2026', description: 'Северная строительная площадка объекта «Подстанция 110/10 кВ».', relatedUsers: ['Волков С. И.', 'Соколов В. Г.'], documents: defaultDocs, history: defaultHistory },
  { id: 'site-303', level: 'site', name: 'Площадка №3 (Южная)', code: 'SITE-303', status: 'В работе', parentId: 'obj-201', owner: 'Игнатьев Р. В.', createdAt: '27.01.2026', updatedAt: '20.02.2026', description: 'Южная строительная площадка объекта «Подстанция 110/10 кВ».', relatedUsers: ['Игнатьев Р. В.'], documents: defaultDocs, history: defaultHistory },
  { id: 'site-304', level: 'site', name: 'Площадка №4', code: 'SITE-304', status: 'Черновик', parentId: 'obj-203', owner: 'Лебедев А. О.', createdAt: '24.01.2026', updatedAt: '24.01.2026', description: 'Площадка обслуживания РУ-10 кВ Корпус 2.', relatedUsers: ['Лебедев А. О.'], documents: defaultDocs, history: defaultHistory },
  { id: 'site-302', level: 'site', name: 'Площадка №2 (Складская)', code: 'SITE-302', status: 'В работе', parentId: 'obj-202', owner: 'Никитина О. А.', createdAt: '01.03.2026', updatedAt: '03.03.2026', description: 'Строительная площадка складского корпуса А.', relatedUsers: ['Никитина О. А.', 'Егорова М. В.'], documents: defaultDocs, history: defaultHistory },

  { id: 'ctr-401', level: 'contractor', name: 'ООО «ЭнергоМонтаж»', code: 'CTR-401', status: 'Активен', parentId: 'site-301', owner: 'Соколов В. Г.', createdAt: '25.01.2026', updatedAt: '28.02.2026', description: 'Подрядная организация, выполняющая электромонтажные работы.', relatedUsers: ['Соколов В. Г.', 'Тарасов К. Л.', 'Пахомов Г. И.'], documents: defaultDocs, history: defaultHistory },
  { id: 'ctr-403', level: 'contractor', name: 'ООО «ЭлектроСервис»', code: 'CTR-403', status: 'Активен', parentId: 'site-301', owner: 'Гришина Н. Д.', createdAt: '29.01.2026', updatedAt: '15.02.2026', description: 'Подрядчик по пусконаладочным работам.', relatedUsers: ['Гришина Н. Д.'], documents: defaultDocs, history: defaultHistory },
  { id: 'ctr-404', level: 'contractor', name: 'ООО «ГидроСтрой»', code: 'CTR-404', status: 'Черновик', parentId: 'site-303', owner: 'Игнатьев Р. В.', createdAt: '30.01.2026', updatedAt: '30.01.2026', description: 'Подрядчик по гидроизоляционным работам.', relatedUsers: ['Игнатьев Р. В.'], documents: defaultDocs, history: defaultHistory },
  { id: 'ctr-402', level: 'contractor', name: 'ООО «СтройБыстрой»', code: 'CTR-402', status: 'Активен', parentId: 'site-302', owner: 'Егорова М. В.', createdAt: '03.03.2026', updatedAt: '05.03.2026', description: 'Генеральный подрядчик строительства складского корпуса А.', relatedUsers: ['Егорова М. В.', 'Белова Ю. Н.'], documents: defaultDocs, history: defaultHistory },

  { id: 'sub-501', level: 'subdivision', name: 'Бригада электромонтажников №2', code: 'SUB-501', status: 'В работе', parentId: 'ctr-401', owner: 'Тарасов К. Л.', createdAt: '28.01.2026', updatedAt: '27.02.2026', description: 'Бригада, выполняющая электромонтажные работы на площадке №1.', relatedUsers: ['Тарасов К. Л.', 'Дмитриев А. С.', 'Кузьмин П. Р.'], documents: defaultDocs, history: defaultHistory },
  { id: 'sub-503', level: 'subdivision', name: 'Бригада сварщиков', code: 'SUB-503', status: 'Активен', parentId: 'ctr-401', owner: 'Пахомов Г. И.', createdAt: '01.02.2026', updatedAt: '20.02.2026', description: 'Бригада сварочных работ металлоконструкций.', relatedUsers: ['Пахомов Г. И.', 'Ткачёв О. М.'], documents: defaultDocs, history: defaultHistory },
  { id: 'sub-504', level: 'subdivision', name: 'Участок наладки', code: 'SUB-504', status: 'Черновик', parentId: 'ctr-403', owner: 'Гришина Н. Д.', createdAt: '02.02.2026', updatedAt: '02.02.2026', description: 'Участок пусконаладочных работ оборудования РУ.', relatedUsers: ['Гришина Н. Д.', 'Панов И. С.'], documents: defaultDocs, history: defaultHistory },
  { id: 'sub-502', level: 'subdivision', name: 'Участок каменщиков', code: 'SUB-502', status: 'Активен', parentId: 'ctr-402', owner: 'Белова Ю. Н.', createdAt: '05.03.2026', updatedAt: '06.03.2026', description: 'Участок каменных и общестроительных работ.', relatedUsers: ['Белова Ю. Н.', 'Романова В. И.'], documents: defaultDocs, history: defaultHistory },

  { id: 'usr-601', level: 'user', name: 'Дмитриев А. С.', code: 'USR-601', status: 'Активен', parentId: 'sub-501', owner: 'Тарасов К. Л.', createdAt: '29.01.2026', updatedAt: '29.01.2026', description: 'Электромонтажник 5-го разряда.', relatedUsers: ['Тарасов К. Л.'], documents: defaultDocs, history: defaultHistory },
  { id: 'usr-603', level: 'user', name: 'Кузьмин П. Р.', code: 'USR-603', status: 'Активен', parentId: 'sub-501', owner: 'Тарасов К. Л.', createdAt: '30.01.2026', updatedAt: '30.01.2026', description: 'Электромонтажник 4-го разряда.', relatedUsers: ['Тарасов К. Л.'], documents: defaultDocs, history: defaultHistory },
  { id: 'usr-604', level: 'user', name: 'Ткачёв О. М.', code: 'USR-604', status: 'Активен', parentId: 'sub-503', owner: 'Пахомов Г. И.', createdAt: '03.02.2026', updatedAt: '03.02.2026', description: 'Сварщик 6-го разряда.', relatedUsers: ['Пахомов Г. И.'], documents: defaultDocs, history: defaultHistory },
  { id: 'usr-605', level: 'user', name: 'Панов И. С.', code: 'USR-605', status: 'Черновик', parentId: 'sub-504', owner: 'Гришина Н. Д.', createdAt: '04.02.2026', updatedAt: '04.02.2026', description: 'Инженер по наладке оборудования.', relatedUsers: ['Гришина Н. Д.'], documents: defaultDocs, history: defaultHistory },
  { id: 'usr-602', level: 'user', name: 'Романова В. И.', code: 'USR-602', status: 'Активен', parentId: 'sub-502', owner: 'Белова Ю. Н.', createdAt: '06.03.2026', updatedAt: '06.03.2026', description: 'Каменщик 4-го разряда.', relatedUsers: ['Белова Ю. Н.'], documents: defaultDocs, history: defaultHistory },
];

export const statusTone: Record<string, string> = {
  'Активен': 'text-primary border-primary/30 bg-primary/10',
  'В работе': 'text-accent border-accent/30 bg-accent/10',
  'Черновик': 'text-muted-foreground border-border bg-secondary/60',
  'Архив': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

export const getNode = (id: string) => NODES.find((n) => n.id === id)!;
export const getChildren = (id: string) => NODES.filter((n) => n.parentId === id);
export const getMeta = (level: LevelId) => LEVELS_META.find((l) => l.id === level)!;
export const getPath = (id: string): Node[] => {
  const path: Node[] = [];
  let current: Node | undefined = getNode(id);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getNode(current.parentId) : undefined;
  }
  return path;
};