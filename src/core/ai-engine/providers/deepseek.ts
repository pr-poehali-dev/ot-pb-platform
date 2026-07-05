import { AIProviderAdapter, AIRequest, AIResponse } from '../types';

/**
 * Адаптер провайдера DeepSeek.
 * API пока не подключён — send() является архитектурной заглушкой.
 */
async function send(_request: AIRequest): Promise<AIResponse> {
  throw new Error('DeepSeek provider is not connected yet');
}

export const deepseekProvider: AIProviderAdapter = {
  meta: {
    id: 'deepseek',
    label: 'DeepSeek',
    descriptionKey: 'ai-engine:providers.deepseek.description',
    enabled: false,
  },
  send,
};
