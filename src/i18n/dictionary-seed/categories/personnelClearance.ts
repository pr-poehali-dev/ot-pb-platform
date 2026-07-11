import { TermTuple } from '../types';

/**
 * Модуль «Предварительный допуск персонала» (namespace: dict.personnelClearance).
 * На этом этапе — только каркас: заголовок модуля, подзаголовок и подписи вкладок.
 * Бизнес-логика и содержимое вкладок будут добавлены отдельно.
 */
export const personnelClearanceTerms: TermTuple[] = [
  // Заголовок модуля
  ['moduleBadge', 'Personnel Pre-Clearance', 'Personnel Pre-Clearance', 'Персоналды алдын ала жіберу', 'Personel Ön Yetkilendirme', '人员预先准入'],
  ['moduleTitle', 'Предварительный допуск', 'Personnel Pre-', 'Персоналды алдын ала', 'Personel Ön', '人员预先'],
  ['moduleTitleHighlight', 'персонала', 'Clearance', 'жіберу', 'Yetkilendirme', '准入'],
  ['moduleSubtitle', 'Проверка и согласование допуска сотрудников и подрядчиков к работам на объектах.', 'Verification and approval of employee and contractor clearance for work on sites.', 'Қызметкерлер мен мердігерлердің объектілердегі жұмыстарға жіберілуін тексеру және келісу.', 'Çalışanların ve yüklenicilerin sahalardaki işlere yetkilendirilmesinin doğrulanması ve onaylanması.', '员工和承包商现场作业准入的核查与审批。'],

  // Вкладки модуля
  ['tabWorkers', 'Работники', 'Workers', 'Қызметкерлер', 'Çalışanlar', '员工'],
  ['tabClearancePackages', 'Пакеты допуска', 'Clearance Packages', 'Жіберу пакеттері', 'Yetkilendirme Paketleri', '准入包'],
  ['tabRequirementMatrices', 'Матрицы требований', 'Requirement Matrices', 'Талаптар матрицалары', 'Gereksinim Matrisleri', '要求矩阵'],
  ['tabApprovalRoutes', 'Маршруты согласования', 'Approval Routes', 'Келісу бағыттары', 'Onay Rotaları', '审批流程'],
  ['tabDocumentVerification', 'Проверка документов', 'Document Verification', 'Құжаттарды тексеру', 'Belge Doğrulama', '文件核查'],
  ['tabSecurityService', 'Служба безопасности', 'Security Service', 'Қауіпсіздік қызметі', 'Güvenlik Servisi', '安保部门'],
  ['tabHistory', 'История', 'History', 'Тарих', 'Geçmiş', '历史'],
  ['tabSettings', 'Настройки', 'Settings', 'Параметрлер', 'Ayarlar', '设置'],

  // Временный заголовок содержимого вкладок
  ['tabPlaceholder', 'Раздел «{{tab}}» находится в разработке', 'The "{{tab}}" section is under development', '«{{tab}}» бөлімі әзірленуде', '"{{tab}}" bölümü geliştirme aşamasında', '"{{tab}}"版块正在开发中'],

  // Измерения критериев матрицы требований (вкладки карточки матрицы, домен personnel-clearance)
  ['tabWorkerCategories', 'Категории работников', 'Worker Categories', 'Қызметкерлер санаттары', 'Çalışan Kategorileri', '员工类别'],
  ['tabCitizenships', 'Гражданство', 'Citizenship', 'Азаматтық', 'Vatandaşlık', '国籍'],
  ['tabProfessions', 'Профессии', 'Professions', 'Кәсіптер', 'Meslekler', '职业'],
  ['tabPositions', 'Должности', 'Positions', 'Лауазымдар', 'Pozisyonlar', '职位'],
  ['tabWorkTypes', 'Виды работ', 'Work Types', 'Жұмыс түрлері', 'İş Türleri', '工作类型'],
  ['tabProjects', 'Проекты', 'Projects', 'Жобалар', 'Projeler', '项目'],
  ['tabObjects', 'Объекты', 'Objects', 'Нысандар', 'Nesneler', '对象'],
  ['tabOrganizations', 'Организации (подрядчики)', 'Organizations (Contractors)', 'Ұйымдар (мердігерлер)', 'Kuruluşlar (Yükleniciler)', '组织（承包商）'],

  // Заглушки справочных списков Reference Data Engine для этого домена
  ['refWorkerCategories', 'Категории работников', 'Worker Categories', 'Қызметкерлер санаттары', 'Çalışan Kategorileri', '员工类别'],
  ['refCitizenships', 'Гражданство', 'Citizenship', 'Азаматтық', 'Vatandaşlık', '国籍'],
  ['refDocumentTypes', 'Типы документов допуска', 'Clearance Document Types', 'Жіберу құжаттарының түрлері', 'Yetkilendirme Belge Türleri', '准入文件类型'],
];