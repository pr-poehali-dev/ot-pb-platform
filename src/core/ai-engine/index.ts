/**
 * AI Engine — независимый движок искусственного интеллекта Noventra Core.
 *
 * Архитектура:
 *  - types              — единый контракт AIProviderAdapter/AIRequest/AIResponse
 *  - providerRegistry    — реестр моделей (открыт для расширения без изменения кода)
 *  - providers/*         — по одному файлу-адаптеру на модель (ChatGPT, Claude, Gemini,
 *                          Grok, DeepSeek, Qwen); API пока не подключены (заглушки send())
 *  - aiEngineService     — активная модель пользователя/администратора + send() —
 *                          единая точка вызова для всех модулей платформы
 *  - useAIEngine         — хук вызова ИИ для компонентов модулей
 *  - useAIModels         — хук выбора модели в настройках (пользователь/администратор)
 *
 * Принципы:
 *  - Модули НЕ обращаются к провайдерам напрямую — только к aiEngineService.send()
 *    через хук useAIEngine(). AI Engine не зависит от бизнес-модулей.
 *  - Активная модель хранится в персональных настройках пользователя через
 *    core/user-settings (custom-namespace 'ai-engine') — тот же паттерн,
 *    что и активный язык в Language Engine.
 *  - Названия моделей в UI переводятся через Language Engine: каждый провайдер
 *    указывает descriptionKey в namespace 'ai-engine' (см. core/language).
 *  - Все события (регистрация модели, смена модели, запрос/ответ) идут только
 *    через Event Bus — по той же архитектуре, что и Audit Log.
 */
export * from './types';
export { providerRegistry } from './providerRegistry';
export { aiEngineService } from './aiEngineService';
export { useAIEngine } from './useAIEngine';
export { useAIModels } from './useAIModels';
export { registerBuiltinProviders } from './providers';
