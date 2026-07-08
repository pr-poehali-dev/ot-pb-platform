import { TermTuple } from '../types';

/**
 * Переводы AI Engine — панель «Noventra AI» и описания встроенных провайдеров
 * (namespace: ai-engine). Провайдеры (src/core/ai-engine/providers/*.ts) уже
 * ссылаются на ключи вида "ai-engine:providers.<id>.description" — здесь
 * они получают реальные переводы через Translation Management, без изменения
 * архитектуры AI Engine.
 */
export const aiEngineTerms: TermTuple[] = [
  // Кнопка и панель в верхней панели
  ['panelButton', 'Noventra AI', 'Noventra AI', 'Noventra AI', 'Noventra AI', 'Noventra AI'],
  ['panelTitle', 'Noventra AI', 'Noventra AI', 'Noventra AI', 'Noventra AI', 'Noventra AI'],
  ['panelSubtitle', 'Управление ИИ-движком платформы', 'Platform AI engine control', 'Платформаның ЖИ қозғалтқышын басқару', 'Platform YZ motorunun yönetimi', '平台AI引擎控制'],

  // Статусы
  ['statusOn', 'Включён', 'On', 'Қосулы', 'Açık', '已启用'],
  ['statusOff', 'Выключен', 'Off', 'Өшірулі', 'Kapalı', '已禁用'],
  ['statusConnected', 'Подключено', 'Connected', 'Қосылған', 'Bağlandı', '已连接'],
  ['statusNotConnected', 'Не подключено', 'Not connected', 'Қосылмаған', 'Bağlı değil', '未连接'],
  ['statusChecking', 'Проверка…', 'Checking…', 'Тексерілуде…', 'Kontrol ediliyor…', '检查中…'],

  // Поля управления
  ['toggleLabel', 'Состояние AI', 'AI state', 'ЖИ күйі', 'YZ durumu', 'AI 状态'],
  ['providerLabel', 'Провайдер', 'Provider', 'Провайдер', 'Sağlayıcı', '提供商'],
  ['modelLabel', 'Модель', 'Model', 'Модель', 'Model', '模型'],
  ['providerPlaceholder', 'Выберите провайдера', 'Select provider', 'Провайдерді таңдаңыз', 'Sağlayıcı seçin', '选择提供商'],

  // Кнопки
  ['checkConnection', 'Проверить подключение', 'Check connection', 'Байланысты тексеру', 'Bağlantıyı kontrol et', '检查连接'],
  ['openSettings', 'Настройки AI', 'AI settings', 'ЖИ параметрлері', 'YZ ayarları', 'AI 设置'],

  // Toast/уведомления проверки подключения
  ['checkSuccessTitle', 'Подключение установлено', 'Connection established', 'Байланыс орнатылды', 'Bağlantı kuruldu', '连接已建立'],
  ['checkSuccessDesc', 'Провайдер «{{provider}}» ответил успешно', 'Provider "{{provider}}" responded successfully', '«{{provider}}» провайдері сәтті жауап берді', '"{{provider}}" sağlayıcısı başarıyla yanıt verdi', '提供商"{{provider}}"响应成功'],
  ['checkFailedTitle', 'Не удалось подключиться', 'Connection failed', 'Қосылу мүмкін болмады', 'Bağlantı kurulamadı', '连接失败'],
  ['checkFailedDesc', 'Провайдер «{{provider}}»: {{error}}', 'Provider "{{provider}}": {{error}}', '«{{provider}}» провайдері: {{error}}', '"{{provider}}" sağlayıcısı: {{error}}', '提供商"{{provider}}"：{{error}}'],

  // Настройки AI (диалог)
  ['settingsTitle', 'Настройки Noventra AI', 'Noventra AI settings', 'Noventra AI параметрлері', 'Noventra AI ayarları', 'Noventra AI 设置'],
  ['settingsDescription', 'Управление провайдерами и параметрами AI Engine', 'Manage AI Engine providers and parameters', 'AI Engine провайдерлері мен параметрлерін басқару', 'AI Engine sağlayıcılarını ve parametrelerini yönetin', '管理AI引擎提供商和参数'],
  ['availableProviders', 'Доступные провайдеры', 'Available providers', 'Қолжетімді провайдерлер', 'Kullanılabilir sağlayıcılar', '可用提供商'],
  ['enableProvider', 'Включить провайдера', 'Enable provider', 'Провайдерді қосу', 'Sağlayıcıyı etkinleştir', '启用提供商'],
  ['actionLogTitle', 'Журнал действий AI', 'AI action log', 'ЖИ әрекеттер журналы', 'YZ işlem günlüğü', 'AI 操作日志'],
  ['actionLogEmpty', 'Действий пока нет', 'No actions yet', 'Әрекеттер әлі жоқ', 'Henüz işlem yok', '暂无操作记录'],

  // Названия компаний-вендоров — чисто презентационная группировка в UI панели
  // (двухуровневый выбор «провайдер → модель»); реестр моделей (providerRegistry)
  // не меняется, id модели остаётся тем же.
  ['vendorOpenai', 'OpenAI', 'OpenAI', 'OpenAI', 'OpenAI', 'OpenAI'],
  ['vendorAnthropic', 'Anthropic', 'Anthropic', 'Anthropic', 'Anthropic', 'Anthropic'],
  ['vendorGoogle', 'Google', 'Google', 'Google', 'Google', 'Google'],
  ['vendorXai', 'xAI', 'xAI', 'xAI', 'xAI', 'xAI'],
  ['vendorDeepseek', 'DeepSeek', 'DeepSeek', 'DeepSeek', 'DeepSeek', 'DeepSeek'],
  ['vendorAlibaba', 'Alibaba', 'Alibaba', 'Alibaba', 'Alibaba', 'Alibaba'],

  // Провайдеры (описания) — ключи точно соответствуют AIModelMeta.descriptionKey
  // вида "ai-engine:providers.<id>.description" в src/core/ai-engine/providers/*.ts
  ['providers.chatgpt.description', 'Модель OpenAI общего назначения', 'General-purpose OpenAI model', 'OpenAI жалпы мақсаттағы моделі', 'OpenAI genel amaçlı model', 'OpenAI通用模型'],
  ['providers.claude.description', 'Модель Anthropic для аналитики и текста', 'Anthropic model for analysis and text', 'Талдау мен мәтінге арналған Anthropic моделі', 'Analiz ve metin için Anthropic modeli', '用于分析和文本的Anthropic模型'],
  ['providers.gemini.description', 'Модель Google с мультимодальными возможностями', 'Google model with multimodal capabilities', 'Мультимодальды мүмкіндіктері бар Google моделі', 'Çok modlu yeteneklere sahip Google modeli', '具有多模态能力的Google模型'],
  ['providers.grok.description', 'Модель xAI с фокусом на актуальные данные', 'xAI model focused on up-to-date data', 'Өзекті деректерге бағытталған xAI моделі', 'Güncel verilere odaklanan xAI modeli', '专注于最新数据的xAI模型'],
  ['providers.deepseek.description', 'Модель DeepSeek для рассуждений и кода', 'DeepSeek model for reasoning and code', 'Пайымдау мен код үшін DeepSeek моделі', 'Akıl yürütme ve kod için DeepSeek modeli', '用于推理和代码的DeepSeek模型'],
  ['providers.qwen.description', 'Модель Qwen (Alibaba) многоязычного назначения', 'Qwen (Alibaba) multilingual model', 'Qwen (Alibaba) көптілді моделі', 'Qwen (Alibaba) çok dilli model', 'Qwen（阿里巴巴）多语言模型'],
];