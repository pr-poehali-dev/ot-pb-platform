import { TermTuple } from '../types';

/**
 * Тексты конкретных страниц и компонентов платформы (namespace: dict.app).
 * Используется вместе с dict.ui / dict.buttons / dict.statuses / dict.dictionaries,
 * которые покрывают общие переиспользуемые термины.
 */
export const appTexts: TermTuple[] = [
  // Общие переиспользуемые подписи форм
  ['ownerPlaceholder', 'ФИО ответственного', 'Full name of the owner', 'Жауаптының аты-жөні', 'Sorumlunun adı soyadı', '负责人姓名'],
  ['viewAction', 'Просмотреть', 'View', 'Қарау', 'Görüntüle', '查看'],
  ['historyAction', 'История изменений', 'Change history', 'Өзгерістер тарихы', 'Değişiklik geçmişi', '变更历史'],
  ['actionsMenu', 'Действия', 'Actions', 'Әрекеттер', 'İşlemler', '操作'],
  ['rootEntity', 'Корневая сущность', 'Root entity', 'Түбір нысан', 'Kök varlık', '根实体'],
  ['rootEntityNoParent', 'Корневая сущность — родителя нет', 'Root entity — no parent', 'Түбір нысан — аталық жоқ', 'Kök varlık — üst öğe yok', '根实体 — 无父级'],
  ['childEntitiesDefault', 'Дочерние сущности', 'Child entities', 'Еншілес нысандар', 'Alt varlıklar', '子实体'],
  ['childEntitiesNotAdded', 'Дочерние сущности ещё не добавлены', 'No child entities added yet', 'Еншілес нысандар әлі қосылмаған', 'Henüz alt varlık eklenmedi', '尚未添加子实体'],
  ['noChildEntitiesForUser', 'У пользователя нет дочерних сущностей', 'This user has no child entities', 'Пайдаланушыда еншілес нысандар жоқ', 'Bu kullanıcının alt varlığı yok', '该用户没有子实体'],

  // Index page (главная)
  ['indexStatActiveModules', 'Активных модулей', 'Active modules', 'Белсенді модульдер', 'Aktif Modüller', '活跃模块'],
  ['indexStatUsers', 'Пользователей', 'Users', 'Пайдаланушылар', 'Kullanıcılar', '用户数'],
  ['indexStatObjects', 'Объектов под контролем', 'Objects under control', 'Бақылаудағы нысандар', 'Kontrol Altındaki Nesneler', '受控对象'],
  ['indexStatEvents', 'Событий в журнале', 'Events in log', 'Журналдағы оқиғалар', 'Günlükteki Olaylar', '日志事件数'],
  ['indexHintCore', 'ядро + подсистемы', 'core + subsystems', 'өзек + ішкі жүйелер', 'çekirdek + alt sistemler', '核心+子系统'],
  ['indexHintUsers', '+38 за неделю', '+38 this week', 'аптасына +38', 'bu hafta +38', '本周+38'],
  ['indexHintObjects', 'объекты + площадки', 'objects + sites', 'нысандар + алаңдар', 'nesneler + sahalar', '对象+现场'],
  ['indexHintEvents', 'за 30 дней', 'in 30 days', '30 күнде', 'son 30 günde', '30天内'],
  ['indexBusTagInduction', 'Инструктажи', 'Inductions', 'Нұсқаулықтар', 'Oryantasyonlar', '培训指导'],
  ['indexBusTagInspections', 'Проверки', 'Inspections', 'Тексерулер', 'Denetimler', '检查'],
  ['indexBusTagIncidents', 'Инциденты', 'Incidents', 'Оқиғалар', 'Olaylar', '事件'],
  ['indexBusTagTraining', 'Обучение', 'Training', 'Оқыту', 'Eğitim', '培训'],
  ['indexBusTagMore', '+ ещё', '+ more', '+ тағы', '+ daha fazla', '+更多'],

  // Hierarchy page
  ['hierarchyBadge', 'Data Hierarchy', 'Data Hierarchy', 'Деректер иерархиясы', 'Veri Hiyerarşisi', '数据层级'],
  ['hierarchyTitle', 'Иерархия', 'Data Hierarchy', 'Деректер', 'Veri', '数据'],
  ['hierarchyTitleHighlight', 'данных', 'Hierarchy', 'иерархиясы', 'Hiyerarşisi', '层级'],
  ['hierarchySubtitle', 'Сквозная структура сущностей платформы: от организации (tenant) до конечного пользователя на площадке.', 'End-to-end entity structure of the platform: from organization (tenant) to the end user on site.', 'Платформаның ұштан-ұшқа нысандар құрылымы: ұйымнан (tenant) алаңдағы соңғы пайдаланушыға дейін.', 'Platformun uçtan uca varlık yapısı: kuruluştan (tenant) sahadaki son kullanıcıya kadar.', '平台端到端实体结构：从组织(租户)到现场最终用户。'],
  ['hierarchyLevelOfTotal', 'Уровень {{level}} из {{total}}', 'Level {{level}} of {{total}}', '{{total}} ішінен {{level}}-деңгей', '{{total}} üzerinden {{level}}. seviye', '第{{level}}级，共{{total}}级'],
  ['hierarchyAddChild', 'Добавить: {{level}}', 'Add: {{level}}', 'Қосу: {{level}}', 'Ekle: {{level}}', '添加：{{level}}'],
  ['hierarchyFooterLevelsCount', '{{count}} уровней структуры', '{{count}} structure levels', 'Құрылымның {{count}} деңгейі', '{{count}} yapı seviyesi', '{{count}} 个结构层级'],

  // Entity Links page
  ['entityLinksBadge', 'Entity Links', 'Entity Links', 'Нысандар байланысы', 'Varlık Bağlantıları', '实体关联'],
  ['entityLinksTitle', 'Связи', 'Entity', 'Нысандар', 'Varlık', '实体'],
  ['entityLinksTitleHighlight', 'сущностей', 'Links', 'байланысы', 'Bağlantıları', '关联'],
  ['entityLinksSubtitle', 'Навигация по утверждённой иерархии Noventra: от организации (tenant) до конечного пользователя.', 'Navigation through the approved Noventra hierarchy: from organization (tenant) to the end user.', 'Noventra бекітілген иерархиясы бойынша навигация: ұйымнан (tenant) соңғы пайдаланушыға дейін.', "Onaylanmış Noventra hiyerarşisinde gezinme: kuruluştan (tenant) son kullanıcıya kadar.", '浏览已批准的Noventra层级结构：从组织(租户)到最终用户。'],
  ['entityLinksOpenCard', 'Открыть карточку', 'Open card', 'Карточканы ашу', 'Kartı aç', '打开卡片'],
  ['entityLinksAddChild', 'Добавить дочерний элемент', 'Add child item', 'Еншілес элемент қосу', 'Alt öğe ekle', '添加子项'],
  ['entityLinksFooterLevel', 'Уровень: {{level}}', 'Level: {{level}}', 'Деңгей: {{level}}', 'Seviye: {{level}}', '层级：{{level}}'],

  // Entity Card page
  ['entityCardNotFound', 'Сущность не найдена', 'Entity not found', 'Нысан табылмады', 'Varlık bulunamadı', '未找到实体'],
  ['entityCardBackToLinks', 'К связям сущностей', 'Back to entity links', 'Нысандар байланысына', 'Varlık bağlantılarına dön', '返回实体关联'],
  ['entityCardTabMain', 'Основное', 'Main', 'Негізгі', 'Genel', '基本信息'],
  ['entityCardTabLinks', 'Связи', 'Links', 'Байланыстар', 'Bağlantılar', '关联'],
  ['entityCardTabDocs', 'Документы', 'Documents', 'Құжаттар', 'Belgeler', '文档'],
  ['entityCardTabHistory', 'История', 'History', 'Тарих', 'Geçmiş', '历史'],
  ['entityCardMainInfo', 'Основная информация', 'Main Information', 'Негізгі ақпарат', 'Genel Bilgiler', '基本信息'],
  ['entityCardLastModified', 'Последнее изменение', 'Last modified', 'Соңғы өзгеріс', 'Son değişiklik', '最后修改'],
  ['entityCardChildEntities', 'Дочерние сущности', 'Child entities', 'Еншілес нысандар', 'Alt varlıklar', '子实体'],
  ['entityCardChildEntitiesNone', 'Дочерние сущности отсутствуют', 'No child entities', 'Еншілес нысандар жоқ', 'Alt varlık yok', '没有子实体'],
  ['entityCardRelatedUsers', 'Связанные пользователи', 'Related users', 'Байланысты пайдаланушылар', 'İlgili kullanıcılar', '相关用户'],
  ['entityCardRelatedUsersNone', 'Связанные пользователи отсутствуют', 'No related users', 'Байланысты пайдаланушылар жоқ', 'İlgili kullanıcı yok', '没有相关用户'],
  ['entityCardRelatedDocs', 'Связанные документы', 'Related documents', 'Байланысты құжаттар', 'İlgili belgeler', '相关文档'],
  ['entityCardUploadDoc', 'Загрузить документ', 'Upload document', 'Құжатты жүктеу', 'Belge yükle', '上传文档'],
  ['entityCardNoDocsYet', 'Документы ещё не добавлены', 'No documents added yet', 'Құжаттар әлі қосылмаған', 'Henüz belge eklenmedi', '尚未添加文档'],
  ['entityCardChangeHistory', 'История изменений', 'Change history', 'Өзгерістер тарихы', 'Değişiklik geçmişi', '变更历史'],
  ['entityCardHistoryEmpty', 'История изменений пуста', 'Change history is empty', 'Өзгерістер тарихы бос', 'Değişiklik geçmişi boş', '暂无变更历史'],
  ['entityCardFooterLabel', 'Карточка сущности', 'Entity card', 'Нысан карточкасы', 'Varlık kartı', '实体卡片'],

  // Entity Form Dialog
  ['entityFormCreateTitle', 'Новая сущность: {{label}}', 'New entity: {{label}}', 'Жаңа нысан: {{label}}', 'Yeni varlık: {{label}}', '新建实体：{{label}}'],
  ['entityFormEditTitle', 'Редактирование: {{label}}', 'Editing: {{label}}', 'Өңдеу: {{label}}', 'Düzenleme: {{label}}', '编辑：{{label}}'],
  ['entityFormCreateDesc', 'Заполните карточку по единому стандарту Noventra Core.', 'Fill in the card according to the Noventra Core unified standard.', 'Карточканы Noventra Core бірыңғай стандарты бойынша толтырыңыз.', 'Kartı Noventra Core birleşik standardına göre doldurun.', '请按照Noventra Core统一标准填写卡片。'],
  ['entityFormEditDesc', 'Изменения будут зафиксированы в истории сущности.', 'Changes will be recorded in the entity history.', 'Өзгерістер нысан тарихында тіркеледі.', 'Değişiklikler varlık geçmişine kaydedilecektir.', '更改将记录在实体历史中。'],
  ['entityFormNamePlaceholder', 'Например, ООО «СтройИнвест Групп»', 'e.g. StroyInvest Group LLC', 'Мысалы, «СтройИнвест Групп» ЖШС', 'Örn. StroyInvest Group Ltd.', '例如：StroyInvest Group有限公司'],
  ['entityFormCodePlaceholder', 'Например, CMP-003', 'e.g. CMP-003', 'Мысалы, CMP-003', 'Örn. CMP-003', '例如：CMP-003'],
  ['entityFormDescPlaceholder', 'Краткое описание сущности (необязательно)', 'Brief entity description (optional)', 'Нысанның қысқаша сипаттамасы (міндетті емес)', 'Kısa varlık açıklaması (isteğe bağlı)', '实体简要描述（可选）'],
  ['entityFormToastCreatedTitle', 'Сущность создана', 'Entity created', 'Нысан құрылды', 'Varlık oluşturuldu', '实体已创建'],
  ['entityFormToastCreatedDesc', '«{{name}}» добавлена в раздел «{{label}}»', '"{{name}}" added to "{{label}}" section', '«{{name}}» «{{label}}» бөліміне қосылды', '"{{name}}", "{{label}}" bölümüne eklendi', '"{{name}}" 已添加到"{{label}}"分区'],
  ['entityFormToastUpdatedTitle', 'Изменения сохранены', 'Changes saved', 'Өзгерістер сақталды', 'Değişiklikler kaydedildi', '更改已保存'],
  ['entityFormToastUpdatedDesc', 'Карточка «{{name}}» обновлена', 'Card "{{name}}" updated', '«{{name}}» карточкасы жаңартылды', '"{{name}}" kartı güncellendi', '"{{name}}" 卡片已更新'],

  // Entity Status Dialog
  ['entityStatusArchiveTitle', 'Архивировать сущность?', 'Archive entity?', 'Нысанды мұрағаттау керек пе?', 'Varlık arşivlensin mi?', '归档实体？'],
  ['entityStatusRestoreTitle', 'Восстановить сущность?', 'Restore entity?', 'Нысанды қалпына келтіру керек пе?', 'Varlık geri yüklensin mi?', '恢复实体？'],
  ['entityStatusArchiveDesc', '«{{name}}» получит статус «Архив». Данные сохраняются, физическое удаление не выполняется.', '"{{name}}" will get the "Archived" status. Data is preserved, no physical deletion is performed.', '«{{name}}» «Мұрағат» мәртебесін алады. Деректер сақталады, физикалық жою орындалмайды.', '"{{name}}" "Arşivlendi" durumunu alacak. Veriler korunur, fiziksel silme yapılmaz.', '"{{name}}" 将变为"已归档"状态。数据将被保留，不会进行物理删除。'],
  ['entityStatusRestoreDesc', '«{{name}}» получит статус «Активен» и вернётся в рабочий контур.', '"{{name}}" will get the "Active" status and return to the working scope.', '«{{name}}» «Белсенді» мәртебесін алып, жұмыс аясына қайтады.', '"{{name}}" "Aktif" durumunu alacak ve çalışma kapsamına dönecek.', '"{{name}}" 将恢复为"活跃"状态并回到工作范围。'],
  ['entityStatusToastArchivedTitle', 'Сущность архивирована', 'Entity archived', 'Нысан мұрағатталды', 'Varlık arşivlendi', '实体已归档'],
  ['entityStatusToastArchivedDesc', '«{{name}}» переведена в статус «Архив»', '"{{name}}" moved to "Archived" status', '«{{name}}» «Мұрағат» мәртебесіне ауыстырылды', '"{{name}}" "Arşivlendi" durumuna geçirildi', '"{{name}}" 已转为"已归档"状态'],
  ['entityStatusToastRestoredTitle', 'Сущность восстановлена', 'Entity restored', 'Нысан қалпына келтірілді', 'Varlık geri yüklendi', '实体已恢复'],
  ['entityStatusToastRestoredDesc', '«{{name}}» переведена в статус «Активен»', '"{{name}}" moved to "Active" status', '«{{name}}» «Белсенді» мәртебесіне ауыстырылды', '"{{name}}" "Aktif" durumuna geçirildi', '"{{name}}" 已转为"活跃"状态'],

  // Entity Actions Menu / History Dialog
  ['entityActionsHistoryLabel', 'История изменений', 'Change history', 'Өзгерістер тарихы', 'Değişiklik geçmişi', '变更历史'],
  ['entityHistoryDialogEmpty', 'История изменений пуста', 'Change history is empty', 'Өзгерістер тарихы бос', 'Değişiklik geçmişi boş', '暂无变更历史'],
  ['historyEntityCreated', 'Сущность создана', 'Entity created', 'Нысан құрылды', 'Varlık oluşturuldu', '实体已创建'],
  ['historyEntityArchived', 'Сущность архивирована', 'Entity archived', 'Нысан мұрағатталды', 'Varlık arşivlendi', '实体已归档'],
  ['historyEntityRestored', 'Сущность восстановлена из архива', 'Entity restored from archive', 'Нысан мұрағаттан қалпына келтірілді', 'Varlık arşivden geri yüklendi', '实体已从归档中恢复'],
  ['historyNoChanges', 'Данные обновлены без изменений', 'Data updated with no changes', 'Деректер өзгеріссіз жаңартылды', 'Veriler değişiklik yapılmadan güncellendi', '数据已更新，无变更'],
  ['historyOwnerChangedDemo', 'Изменён ответственный', 'Owner changed', 'Жауапты өзгертілді', 'Sorumlu değiştirildi', '负责人已更改'],
  ['historyStatusChangedDemo', 'Обновлён статус', 'Status updated', 'Мәртебе жаңартылды', 'Durum güncellendi', '状态已更新'],
  ['historyChangeName', 'название «{{before}}» → «{{after}}»', 'name "{{before}}" → "{{after}}"', 'атауы «{{before}}» → «{{after}}»', 'ad "{{before}}" → "{{after}}"', '名称 "{{before}}" → "{{after}}"'],
  ['historyChangeCode', 'код «{{before}}» → «{{after}}»', 'code "{{before}}" → "{{after}}"', 'код «{{before}}» → «{{after}}»', 'kod "{{before}}" → "{{after}}"', '代码 "{{before}}" → "{{after}}"'],
  ['historyChangeOwner', 'ответственный «{{before}}» → «{{after}}»', 'owner "{{before}}" → "{{after}}"', 'жауапты «{{before}}» → «{{after}}»', 'sorumlu "{{before}}" → "{{after}}"', '负责人 "{{before}}" → "{{after}}"'],
  ['historyChangeDescription', 'описание', 'description', 'сипаттама', 'açıklama', '描述'],
  ['historyUpdatedPrefix', 'Изменено: {{changes}}', 'Changed: {{changes}}', 'Өзгертілді: {{changes}}', 'Değiştirildi: {{changes}}', '已更改：{{changes}}'],

  // Dictionary Detail page
  ['dictDetailBadge', 'Core Dictionaries', 'Core Dictionaries', 'Өзек анықтамалықтары', 'Çekirdek Kayıtları', '核心目录'],

  // Dictionary Crud
  ['dictCrudCreateRecord', 'Создать запись', 'Create record', 'Жазба құру', 'Kayıt oluştur', '创建记录'],

  // Dictionary Table
  ['dictTableSearchPlaceholder', 'Поиск по «{{title}}»…', 'Search in "{{title}}"…', '«{{title}}» бойынша іздеу…', '"{{title}}" içinde ara…', '在"{{title}}"中搜索…'],
  ['dictTableAllStatuses', 'Все статусы', 'All statuses', 'Барлық мәртебелер', 'Tüm durumlar', '所有状态'],
  ['dictTableColumnCreated', 'Создано', 'Created', 'Құрылды', 'Oluşturuldu', '创建时间'],
  ['dictTableColumnActions', 'Действия', 'Actions', 'Әрекеттер', 'İşlemler', '操作'],
  ['dictTableNoRecords', 'Записи не найдены', 'No records found', 'Жазбалар табылмады', 'Kayıt bulunamadı', '未找到记录'],

  // Dictionary Form Dialog
  ['dictFormCreateTitle', 'Новая запись: {{title}}', 'New record: {{title}}', 'Жаңа жазба: {{title}}', 'Yeni kayıt: {{title}}', '新建记录：{{title}}'],
  ['dictFormEditTitle', 'Редактирование записи', 'Editing record', 'Жазбаны өңдеу', 'Kayıt düzenleme', '编辑记录'],
  ['dictFormCreateDesc', 'Заполните данные для справочника «{{title}}».', 'Fill in the data for the "{{title}}" dictionary.', '«{{title}}» анықтамалығы үшін деректерді толтырыңыз.', '"{{title}}" kaydı için verileri doldurun.', '请填写"{{title}}"目录的数据。'],
  ['dictFormEditDesc', 'Изменения будут сохранены в записи справочника.', 'Changes will be saved to the dictionary record.', 'Өзгерістер анықтамалық жазбасында сақталады.', 'Değişiklikler kayıt defterine kaydedilecektir.', '更改将保存到目录记录中。'],
  ['dictFormNamePlaceholder', 'Название записи', 'Record name', 'Жазба атауы', 'Kayıt adı', '记录名称'],
  ['dictFormCodePlaceholder', 'Например, {{prefix}}-003', 'e.g. {{prefix}}-003', 'Мысалы, {{prefix}}-003', 'Örn. {{prefix}}-003', '例如：{{prefix}}-003'],
  ['dictFormDescPlaceholder', 'Краткое описание (необязательно)', 'Brief description (optional)', 'Қысқаша сипаттама (міндетті емес)', 'Kısa açıklama (isteğe bağlı)', '简要描述（可选）'],
  ['dictFormToastCreatedTitle', 'Запись создана', 'Record created', 'Жазба құрылды', 'Kayıt oluşturuldu', '记录已创建'],
  ['dictFormToastCreatedDesc', '«{{name}}» добавлена в справочник «{{title}}»', '"{{name}}" added to "{{title}}" dictionary', '«{{name}}» «{{title}}» анықтамалығына қосылды', '"{{name}}", "{{title}}" kaydına eklendi', '"{{name}}" 已添加到"{{title}}"目录'],
  ['dictFormToastUpdatedTitle', 'Изменения сохранены', 'Changes saved', 'Өзгерістер сақталды', 'Değişiklikler kaydedildi', '更改已保存'],
  ['dictFormToastUpdatedDesc', 'Запись «{{name}}» обновлена', 'Record "{{name}}" updated', '«{{name}}» жазбасы жаңартылды', '"{{name}}" kaydı güncellendi', '记录"{{name}}"已更新'],

  // Dictionary Status Dialog
  ['dictStatusArchiveTitle', 'Архивировать запись?', 'Archive record?', 'Жазбаны мұрағаттау керек пе?', 'Kayıt arşivlensin mi?', '归档记录？'],
  ['dictStatusRestoreTitle', 'Восстановить запись?', 'Restore record?', 'Жазбаны қалпына келтіру керек пе?', 'Kayıt geri yüklensin mi?', '恢复记录？'],
  ['dictStatusArchiveDesc', '«{{name}}» получит статус «Архив». Физическое удаление не выполняется.', '"{{name}}" will get the "Archived" status. No physical deletion is performed.', '«{{name}}» «Мұрағат» мәртебесін алады. Физикалық жою орындалмайды.', '"{{name}}" "Arşivlendi" durumunu alacak. Fiziksel silme yapılmaz.', '"{{name}}" 将变为"已归档"状态，不会进行物理删除。'],
  ['dictStatusRestoreDesc', '«{{name}}» получит статус «Активен».', '"{{name}}" will get the "Active" status.', '«{{name}}» «Белсенді» мәртебесін алады.', '"{{name}}" "Aktif" durumunu alacak.', '"{{name}}" 将变为"活跃"状态。'],
  ['dictStatusToastArchivedTitle', 'Запись архивирована', 'Record archived', 'Жазба мұрағатталды', 'Kayıt arşivlendi', '记录已归档'],
  ['dictStatusToastArchivedDesc', '«{{name}}» переведена в статус «Архив»', '"{{name}}" moved to "Archived" status', '«{{name}}» «Мұрағат» мәртебесіне ауыстырылды', '"{{name}}" "Arşivlendi" durumuna geçirildi', '"{{name}}" 已转为"已归档"状态'],
  ['dictStatusToastRestoredTitle', 'Запись восстановлена', 'Record restored', 'Жазба қалпына келтірілді', 'Kayıt geri yüklendi', '记录已恢复'],
  ['dictStatusToastRestoredDesc', '«{{name}}» переведена в статус «Активен»', '"{{name}}" moved to "Active" status', '«{{name}}» «Белсенді» мәртебесіне ауыстырылды', '"{{name}}" "Aktif" durumuna geçirildi', '"{{name}}" 已转为"活跃"状态'],

  // Dictionary Hub
  ['dictHubTitle', 'Единые', 'Master', 'Бірыңғай', 'Ortak', '统一'],
  ['dictHubTitleHighlight', 'справочники', 'Data', 'анықтамалықтар', 'Kayıtlar', '目录'],
  ['dictHubSubtitle', 'Центральный модуль платформы Noventra. Единый источник данных и единый CRUD-интерфейс для всех бизнес-модулей.', 'Central module of the Noventra platform. A single source of data and a unified CRUD interface for all business modules.', 'Noventra платформасының орталық модулі. Барлық бизнес-модульдер үшін бірыңғай деректер көзі мен бірыңғай CRUD интерфейсі.', "Noventra platformunun merkezi modülü. Tüm iş modülleri için tek veri kaynağı ve birleşik CRUD arayüzü.", 'Noventra平台的核心模块。所有业务模块的统一数据源和统一CRUD界面。'],
  ['dictHubStatDictionaries', 'Справочников', 'Dictionaries', 'Анықтамалықтар', 'Kayıt Defterleri', '目录数'],
  ['dictHubStatTotalRecords', 'Всего записей', 'Total records', 'Барлық жазбалар', 'Toplam Kayıt', '记录总数'],
  ['dictHubStatFavorites', 'В избранном', 'In favorites', 'Таңдаулыларда', 'Favorilerde', '收藏数'],
  ['dictHubStatRecent', 'Недавние', 'Recent', 'Соңғылар', 'Son Kullanılanlar', '最近使用'],
  ['dictHubFrequentlyUsed', 'Часто используемые', 'Frequently used', 'Жиі қолданылатын', 'Sık Kullanılanlar', '常用'],
  ['dictHubFavoriteDictionaries', 'Избранные справочники', 'Favorite dictionaries', 'Таңдаулы анықтамалықтар', 'Favori Kayıtlar', '收藏目录'],
  ['dictHubRecentlyOpened', 'Последние открытые', 'Recently opened', 'Соңғы ашылған', 'Son Açılanlar', '最近打开'],
  ['dictHubRecordSingular', 'запись', 'record', 'жазба', 'kayıt', '条记录'],
  ['dictHubRecordPlural', 'записей', 'records', 'жазба', 'kayıt', '条记录'],
  ['dictHubAddFavorite', 'Добавить в избранное', 'Add to favorites', 'Таңдаулыларға қосу', 'Favorilere ekle', '添加到收藏'],
  ['dictHubRemoveFavorite', 'Убрать из избранного', 'Remove from favorites', 'Таңдаулылардан алып тастау', 'Favorilerden kaldır', '从收藏中移除'],
  ['dictHubOpenDictionary', 'Открыть справочник', 'Open dictionary', 'Анықтамалықты ашу', 'Kaydı aç', '打开目录'],

  // Dictionary Tree
  ['dictTreeSearchPlaceholder', 'Поиск справочника…', 'Search dictionary…', 'Анықтамалықты іздеу…', 'Kayıt ara…', '搜索目录…'],

  // Not Found page
  ['notFoundTitle', 'Упс! Страница не найдена', 'Oops! Page not found', 'Ой! Бет табылмады', 'Hata! Sayfa bulunamadı', '哎呀！页面未找到'],
  ['notFoundBackHome', 'Вернуться на главную', 'Back to home', 'Басты бетке оралу', 'Ana sayfaya dön', '返回首页'],

  // Language menu
  ['languageMenuLabel', 'Язык', 'Language', 'Тіл', 'Dil', '语言'],
];