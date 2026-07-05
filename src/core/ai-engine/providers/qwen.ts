import { AIProviderAdapter, AIRequest, AIResponse } from '../types';

/**
 * Адаптер провайдера Qwen (Alibaba).
 * API пока не подключён — send() является архитектурной заглушкой.
 */
async function send(_request: AIRequest): Promise<AIResponse> {
  throw new Error('Qwen provider is not connected yet');
}

export const qwenProvider: AIProviderAdapter = {
  meta: {
    id: 'qwen',
    label: 'Qwen',
    descriptionKey: 'ai-engine:providers.qwen.description',
    enabled: false,
  },
  send,
};
