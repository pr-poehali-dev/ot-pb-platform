/**
 * AI Engine — независимый движок искусственного интеллекта Noventra Core.
 *
 * Архитектура (по аналогии с остальными 15 сервисами ядра — event-bus,
 * audit-log, language и т.д. — каждый компонент независим и объединяется
 * через собственный реестр/стор, без знания бизнес-модулей):
 *
 *  - types              — единый контракт AIProviderAdapter/AIRequest/AIResponse
 *                          и типы всей инфраструктуры (Prompt/Context/Memory/Tool/
 *                          Configuration/Router/ActionLog)
 *  - providerRegistry    — реестр моделей (открыт для расширения без изменения кода)
 *  - providers/*         — по одному файлу-адаптеру на модель (ChatGPT, Claude, Gemini,
 *                          Grok, DeepSeek, Qwen); API пока не подключены (заглушки send())
 *  - aiEngineService     — активная модель пользователя + send() — единая точка
 *                          низкоуровневого вызова для всех модулей платформы
 *  - aiProviderManager    — административный слой: включение моделей, платформенный
 *                          дефолт (поверх providerRegistry + aiConfiguration)
 *  - promptManager        — реестр переиспользуемых шаблонов промптов (по паттерну
 *                          Translation Management: registerTemplate + render)
 *  - contextManager       — сборка AIContext (EntityRef + contributions) в системный текст
 *  - memoryManager        — история диалогов по sessionId, в памяти процесса
 *  - toolRegistry         — реестр инструментов (function calling) + executeTool()
 *  - aiConfiguration      — платформенные настройки AI Engine (persist в localStorage)
 *  - aiActionLog          — журнал действий AI Engine, по архитектуре Audit Log
 *  - aiRouter             — высокоуровневая оркестрация: converse() собирает контекст +
 *                          память + инструменты и вызывает aiEngineService.send()
 *  - aiCore               — единый фасад надо всеми сервисами AI Engine + initAICore()
 *  - useAIEngine/useAIModels/useAIHub — React-хуки для компонентов модулей и UI
 *
 * Принципы:
 *  - Модули НЕ обращаются к провайдерам напрямую — только к aiEngineService.send()
 *    (низкий уровень) или aiRouter.converse() (высокий уровень, с контекстом/памятью/
 *    инструментами). AI Engine не зависит от бизнес-модулей.
 *  - Активная модель хранится в персональных настройках пользователя через
 *    core/user-settings (custom-namespace 'ai-engine') — тот же паттерн,
 *    что и активный язык в Language Engine.
 *  - Платформенная конфигурация (дефолтная модель, глобальный рубильник) хранится
 *    отдельно в aiConfiguration — не смешивается с персональными настройками.
 *  - Названия моделей в UI переводятся через Language Engine: каждый провайдер
 *    указывает descriptionKey в namespace 'ai-engine' (см. core/language).
 *  - Все события (регистрация модели, смена модели, запрос/ответ, вызов инструмента,
 *    ошибка) идут только через Event Bus — по той же архитектуре, что и Audit Log;
 *    AI Action Log слушает их через initAIActionLogBridge(), не требуя от вызывающего
 *    кода прямых записей в журнал.
 *  - initAICore() — единая точка инициализации (регистрация провайдеров + мост
 *    Action Log), вызывается один раз при старте приложения.
 */
export * from './types';
export { providerRegistry } from './providerRegistry';
export { aiEngineService } from './aiEngineService';
export { aiProviderManager } from './aiProviderManager';
export { promptManager } from './promptManager';
export { contextManager } from './contextManager';
export { memoryManager } from './memoryManager';
export { toolRegistry } from './toolRegistry';
export { aiConfiguration } from './aiConfiguration';
export { aiActionLog, listAIActions, initAIActionLogBridge } from './aiActionLog';
export { aiRouter } from './aiRouter';
export { aiCore } from './aiCore';
export { useAIEngine } from './useAIEngine';
export { useAIModels } from './useAIModels';
export { useAIHub } from './useAIHub';
export { registerBuiltinProviders } from './providers';
