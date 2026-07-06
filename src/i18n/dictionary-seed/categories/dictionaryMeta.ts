import { TermTuple } from '../types';

/**
 * Переводы названий и описаний конкретных справочников платформы
 * (namespace: dict.dictMeta). Ключи вида "<id>Title" / "<id>Desc",
 * где <id> — идентификатор справочника из src/data/dictionaries.ts (DICTIONARIES).
 * Используется вместе с src/i18n/dictionaryMetaKeys.ts.
 */
export const dictionaryMetaTerms: TermTuple[] = [
  // Организационная структура
  ['organizationsTitle', 'Организации', 'Organizations', 'Ұйымдар', 'Kuruluşlar', '组织'],
  ['organizationsDesc', 'Организации (tenant) верхнего уровня платформы', 'Top-level organizations (tenants) of the platform', 'Платформаның жоғарғы деңгейдегі ұйымдары (tenant)', 'Platformun üst düzey kuruluşları (tenant)', '平台顶层组织（租户）'],
  ['companiesTitle', 'Компании (Заказчики)', 'Companies (Customers)', 'Компаниялар (Тапсырыс берушілер)', 'Şirketler (Müşteriler)', '公司（客户）'],
  ['companiesDesc', 'Юридические лица-заказчики в составе организаций', 'Customer legal entities within organizations', 'Ұйымдар құрамындағы тапсырыс беруші заңды тұлғалар', 'Kuruluşlar bünyesindeki müşteri tüzel kişiler', '组织内的客户法人实体'],
  ['projectsTitle', 'Проекты', 'Projects', 'Жобалар', 'Projeler', '项目'],
  ['projectsDesc', 'Проекты в рамках компаний-заказчиков', 'Projects within customer companies', 'Тапсырыс беруші компаниялар аясындағы жобалар', 'Müşteri şirketleri kapsamındaki projeler', '客户公司范围内的项目'],
  ['objectsTitle', 'Объекты', 'Objects', 'Нысандар', 'Nesneler', '对象'],
  ['objectsDesc', 'Объекты капитального строительства', 'Capital construction objects', 'Күрделі құрылыс нысандары', 'Yapısal inşaat nesneleri', '基本建设对象'],
  ['sitesTitle', 'Строительные площадки', 'Construction Sites', 'Құрылыс алаңдары', 'Şantiyeler', '施工现场'],
  ['sitesDesc', 'Территории проведения строительных работ', 'Areas where construction works are carried out', 'Құрылыс жұмыстары жүргізілетін аумақтар', 'İnşaat çalışmalarının yürütüldüğü alanlar', '施工作业区域'],
  ['contractorsTitle', 'Подрядные организации', 'Contractor Organizations', 'Мердігерлік ұйымдар', 'Yüklenici Kuruluşlar', '承包组织'],
  ['contractorsDesc', 'Организации-исполнители работ на площадках', 'Organizations performing works on sites', 'Алаңдардағы жұмыстарды орындаушы ұйымдар', 'Sahalarda iş yapan kuruluşlar', '现场作业执行组织'],
  ['subdivisionsTitle', 'Подразделения подрядчиков', 'Contractor Subdivisions', 'Мердігерлердің бөлімшелері', 'Yüklenici Alt Birimleri', '承包商部门'],
  ['subdivisionsDesc', 'Бригады и участки подрядных организаций', 'Crews and sections of contractor organizations', 'Мердігерлік ұйымдардың бригадалары мен учаскелері', 'Yüklenici kuruluşların ekipleri ve bölümleri', '承包组织的班组和部门'],

  // Персонал
  ['usersTitle', 'Пользователи', 'Users', 'Пайдаланушылар', 'Kullanıcılar', '用户'],
  ['usersDesc', 'Учётные записи сотрудников платформы', 'Platform employee accounts', 'Платформа қызметкерлерінің есептік жазбалары', 'Platform çalışanlarının hesapları', '平台员工账户'],
  ['positionsTitle', 'Должности', 'Positions', 'Лауазымдар', 'Pozisyonlar', '职位'],
  ['positionsDesc', 'Штатные должности сотрудников', 'Staff positions of employees', 'Қызметкерлердің штаттық лауазымдары', 'Çalışanların kadro pozisyonları', '员工编制职位'],
  ['professionsTitle', 'Профессии', 'Professions', 'Кәсіптер', 'Meslekler', '职业'],
  ['professionsDesc', 'Рабочие профессии на объектах', 'Worker professions on sites', 'Нысандардағы жұмысшы кәсіптері', 'Sahalardaki işçi meslekleri', '现场工人职业'],

  // Производство
  ['work-typesTitle', 'Виды работ', 'Work Types', 'Жұмыс түрлері', 'İş Türleri', '工作类型'],
  ['work-typesDesc', 'Классификатор выполняемых видов работ', 'Classifier of work types performed', 'Орындалатын жұмыс түрлерінің классификаторы', 'Yapılan iş türleri sınıflandırıcısı', '已执行工作类型分类器'],
  ['equipment-typesTitle', 'Типы техники', 'Equipment Types', 'Техника түрлері', 'Ekipman Türleri', '设备类型'],
  ['equipment-typesDesc', 'Спецтехника и оборудование', 'Special machinery and equipment', 'Арнайы техника мен жабдық', 'Özel makine ve ekipman', '专用机械和设备'],
  ['ppeTitle', 'СИЗ', 'PPE', 'ЖҚҚ', 'KKD', '个人防护装备'],
  ['ppeDesc', 'Средства индивидуальной защиты', 'Personal protective equipment', 'Жеке қорғаныш құралдары', 'Kişisel koruyucu donanım', '个人防护装备'],

  // HSE
  ['violation-typesTitle', 'Типы нарушений', 'Violation Types', 'Бұзушылық түрлері', 'İhlal Türleri', '违规类型'],
  ['violation-typesDesc', 'Классификатор нарушений ОТ и ПБ', 'Classifier of labor and fire safety violations', 'ЕҚ және ӨҚ бұзушылықтарының классификаторы', 'İSG ihlalleri sınıflandırıcısı', '劳动和消防安全违规分类器'],
  ['risk-categoriesTitle', 'Категории рисков', 'Risk Categories', 'Тәуекел санаттары', 'Risk Kategorileri', '风险类别'],
  ['risk-categoriesDesc', 'Классификатор производственных рисков', 'Classifier of industrial risks', 'Өндірістік тәуекелдер классификаторы', 'Endüstriyel riskler sınıflandırıcısı', '生产风险分类器'],
  ['document-categoriesTitle', 'Категории документов', 'Document Categories', 'Құжат санаттары', 'Belge Kategorileri', '文档类别'],
  ['document-categoriesDesc', 'Классификатор типов документов платформы', 'Classifier of platform document types', 'Платформа құжат түрлерінің классификаторы', 'Platform belge türleri sınıflandırıcısı', '平台文档类型分类器'],
  ['responsibility-zonesTitle', 'Зоны ответственности', 'Responsibility Zones', 'Жауапкершілік аймақтары', 'Sorumluluk Bölgeleri', '责任区域'],
  ['responsibility-zonesDesc', 'Привязка людей к объектам и участкам', 'Linking people to objects and sections', 'Адамдарды нысандар мен учаскелерге тіркеу', 'Kişilerin nesnelere ve bölümlere bağlanması', '将人员关联到对象和区域'],

  // Системные
  ['statusesTitle', 'Статусы', 'Statuses', 'Мәртебелер', 'Durumlar', '状态'],
  ['statusesDesc', 'Статусы объектов и процессов платформы', 'Statuses of platform objects and processes', 'Платформа нысандары мен процестерінің мәртебелері', 'Platform nesnelerinin ve süreçlerinin durumları', '平台对象和流程的状态'],
  ['reasonsTitle', 'Причины', 'Reasons', 'Себептер', 'Nedenler', '原因'],
  ['reasonsDesc', 'Классификатор причин событий и решений', 'Classifier of event and decision reasons', 'Оқиғалар мен шешімдер себептерінің классификаторы', 'Olay ve karar nedenleri sınıflandırıcısı', '事件和决策原因分类器'],
  ['classifiersTitle', 'Классификаторы', 'Classifiers', 'Классификаторлар', 'Sınıflandırıcılar', '分类器'],
  ['classifiersDesc', 'Общие классификаторы платформы', 'General platform classifiers', 'Платформаның жалпы классификаторлары', 'Platformun genel sınıflandırıcıları', '平台通用分类器'],
];
