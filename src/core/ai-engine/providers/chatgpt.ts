import { AIProviderAdapter, AIRequest, AIResponse } from '../types';

/**
 * Адаптер провайдера ChatGPT (OpenAI).
 * API пока не подключён — send() является архитектурной заглушкой.
 * Реальная интеграция будет добавлена позже без изменения контракта AIProviderAdapter.
 */
async function send(_request: AIRequest): Promise<AIResponse> {
  throw new Error('ChatGPT provider is not connected yet');
}

export const chatgptProvider: AIProviderAdapter = {
  meta: {
    id: 'chatgpt',
    label: 'ChatGPT',
    descriptionKey: 'ai-engine:providers.chatgpt.description',
    enabled: false,
  },
  send,
};
