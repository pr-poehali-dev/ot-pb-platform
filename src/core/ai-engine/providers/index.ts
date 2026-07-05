import { providerRegistry } from '../providerRegistry';
import { chatgptProvider } from './chatgpt';
import { claudeProvider } from './claude';
import { geminiProvider } from './gemini';
import { grokProvider } from './grok';
import { deepseekProvider } from './deepseek';
import { qwenProvider } from './qwen';

/**
 * Регистрация провайдеров первого этапа AI Engine.
 * Чтобы добавить новую модель в будущем — достаточно создать новый файл-адаптер
 * (по образцу chatgpt.ts/claude.ts/...) и добавить его сюда одной строкой;
 * ни AI Engine, ни модули платформы менять не нужно.
 */
export function registerBuiltinProviders(): void {
  [chatgptProvider, claudeProvider, geminiProvider, grokProvider, deepseekProvider, qwenProvider].forEach(
    providerRegistry.registerProvider
  );
}

export {
  chatgptProvider,
  claudeProvider,
  geminiProvider,
  grokProvider,
  deepseekProvider,
  qwenProvider,
};
