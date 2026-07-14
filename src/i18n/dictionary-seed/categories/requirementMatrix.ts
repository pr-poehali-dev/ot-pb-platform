import { TermTuple } from '../types';

/**
 * Requirement Matrix Engine — универсальный движок матриц требований
 * (namespace: dict.requirementMatrix). Термины не привязаны к конкретному
 * домену применения (допуск персонала/техники/подрядчиков и т.д.) — один и
 * тот же набор меток используется реестром и карточкой матрицы независимо
 * от того, какой модуль их вызывает.
 */
export const requirementMatrixTerms: TermTuple[] = [
  // Реестр матриц
  ['registryTitle', 'Матрицы требований', 'Requirement Matrices', 'Талаптар матрицалары', 'Gereksinim Matrisleri', '要求矩阵'],
  ['registrySubtitle', 'Универсальный конструктор требований допуска: персонал, техника, подрядчики, документы.', 'Universal clearance requirements builder: personnel, equipment, contractors, documents.', 'Жіберу талаптарының әмбебап құрастырушысы: персонал, техника, мердігерлер, құжаттар.', 'Evrensel yetkilendirme gereksinimleri oluşturucu: personel, ekipman, yükleniciler, belgeler.', '通用准入要求构建器：人员、设备、承包商、文件。'],
  ['searchPlaceholder', 'Поиск по названию матрицы', 'Search by matrix name', 'Матрица атауы бойынша іздеу', 'Matris adına göre ara', '按矩阵名称搜索'],
  ['createAction', 'Создать матрицу', 'Create Matrix', 'Матрица құру', 'Matris Oluştur', '创建矩阵'],
  ['duplicateAction', 'Копировать', 'Duplicate', 'Көшіру', 'Kopyala', '复制'],

  // Колонки таблицы реестра
  ['columnName', 'Название', 'Name', 'Атауы', 'Adı', '名称'],
  ['columnPriority', 'Приоритет', 'Priority', 'Басымдық', 'Öncelik', '优先级'],
  ['columnVersion', 'Версия', 'Version', 'Нұсқа', 'Sürüm', '版本'],
  ['columnUpdatedAt', 'Обновлено', 'Updated', 'Жаңартылды', 'Güncellendi', '更新时间'],

  // Статусы матрицы
  ['statusDraft', 'Черновик', 'Draft', 'Жоба', 'Taslak', '草稿'],
  ['statusActive', 'Активна', 'Active', 'Белсенді', 'Aktif', '生效中'],
  ['statusArchived', 'В архиве', 'Archived', 'Мұрағатта', 'Arşivde', '已归档'],

  // Приоритеты матрицы (пятиуровневая шкала платформы)
  ['priorityLegislation', 'Законодательство', 'Legislation', 'Заңнама', 'Mevzuat', '法规'],
  ['priorityCorporate', 'Корпоративное', 'Corporate', 'Корпоративтік', 'Kurumsal', '企业'],
  ['priorityProject', 'Проектное', 'Project', 'Жобалық', 'Proje', '项目'],
  ['priorityCustomer', 'Заказчика', 'Customer', 'Тапсырысшы', 'Müşteri', '客户'],
  ['priorityTemporary', 'Временное', 'Temporary', 'Уақытша', 'Geçici', '临时'],

  // Области применения матрицы
  ['scopeGlobal', 'Глобально', 'Global', 'Жаһандық', 'Küresel', '全局'],
  ['scopeProject', 'Проект', 'Project', 'Жоба', 'Proje', '项目'],
  ['scopeObject', 'Объект', 'Object', 'Нысан', 'Nesne', '对象'],
  ['scopeContractor', 'Подрядчик', 'Contractor', 'Мердігер', 'Yüklenici', '承包商'],

  // Диалог создания матрицы
  ['createTitle', 'Новая матрица требований', 'New Requirement Matrix', 'Жаңа талаптар матрицасы', 'Yeni Gereksinim Matrisi', '新建要求矩阵'],
  ['createDesc', 'Заполните базовые параметры — остальные вкладки будут доступны в карточке матрицы.', 'Fill in the basic parameters — remaining tabs will be available in the matrix card.', 'Негізгі параметрлерді толтырыңыз — қалған қойындылар матрица карточкасында қолжетімді болады.', 'Temel parametreleri doldurun — kalan sekmeler matris kartında kullanılabilir olacaktır.', '填写基本参数——其余标签页将在矩阵卡片中可用。'],
  ['fieldName', 'Название матрицы', 'Matrix Name', 'Матрица атауы', 'Matris Adı', '矩阵名称'],
  ['fieldNamePlaceholder', 'Например, «Допуск на высотные работы»', 'e.g. "Height Work Clearance"', 'Мысалы, «Биіктік жұмыстарына жіберу»', 'Örn. "Yüksekte Çalışma İzni"', '例如："高空作业准入"'],

  // Toast-уведомления реестра
  ['toastCreatedTitle', 'Матрица создана', 'Matrix created', 'Матрица құрылды', 'Matris oluşturuldu', '矩阵已创建'],
  ['toastCreatedDesc', 'Матрица «{{name}}» добавлена в реестр как черновик', 'Matrix "{{name}}" added to the registry as a draft', '«{{name}}» матрицасы жобаретінде реестрге қосылды', '"{{name}}" matrisi taslak olarak kayda eklendi', '矩阵"{{name}}"已作为草稿添加到注册表'],
  ['toastDuplicatedTitle', 'Матрица скопирована', 'Matrix duplicated', 'Матрица көшірілді', 'Matris kopyalandı', '矩阵已复制'],
  ['toastDuplicatedDesc', 'Создана копия «{{name}}»', 'Copy "{{name}}" created', '«{{name}}» көшірмесі жасалды', '"{{name}}" kopyası oluşturuldu', '副本"{{name}}"已创建'],
  ['toastArchivedTitle', 'Матрица архивирована', 'Matrix archived', 'Матрица мұрағатталды', 'Matris arşivlendi', '矩阵已归档'],
  ['toastArchivedDesc', '«{{name}}» перемещена в архив', '"{{name}}" moved to archive', '«{{name}}» мұрағатқа жылжытылды', '"{{name}}" arşive taşındı', '"{{name}}"已移至归档'],
  ['toastRestoredTitle', 'Матрица восстановлена', 'Matrix restored', 'Матрица қалпына келтірілді', 'Matris geri yüklendi', '矩阵已恢复'],
  ['toastRestoredDesc', '«{{name}}» восстановлена из архива', '"{{name}}" restored from archive', '«{{name}}» мұрағаттан қалпына келтірілді', '"{{name}}" arşivden geri yüklendi', '"{{name}}"已从归档恢复'],
  ['toastUpdatedTitle', 'Изменения сохранены', 'Changes saved', 'Өзгерістер сақталды', 'Değişiklikler kaydedildi', '更改已保存'],
  ['toastUpdatedDesc', 'Матрица «{{name}}» обновлена', 'Matrix "{{name}}" updated', '«{{name}}» матрицасы жаңартылды', '"{{name}}" matrisi güncellendi', '矩阵"{{name}}"已更新'],

  // Карточка матрицы — общие элементы
  ['cardNotFound', 'Матрица не найдена', 'Matrix not found', 'Матрица табылмады', 'Matris bulunamadı', '未找到矩阵'],
  ['backToRegistry', 'К реестру матриц', 'Back to matrix registry', 'Матрицалар реестріне', 'Matris kaydına dön', '返回矩阵注册表'],
  ['cardVersionLabel', 'Версия {{version}}', 'Version {{version}}', '{{version}}-нұсқа', 'Sürüm {{version}}', '版本 {{version}}'],

  // Вкладки карточки матрицы (статичные)
  ['tabGeneralInfo', 'Общая информация', 'General Information', 'Жалпы ақпарат', 'Genel Bilgiler', '基本信息'],
  ['tabScope', 'Область применения', 'Scope', 'Қолдану аясы', 'Uygulama Kapsamı', '适用范围'],
  ['tabRequiredDocuments', 'Обязательные документы', 'Required Documents', 'Міндетті құжаттар', 'Zorunlu Belgeler', '必需文件'],
  ['tabOptionalDocuments', 'Дополнительные документы', 'Optional Documents', 'Қосымша құжаттар', 'Ek Belgeler', '附加文件'],
  ['tabMandatorySettings', 'Настройки обязательности', 'Mandatory Settings', 'Міндеттілік параметрлері', 'Zorunluluk Ayarları', '强制性设置'],
  ['tabPriority', 'Приоритет матрицы', 'Matrix Priority', 'Матрица басымдығы', 'Matris Önceliği', '矩阵优先级'],
  ['tabChangeHistory', 'История изменений', 'Change History', 'Өзгерістер тарихы', 'Değişiklik Geçmişi', '变更历史'],

  // Общая информация
  ['fieldDomain', 'Домен применения', 'Application Domain', 'Қолдану домені', 'Uygulama Alanı', '应用领域'],
  ['fieldStatus', 'Статус', 'Status', 'Мәртебе', 'Durum', '状态'],
  ['fieldCreatedAt', 'Создана', 'Created', 'Құрылды', 'Oluşturuldu', '创建时间'],
  ['fieldUpdatedAt', 'Обновлена', 'Updated', 'Жаңартылды', 'Güncellendi', '更新时间'],
  ['fieldDuplicatedFrom', 'Создана копированием из', 'Duplicated from', 'Көшірмеленген матрица', 'Şuradan kopyalandı', '复制自'],

  // Область применения
  ['scopeTypeLabel', 'Тип области применения', 'Scope Type', 'Қолдану аясының түрі', 'Kapsam Türü', '范围类型'],
  ['scopeDescLabel', 'Уточнение области применения', 'Scope clarification', 'Қолдану аясын нақтылау', 'Kapsam açıklaması', '范围说明'],
  ['scopeEmptyState', 'Область применения не уточнена — матрица считается глобальной', 'Scope not specified — the matrix is considered global', 'Қолдану аясы нақтыланбаған — матрица жаһандық болып саналады', 'Kapsam belirtilmedi — matris küresel kabul edilir', '未指定范围——矩阵视为全局'],

  // Документы (обязательные / дополнительные)
  ['documentsEmptyRequired', 'Обязательные документы ещё не добавлены', 'No required documents added yet', 'Міндетті құжаттар әлі қосылмаған', 'Henüz zorunlu belge eklenmedi', '尚未添加必需文件'],
  ['documentsEmptyOptional', 'Дополнительные документы ещё не добавлены', 'No optional documents added yet', 'Қосымша құжаттар әлі қосылмаған', 'Henüz ek belge eklenmedi', '尚未添加附加文件'],
  ['documentsAddAction', 'Добавить документ', 'Add document', 'Құжат қосу', 'Belge ekle', '添加文件'],

  // Измерения критериев (динамические вкладки — устаревший режим, сохранён для совместимости)
  ['criteriaModeAll', 'Все значения', 'All values', 'Барлық мәндер', 'Tüm değerler', '所有值'],
  ['criteriaModeSpecific', 'Выбранные значения', 'Selected values', 'Таңдалған мәндер', 'Seçilen değerler', '选定值'],
  ['criteriaMandatoryLabel', 'Обязательное условие', 'Mandatory condition', 'Міндетті шарт', 'Zorunlu koşul', '强制条件'],
  ['criteriaEmptyState', 'Список значений пока не подключён — используется заглушка Reference Data Engine', 'Value list not yet connected — using Reference Data Engine stub', 'Мәндер тізімі әлі қосылмаған — Reference Data Engine бос орны қолданылады', 'Değer listesi henüz bağlanmadı — Reference Data Engine taslağı kullanılıyor', '值列表尚未连接——使用Reference Data Engine占位数据'],

  // Раздел «Критерии применения» (единая вкладка карточки матрицы)
  ['tabCriteria', 'Критерии применения', 'Applicability Criteria', 'Қолдану критерийлері', 'Uygulanabilirlik Kriterleri', '适用标准'],
  ['criteriaSectionDesc', 'Добавляйте критерии, определяющие, к кому и к чему применяется матрица.', 'Add criteria that define who and what the matrix applies to.', 'Матрица кімге және неге қолданылатынын анықтайтын критерийлерді қосыңыз.', 'Matrisin kime ve neye uygulandığını belirleyen kriterleri ekleyin.', '添加决定矩阵适用对象的标准。'],
  ['criteriaTypePlaceholder', 'Тип критерия', 'Criterion type', 'Критерий түрі', 'Kriter türü', '标准类型'],
  ['criteriaAddAction', 'Добавить критерий', 'Add criterion', 'Критерий қосу', 'Kriter ekle', '添加标准'],
  ['criteriaAllTypesAdded', 'Все доступные типы критериев уже добавлены', 'All available criterion types already added', 'Барлық қолжетімді критерий түрлері қосылды', 'Mevcut tüm kriter türleri zaten eklendi', '所有可用标准类型均已添加'],
  ['criteriaSectionEmpty', 'Критерии применения ещё не добавлены — матрица применяется без ограничений', 'No applicability criteria added yet — the matrix applies without restrictions', 'Қолдану критерийлері әлі қосылмаған — матрица шектеусіз қолданылады', 'Henüz uygulanabilirlik kriteri eklenmedi — matris kısıtlama olmadan uygulanır', '尚未添加适用标准——矩阵将不受限制地应用'],
  ['criteriaEnabled', 'Включён', 'Enabled', 'Қосулы', 'Etkin', '已启用'],
  ['criteriaDisabled', 'Отключён', 'Disabled', 'Өшірулі', 'Devre dışı', '已禁用'],

  // Настройки обязательности
  ['mandatoryToggleLabel', 'Матрица обязательна к применению', 'Matrix is mandatory', 'Матрица қолдануға міндетті', 'Matris uygulaması zorunludur', '矩阵为强制性'],
  ['mandatoryToggleDesc', 'Если выключено, матрица носит рекомендательный характер', 'If disabled, the matrix is advisory only', 'Өшірілген болса, матрица ұсынымдық сипатта болады', 'Devre dışıysa, matris yalnızca tavsiye niteliğindedir', '如禁用，矩阵仅作为建议'],

  // Приоритет матрицы (вкладка)
  ['priorityTabDesc', 'Приоритет определяет, какая матрица применяется при пересечении нескольких требований для одной ситуации.', 'Priority determines which matrix applies when several requirements overlap for the same situation.', 'Басымдық бір жағдай үшін бірнеше талап қиылысқанда қай матрица қолданылатынын анықтайды.', 'Öncelik, aynı durum için birden fazla gereksinim çakıştığında hangi matrisin uygulanacağını belirler.', '优先级决定同一情况下多个要求重叠时应用哪个矩阵。'],

  // История изменений
  ['historyEmptyState', 'История изменений пуста', 'Change history is empty', 'Өзгерістер тарихы бос', 'Değişiklik geçmişi boş', '变更历史为空'],
  ['historyVersionEntry', 'Версия {{version}}', 'Version {{version}}', '{{version}}-нұсқа', 'Sürüm {{version}}', '版本 {{version}}'],
];