import { EntityRef } from '../types';

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

/* ------------------------------------------------------------------ */
/* Prompt Manager                                                      */
/* ------------------------------------------------------------------ */

/**
 * Переиспользуемый шаблон промпта. Текст хранит плейсхолдеры вида {{param}} —
 * та же нотация подстановки, что и в Language Engine (см. core/language),
 * чтобы у модулей не было двух разных синтаксисов интерполяции.
 */
export interface PromptTemplate {
  id: string;
  /** Модуль-владелец шаблона, например 'dictionary', 'translation-management' */
  namespace: string;
  template: string;
  description?: string;
}

/* ------------------------------------------------------------------ */
/* Context Manager                                                     */
/* ------------------------------------------------------------------ */

/** Один вклад в контекст запроса: источник + произвольные сериализуемые данные. */
export interface AIContextContribution {
  source: string;
  data: Record<string, unknown>;
}

/**
 * Контекст конкретного запроса к AI Engine. entity — опциональная привязка
 * к сущности платформы через универсальный EntityRef (как в Audit Log),
 * без знания ядром бизнес-модели.
 */
export interface AIContext {
  entity?: EntityRef;
  locale?: string;
  contributions: AIContextContribution[];
}

/** Контекст, свёрнутый в единый системный текст для подстановки в запрос. */
export interface ResolvedContext {
  systemText: string;
  contributions: AIContextContribution[];
}

/* ------------------------------------------------------------------ */
/* Memory Manager                                                      */
/* ------------------------------------------------------------------ */

export interface AIMemoryMessage extends AIMessage {
  id: string;
  timestamp: string;
}

/** Сессия памяти диалога — привязана к произвольному ключу (пользователь, сущность, модуль). */
export interface AIMemorySession {
  id: string;
  messages: AIMemoryMessage[];
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Tool Registry                                                       */
/* ------------------------------------------------------------------ */

/** Декларация инструмента (function calling), независимая от конкретного провайдера. */
export interface AIToolDefinition {
  name: string;
  description: string;
  /** JSON Schema параметров вызова */
  parameters: Record<string, unknown>;
}

/** Обработчик инструмента — регистрируется модулем, вызывается AI Router по имени. */
export interface AITool {
  definition: AIToolDefinition;
  handler: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

export interface AIToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/* AI Configuration                                                    */
/* ------------------------------------------------------------------ */

export interface AIConfiguration {
  /** Провайдер по умолчанию платформы (fallback, если у пользователя не выбран) */
  defaultProviderId: AIProviderId;
  /** Глобальные параметры вызова по умолчанию (temperature, maxTokens и т.д.) */
  defaultParams: Record<string, unknown>;
  /** Включён ли AI Engine на уровне платформы (административный рубильник) */
  enabled: boolean;
}

/* ------------------------------------------------------------------ */
/* AI Router / AI Hub                                                  */
/* ------------------------------------------------------------------ */

/**
 * Высокоуровневый запрос "диалога" через AI Hub: модуль передаёт только
 * пользовательский текст + опциональные контекст/инструменты/память,
 * а AI Router сам собирает итоговый AIRequest и вызывает aiEngineService.
 */
export interface AIConverseInput {
  prompt: string;
  modelId?: AIProviderId;
  context?: AIContext;
  /** Ключ сессии памяти; если не задан — история не сохраняется */
  sessionId?: string;
  /** Имена инструментов из Tool Registry, доступных модели для этого запроса */
  tools?: string[];
  params?: Record<string, unknown>;
}

export interface AIConverseResult {
  response: AIResponse;
  /** Инструменты, которые модель запросила вызвать (если провайдер их поддерживает) */
  toolCalls?: AIToolCall[];
}

/* ------------------------------------------------------------------ */
/* AI Action Log                                                       */
/* ------------------------------------------------------------------ */

export type AIActionType = 'request' | 'response' | 'tool_call' | 'error';

export interface AIActionLogEntry {
  id: string;
  type: AIActionType;
  providerId: AIProviderId;
  actor: string;
  timestamp: string;
  /** Человекочитаемое описание действия — по аналогии с AuditEntry.description */
  description: string;
  entity?: EntityRef;
  details?: Record<string, unknown>;
}