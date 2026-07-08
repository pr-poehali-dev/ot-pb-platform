import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { AITool, AIToolCall } from './types';

/**
 * Tool Registry — реестр инструментов (function calling) AI Engine.
 *
 * Архитектура идентична providerRegistry: любой модуль регистрирует свой
 * инструмент через registerTool() (имя + JSON Schema параметров + handler),
 * а AI Router вызывает его по имени через executeTool() — не зная деталей
 * реализации. Ядро не содержит бизнес-инструментов, только механизм.
 */
const store = createStore<Record<string, AITool>>({});

function registerTool(tool: AITool): void {
  store.setState((prev) => ({ ...prev, [tool.definition.name]: tool }));
  eventBus.emit('ai-engine.tool_registered', { name: tool.definition.name }, 'tool-registry');
}

function unregisterTool(name: string): void {
  store.setState((prev) => {
    const next = { ...prev };
    delete next[name];
    return next;
  });
}

function getTool(name: string): AITool | undefined {
  return store.getState()[name];
}

function listTools(): AITool[] {
  return Object.values(store.getState());
}

/** Выполнение вызова инструмента, запрошенного моделью (AIToolCall). */
async function executeTool(call: AIToolCall): Promise<unknown> {
  const tool = getTool(call.name);
  if (!tool) {
    throw new Error(`AI tool "${call.name}" is not registered`);
  }
  eventBus.emit('ai-engine.tool_call_started', { name: call.name }, 'tool-registry');
  try {
    const result = await tool.handler(call.arguments);
    eventBus.emit('ai-engine.tool_call_finished', { name: call.name }, 'tool-registry');
    return result;
  } catch (error) {
    eventBus.emit('ai-engine.tool_call_failed', { name: call.name, error: String(error) }, 'tool-registry');
    throw error;
  }
}

export const toolRegistry = {
  store,
  registerTool,
  unregisterTool,
  getTool,
  listTools,
  executeTool,
};
