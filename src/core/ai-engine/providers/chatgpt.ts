import { AIProviderAdapter, AIRequest, AIResponse } from '../types';
import func2url from '../../../../backend/func2url.json';

const PROXY_URL = (func2url as Record<string, string>)['ai-chatgpt-proxy'];

/**
 * Адаптер провайдера ChatGPT (OpenAI).
 * Реальный вызов через backend-прокси (ai-chatgpt-proxy), который хранит
 * OPENAI_API_KEY в секретах проекта и обращается к OpenAI Chat Completions API.
 * Контракт AIProviderAdapter не изменён — AI Engine по-прежнему не знает
 * деталей реализации конкретного провайдера.
 */
async function send(request: AIRequest): Promise<AIResponse> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: request.messages, params: request.params }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? `ChatGPT provider responded with status ${response.status}`);
  }

  return {
    modelId: 'chatgpt',
    content: data.content ?? '',
    raw: data.raw,
  };
}

export const chatgptProvider: AIProviderAdapter = {
  meta: {
    id: 'chatgpt',
    label: 'ChatGPT',
    descriptionKey: 'ai-engine:providers.chatgpt.description',
    enabled: true,
  },
  send,
};
