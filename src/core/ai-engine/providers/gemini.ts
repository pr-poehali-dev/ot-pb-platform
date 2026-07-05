import { AIProviderAdapter, AIRequest, AIResponse } from '../types';

/**
 * Адаптер провайдера Gemini (Google).
 * API пока не подключён — send() является архитектурной заглушкой.
 */
async function send(_request: AIRequest): Promise<AIResponse> {
  throw new Error('Gemini provider is not connected yet');
}

export const geminiProvider: AIProviderAdapter = {
  meta: {
    id: 'gemini',
    label: 'Gemini',
    descriptionKey: 'ai-engine:providers.gemini.description',
    enabled: false,
  },
  send,
};
