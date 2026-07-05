/**
 * Типы AI Engine — независимого движка искусственного интеллекта Noventra Core.
 * Ядро не знает о бизнес-модулях: любой модуль обращается к AI Engine только
 * через единый интерфейс send(request), не зная, какая модель обслуживает запрос.
 */

/** Идентификатор провайдера модели. Открытый тип — новый провайдер не требует изменения типов. */
export type AIProviderId = string;

export type AIMessageRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

/** Метаданные модели для отображения в настройках (выбор пользователем/администратором). */
export interface AIModelMeta {
  id: AIProviderId;
  /** Отображаемое название (бренд модели), не переводится по смыслу */
  label: string;
  /** Ключ перевода описания модели в Language Engine, namespace 'ai-engine' */
  descriptionKey?: string;
  /** Доступна ли модель для выбора (управляется администратором) */
  enabled: boolean;
}

export interface AIRequest {
  messages: AIMessage[];
  /** Явный выбор модели для конкретного запроса, иначе используется активная модель пользователя */
  modelId?: AIProviderId;
  /** Общие параметры вызова (temperature, maxTokens и т.д.) — без бизнес-семантики */
  params?: Record<string, unknown>;
}

export interface AIResponse {
  modelId: AIProviderId;
  content: string;
  /** Необработанный ответ провайдера, для отладки/логирования через Audit Log */
  raw?: unknown;
}

/**
 * Единый контракт адаптера провайдера. Каждая модель (ChatGPT, Claude, Gemini,
 * Grok, DeepSeek, Qwen и любая будущая) реализует этот интерфейс одинаково —
 * AI Engine вызывает send() не зная деталей конкретного провайдера.
 */
export interface AIProviderAdapter {
  meta: AIModelMeta;
  send: (request: AIRequest) => Promise<AIResponse>;
}
