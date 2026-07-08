import { aiEngineService } from './aiEngineService';
import { contextManager } from './contextManager';
import { memoryManager } from './memoryManager';
import { toolRegistry } from './toolRegistry';
import { AIConverseInput, AIConverseResult, AIMessage } from './types';

/**
 * AI Router — единая точка оркестрации диалога с AI Engine.
 *
 * Собирает воедино существующие независимые сервисы AI Engine:
 *  - Context Manager  — сворачивает AIContext в системное сообщение
 *  - Memory Manager    — подставляет историю сессии и сохраняет новые реплики
 *  - Tool Registry     — предоставляет модели декларации доступных инструментов
 *  - aiEngineService    — фактическая отправка запроса выбранному провайдеру
 *
 * Модули НЕ обязаны использовать AI Router — можно продолжать вызывать
 * aiEngineService.send() напрямую (как делает aiAutoTranslate.ts). AI Router —
 * это более высокоуровневый, опциональный путь для сценариев, где нужен
 * контекст/память/инструменты одновременно.
 */
async function converse(input: AIConverseInput): Promise<AIConverseResult> {
  const messages: AIMessage[] = [];

  if (input.context) {
    const resolved = contextManager.resolve(input.context);
    if (resolved.systemText) {
      messages.push({ role: 'system', content: resolved.systemText });
    }
  }

  if (input.sessionId) {
    messages.push(...memoryManager.listMessages(input.sessionId).map(({ role, content }) => ({ role, content })));
  }

  messages.push({ role: 'user', content: input.prompt });

  const toolDefinitions = (input.tools ?? [])
    .map((name) => toolRegistry.getTool(name)?.definition)
    .filter((def): def is NonNullable<typeof def> => Boolean(def));

  const response = await aiEngineService.send({
    messages,
    modelId: input.modelId,
    params: {
      ...input.params,
      ...(toolDefinitions.length ? { tools: toolDefinitions } : {}),
    },
  });

  if (input.sessionId) {
    memoryManager.appendMessage(input.sessionId, { role: 'user', content: input.prompt });
    memoryManager.appendMessage(input.sessionId, { role: 'assistant', content: response.content });
  }

  return { response };
}

export const aiRouter = {
  converse,
};
