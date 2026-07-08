import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { AIMemoryMessage, AIMemorySession, AIMessage } from './types';

/**
 * Memory Manager — хранилище истории диалогов AI Engine в памяти процесса.
 *
 * Сессии адресуются произвольным sessionId (задаётся вызывающим модулем —
 * например userId, EntityRef-строка или id диалогового окна). Ядро не
 * навязывает семантику ключа. Хранилище в памяти (как Audit Log/Favorites),
 * персистентность может быть добавлена позже без изменения контракта.
 */
let counter = 0;
const nextId = () => `mem-${++counter}`;

const store = createStore<Record<string, AIMemorySession>>({});

function getSession(sessionId: string): AIMemorySession | undefined {
  return store.getState()[sessionId];
}

function listMessages(sessionId: string): AIMemoryMessage[] {
  return getSession(sessionId)?.messages ?? [];
}

function appendMessage(sessionId: string, message: AIMessage): AIMemoryMessage {
  const entry: AIMemoryMessage = { ...message, id: nextId(), timestamp: new Date().toISOString() };

  store.setState((prev) => {
    const existing = prev[sessionId];
    const session: AIMemorySession = {
      id: sessionId,
      messages: [...(existing?.messages ?? []), entry],
      updatedAt: entry.timestamp,
    };
    return { ...prev, [sessionId]: session };
  });

  eventBus.emit('ai-engine.memory_appended', { sessionId, role: message.role }, 'memory-manager');
  return entry;
}

function clearSession(sessionId: string): void {
  store.setState((prev) => {
    const next = { ...prev };
    delete next[sessionId];
    return next;
  });
}

export const memoryManager = {
  store,
  getSession,
  listMessages,
  appendMessage,
  clearSession,
};
