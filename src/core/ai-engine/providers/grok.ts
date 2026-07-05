import { AIProviderAdapter, AIRequest, AIResponse } from '../types';

/**
 * Адаптер провайдера Grok (xAI).
 * API пока не подключён — send() является архитектурной заглушкой.
 */
async function send(_request: AIRequest): Promise<AIResponse> {
  throw new Error('Grok provider is not connected yet');
}

export const grokProvider: AIProviderAdapter = {
  meta: {
    id: 'grok',
    label: 'Grok',
    descriptionKey: 'ai-engine:providers.grok.description',
    enabled: false,
  },
  send,
};
