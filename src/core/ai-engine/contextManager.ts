import { AIContext, AIContextContribution, ResolvedContext } from './types';

/**
 * Context Manager — сборка контекста запроса к AI Engine.
 *
 * Модули не формируют системный текст руками — они передают AIContext
 * (опциональная привязка к сущности через EntityRef + список contributions),
 * а Context Manager сворачивает его в единый системный текст для AIRequest.
 * Ядро не знает семантики contributions — это произвольные данные модулей.
 */
function addContribution(context: AIContext, contribution: AIContextContribution): AIContext {
  return { ...context, contributions: [...context.contributions, contribution] };
}

function createContext(base?: Partial<AIContext>): AIContext {
  return { contributions: [], ...base };
}

/** Свёртка контекста в единый системный текст, готовый для AIMessage(role: 'system'). */
function resolve(context: AIContext): ResolvedContext {
  const lines: string[] = [];

  if (context.entity) {
    lines.push(`Entity: ${context.entity.type}#${context.entity.id}`);
  }
  if (context.locale) {
    lines.push(`Locale: ${context.locale}`);
  }
  context.contributions.forEach((contribution) => {
    lines.push(`[${contribution.source}] ${JSON.stringify(contribution.data)}`);
  });

  return {
    systemText: lines.join('\n'),
    contributions: context.contributions,
  };
}

export const contextManager = {
  createContext,
  addContribution,
  resolve,
};
