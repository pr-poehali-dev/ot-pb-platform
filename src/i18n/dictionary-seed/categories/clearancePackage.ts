import { TermTuple } from '../types';

/**
 * Clearance Package Engine — центральная сущность допуска персонала
 * (namespace: dict.clearancePackage). Термины реестра, карточки пакета и
 * категорий требований — только архитектурный каркас, без бизнес-логики.
 */
export const clearancePackageTerms: TermTuple[] = [
  // Реестр пакетов
  ['registryTitle', 'Пакеты допуска', 'Clearance Packages', 'Жіберу пакеттері', 'Yetkilendirme Paketleri', '准入包'],
  ['registrySubtitle', 'Центральный объект допуска: требования, независимые проверки, история и решения.', 'Central clearance object: requirements, independent reviews, history and decisions.', 'Жіберудің орталық нысаны: талаптар, тәуелсіз тексерулер, тарих және шешімдер.', 'Merkezi yetkilendirme nesnesi: gereksinimler, bağımsız incelemeler, geçmiş ve kararlar.', '准入核心对象：要求、独立审核、历史与决策。'],
  ['searchPlaceholder', 'Поиск по номеру пакета или работнику', 'Search by package number or worker', 'Пакет нөмірі немесе қызметкер бойынша іздеу', 'Paket numarasına veya çalışana göre ara', '按包编号或员工搜索'],
  ['createAction', 'Создать пакет', 'Create Package', 'Пакет құру', 'Paket Oluştur', '创建准入包'],

  // Колонки таблицы реестра
  ['columnNumber', 'Номер пакета', 'Package Number', 'Пакет нөмірі', 'Paket Numarası', '包编号'],
  ['columnWorker', 'Работник', 'Worker', 'Қызметкер', 'Çalışan', '员工'],
  ['columnOrganization', 'Организация', 'Organization', 'Ұйым', 'Kuruluş', '组织'],
  ['columnStatus', 'Статус', 'Status', 'Мәртебе', 'Durum', '状态'],
  ['columnUpdatedAt', 'Обновлён', 'Updated', 'Жаңартылды', 'Güncellendi', '更新时间'],

  // Статусы пакета (п.8 ТЗ)
  ['statusDraft', 'Черновик', 'Draft', 'Жоба', 'Taslak', '草稿'],
  ['statusUnderReview', 'На проверке', 'Under Review', 'Тексерілуде', 'İnceleniyor', '审核中'],
  ['statusNeedsRevision', 'На доработке', 'Needs Revision', 'Пысықтауда', 'Revizyon Gerekiyor', '待修改'],
  ['statusAwaitingDecision', 'Ожидает решения', 'Awaiting Decision', 'Шешім күтілуде', 'Karar Bekleniyor', '待决策'],
  ['statusCleared', 'Допущен', 'Cleared', 'Жіберілді', 'Yetkilendirildi', '已准入'],
  ['statusNotCleared', 'Не допущен', 'Not Cleared', 'Жіберілмеді', 'Yetkilendirilmedi', '未准入'],
  ['statusSuspended', 'Приостановлен', 'Suspended', 'Тоқтатылды', 'Askıya Alındı', '已暂停'],
  ['statusArchived', 'В архиве', 'Archived', 'Мұрағатта', 'Arşivde', '已归档'],

  // Карточка пакета — общие элементы
  ['cardNotFound', 'Пакет допуска не найден', 'Clearance package not found', 'Жіберу пакеті табылмады', 'Yetkilendirme paketi bulunamadı', '未找到准入包'],
  ['backToRegistry', 'К реестру пакетов', 'Back to package registry', 'Пакеттер реестріне', 'Paket kaydına dön', '返回准入包注册表'],
  ['cardVersionLabel', 'Версия {{version}}', 'Version {{version}}', '{{version}}-нұсқа', 'Sürüm {{version}}', '版本 {{version}}'],

  // Вкладки/разделы карточки пакета
  ['tabGeneralInfo', 'Общая информация', 'General Information', 'Жалпы ақпарат', 'Genel Bilgiler', '基本信息'],
  ['tabAppliedMatrices', 'Применённые матрицы требований', 'Applied Requirement Matrices', 'Қолданылған талаптар матрицалары', 'Uygulanan Gereksinim Matrisleri', '已应用要求矩阵'],
  ['tabRequirements', 'Требования пакета', 'Package Requirements', 'Пакет талаптары', 'Paket Gereksinimleri', '包要求'],
  ['tabOtPbReview', 'Проверка ОТ/ПБ', 'OHS Review', 'ЕТ/ӨҚ тексеруі', 'İSG İncelemesi', '劳动安全审核'],
  ['tabSecurityReview', 'Проверка Службы безопасности', 'Security Review', 'Қауіпсіздік қызметінің тексеруі', 'Güvenlik İncelemesi', '安保审核'],
  ['tabHistory', 'История', 'History', 'Тарих', 'Geçmiş', '历史'],
  ['tabDecisionLog', 'Журнал решений', 'Decision Log', 'Шешімдер журналы', 'Karar Günlüğü', '决策日志'],

  // Общая информация
  ['fieldPackageNumber', 'Номер пакета', 'Package Number', 'Пакет нөмірі', 'Paket Numarası', '包编号'],
  ['fieldWorker', 'Работник', 'Worker', 'Қызметкер', 'Çalışan', '员工'],
  ['fieldOrganization', 'Организация', 'Organization', 'Ұйым', 'Kuruluş', '组织'],
  ['fieldProject', 'Проект', 'Project', 'Жоба', 'Proje', '项目'],
  ['fieldObject', 'Объект', 'Object', 'Нысан', 'Nesne', '对象'],
  ['fieldStatus', 'Статус', 'Status', 'Мәртебе', 'Durum', '状态'],
  ['fieldCreatedAt', 'Создан', 'Created', 'Құрылды', 'Oluşturuldu', '创建时间'],
  ['fieldCreatedBy', 'Автор', 'Author', 'Авторы', 'Oluşturan', '创建人'],
  ['fieldUpdatedAt', 'Последнее изменение', 'Last Modified', 'Соңғы өзгеріс', 'Son Değişiklik', '最后修改'],
  ['fieldPreviousPackage', 'Предыдущий пакет', 'Previous Package', 'Алдыңғы пакет', 'Önceki Paket', '前一个准入包'],

  // Применённые матрицы требований
  ['appliedMatricesEmpty', 'К пакету пока не применена ни одна матрица требований', 'No requirement matrices applied to the package yet', 'Пакетке әлі бір де талаптар матрицасы қолданылмаған', 'Pakete henüz bir gereksinim matrisi uygulanmadı', '尚未对该包应用任何要求矩阵'],
  ['appliedMatrixReasonLabel', 'Основание применения', 'Applied because of', 'Қолдану негізі', 'Uygulama nedeni', '应用依据'],
  ['appliedMatrixVersionLabel', 'Версия на момент применения', 'Version at time of application', 'Қолдану кезіндегі нұсқа', 'Uygulama anındaki sürüm', '应用时版本'],

  // Требования пакета
  ['requirementsMandatoryTitle', 'Обязательные требования', 'Mandatory Requirements', 'Міндетті талаптар', 'Zorunlu Gereksinimler', '必需要求'],
  ['requirementsOptionalTitle', 'Дополнительные требования', 'Optional Requirements', 'Қосымша талаптар', 'Ek Gereksinimler', '附加要求'],
  ['requirementsEmpty', 'Требования ещё не сформированы', 'No requirements defined yet', 'Талаптар әлі қалыптастырылмаған', 'Henüz gereksinim tanımlanmadı', '尚未设定要求'],
  ['requirementEditableLabel', 'Доступно для редактирования подрядчиком', 'Editable by contractor', 'Мердігер өңдей алады', 'Yüklenici tarafından düzenlenebilir', '承包商可编辑'],
  ['requirementLockedLabel', 'Изменение недоступно', 'Editing locked', 'Өзгерту қолжетімсіз', 'Düzenleme kilitli', '禁止编辑'],

  // Категории требований (п.3 ТЗ)
  ['categoryDocuments', 'Документы', 'Documents', 'Құжаттар', 'Belgeler', '文件'],
  ['categoryTraining', 'Обучение', 'Training', 'Оқыту', 'Eğitim', '培训'],
  ['categoryMedicalExams', 'Медосмотры', 'Medical Exams', 'Медициналық қараулар', 'Sağlık Muayeneleri', '体检'],
  ['categoryQualification', 'Квалификация', 'Qualification', 'Біліктілік', 'Yeterlilik', '资质'],
  ['categorySecurityRequirements', 'Требования Службы безопасности', 'Security Requirements', 'Қауіпсіздік қызметінің талаптары', 'Güvenlik Gereksinimleri', '安保要求'],
  ['categoryPpeWarehouse', 'Требования склада СИЗ', 'PPE Warehouse Requirements', 'ЖҚҚ қоймасының талаптары', 'KKD Deposu Gereksinimleri', 'PPE仓库要求'],

  // Независимые параллельные проверки (п.4–5 ТЗ)
  ['reviewStatusPending', 'Ожидает', 'Pending', 'Күтілуде', 'Bekliyor', '待处理'],
  ['reviewStatusInReview', 'На рассмотрении', 'In Review', 'Қаралуда', 'İnceleniyor', '审核中'],
  ['reviewStatusApproved', 'Одобрено', 'Approved', 'Мақұлданды', 'Onaylandı', '已批准'],
  ['reviewStatusRejected', 'Отклонено', 'Rejected', 'Бас тартылды', 'Reddedildi', '已拒绝'],
  ['reviewStatusRevisionRequested', 'Запрошена доработка', 'Revision Requested', 'Пысықтау сұралды', 'Revizyon İstendi', '要求修改'],
  ['reviewReviewerLabel', 'Проверяющий', 'Reviewer', 'Тексеруші', 'İnceleyen', '审核人'],
  ['reviewDecidedAtLabel', 'Дата решения', 'Decision Date', 'Шешім қабылданған күн', 'Karar Tarihi', '决策日期'],
  ['reviewCommentLabel', 'Комментарий', 'Comment', 'Пікір', 'Yorum', '备注'],
  ['reviewIndependentNotice', 'Раздел независим: решение другой стороны не влияет на эту проверку и не ожидается.', 'This section is independent: the other party\u2019s decision does not affect or block this review.', 'Бөлім тәуелсіз: екінші тараптың шешімі бұл тексеруге әсер етпейді және күтілмейді.', 'Bu bölüm bağımsızdır: diğer tarafın kararı bu incelemeyi etkilemez ve beklenmez.', '本部分独立：另一方的决定不影响也不等待此审核。'],

  // История
  ['historyEmptyState', 'История изменений пуста', 'Change history is empty', 'Өзгерістер тарихы бос', 'Değişiklik geçmişi boş', '变更历史为空'],

  // Журнал решений (Decision Log, п.7 ТЗ)
  ['decisionLogEmptyState', 'Решения по пакету ещё не зафиксированы', 'No decisions recorded for this package yet', 'Пакет бойынша шешімдер әлі тіркелмеген', 'Bu paket için henüz karar kaydedilmedi', '尚未记录该包的决策'],
  ['decisionJustificationLabel', 'Основание решения', 'Decision Justification', 'Шешім негіздемесі', 'Karar Gerekçesi', '决策依据'],
  ['decisionRoleContractor', 'Подрядчик', 'Contractor', 'Мердігер', 'Yüklenici', '承包商'],
  ['decisionRoleOtPb', 'ОТ/ПБ', 'OHS', 'ЕТ/ӨҚ', 'İSG', '劳动安全'],
  ['decisionRoleSecurity', 'Служба безопасности', 'Security', 'Қауіпсіздік қызметі', 'Güvenlik', '安保部门'],
  ['decisionRoleSystem', 'Noventra (система)', 'Noventra (system)', 'Noventra (жүйе)', 'Noventra (sistem)', 'Noventra（系统）'],
];
