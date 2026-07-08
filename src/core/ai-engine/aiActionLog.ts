import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { AIActionLogEntry, AIActionType, AIProviderId } from './types';
import { EntityRef } from '../types';

/**
 * AI Action Log — журнал действий AI Engine, по архитектуре Audit Log
 * (core/audit-log): отдельное хранилище в памяти + запись только через
 * record(), без прямого доступа модулей к store. Слушает события AI Engine
 * через Event Bus (см. initAIActionLogBridge) — так же, как Audit Log
 * слушает доменные события сущностей через auditEventBridge.
 */
let counter = 0;
const nextId = () => `ai-action-${++counter}`;

const store = createStore<AIActionLogEntry[]>([]);

interface RecordAIActionInput {
  type: AIActionType;
  providerId: AIProviderId;
  actor: string;
  description: string;
  entity?: EntityRef;
  details?: Record<string, unknown>;
}

function record(input: RecordAIActionInput): AIActionLogEntry {
  const entry: AIActionLogEntry = {
    id: nextId(),
    type: input.type,
    providerId: input.providerId,
    actor: input.actor,
    description: input.description,
    entity: input.entity,
    details: input.details,
    timestamp: new Date().toISOString(),
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('ai-engine.action_recorded', entry, 'ai-action-log');
  return entry;
}

function listAll(): AIActionLogEntry[] {
  return store.getState();
}

function listByProvider(providerId: AIProviderId): AIActionLogEntry[] {
  return store.getState().filter((e) => e.providerId === providerId);
}

function listForEntity(entity: EntityRef): AIActionLogEntry[] {
  return store.getState().filter((e) => e.entity?.type === entity.type && e.entity?.id === entity.id);
}

export const aiActionLog = {
  store,
  record,
  listAll,
  listByProvider,
  listForEntity,
};

/** Публичный список действий — используется для внешних read-only обращений. */
export function listAIActions(): AIActionLogEntry[] {
  return aiActionLog.listAll();
}

let bridgeInitialized = false;

/**
 * Мост Event Bus → AI Action Log, по образцу initAuditEventBridge.
 * Единственное место, где AI Action Log подписывается на события AI Engine
 * (request_sent/response_received/tool_call_*), не требуя от вызывающего кода
 * (aiEngineService, toolRegistry) прямого обращения к aiActionLog.record().
 */
export function initAIActionLogBridge(): void {
  if (bridgeInitialized) return;
  bridgeInitialized = true;

  eventBus.on<{ providerId: AIProviderId; request: unknown }>('ai-engine.request_sent', (event) => {
    record({
      type: 'request',
      providerId: event.payload.providerId,
      actor: 'ai-engine',
      description: `Request sent to "${event.payload.providerId}"`,
    });
  });

  eventBus.on<{ providerId: AIProviderId; response: unknown }>('ai-engine.response_received', (event) => {
    record({
      type: 'response',
      providerId: event.payload.providerId,
      actor: 'ai-engine',
      description: `Response received from "${event.payload.providerId}"`,
    });
  });

  eventBus.on<{ name: string }>('ai-engine.tool_call_started', (event) => {
    record({
      type: 'tool_call',
      providerId: 'tool-registry',
      actor: 'ai-engine',
      description: `Tool call started: "${event.payload.name}"`,
    });
  });

  eventBus.on<{ name: string; error: string }>('ai-engine.tool_call_failed', (event) => {
    record({
      type: 'error',
      providerId: 'tool-registry',
      actor: 'ai-engine',
      description: `Tool call failed: "${event.payload.name}" — ${event.payload.error}`,
    });
  });

  eventBus.on<{ providerId: AIProviderId; error: string }>('ai-engine.request_failed', (event) => {
    record({
      type: 'error',
      providerId: event.payload.providerId,
      actor: 'ai-engine',
      description: `Request failed for "${event.payload.providerId}" — ${event.payload.error}`,
    });
  });
}