import { AIProviderId } from '@/core';

/**
 * Группировка встроенных провайдеров AI Engine по компании-вендору —
 * чисто презентационный уровень для панели «Noventra AI» (двухступенчатый
 * выбор «провайдер компании → модель»). НЕ меняет providerRegistry:
 * id модели (chatgpt/claude/gemini/grok/deepseek/qwen) остаётся тем же,
 * что зарегистрирован в src/core/ai-engine/providers/*.ts.
 */
export interface AIVendor {
  id: string;
  labelKey: string;
  modelIds: AIProviderId[];
}

export const AI_VENDORS: AIVendor[] = [
  { id: 'openai', labelKey: 'ai-engine:vendorOpenai', modelIds: ['chatgpt'] },
  { id: 'anthropic', labelKey: 'ai-engine:vendorAnthropic', modelIds: ['claude'] },
  { id: 'google', labelKey: 'ai-engine:vendorGoogle', modelIds: ['gemini'] },
  { id: 'xai', labelKey: 'ai-engine:vendorXai', modelIds: ['grok'] },
  { id: 'deepseek', labelKey: 'ai-engine:vendorDeepseek', modelIds: ['deepseek'] },
  { id: 'alibaba', labelKey: 'ai-engine:vendorAlibaba', modelIds: ['qwen'] },
];

export function findVendorByModelId(modelId: AIProviderId): AIVendor | undefined {
  return AI_VENDORS.find((v) => v.modelIds.includes(modelId));
}
