import { AIProviderAdapter, AIRequest, AIResponse } from '../types';

/**
 * Адаптер провайдера Claude (Anthropic).
 * API пока не подключён — send() является архитектурной заглушкой.
 */
async function send(_request: AIRequest): Promise<AIResponse> {
  throw new Error('Claude provider is not connected yet');
}

export const claudeProvider: AIProviderAdapter = {
  meta: {
    id: 'claude',
    label: 'Claude',
    descriptionKey: 'ai-engine:providers.claude.description',
    enabled: false,
  },
  send,
};
