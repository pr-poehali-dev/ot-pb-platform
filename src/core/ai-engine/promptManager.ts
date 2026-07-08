import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { PromptTemplate } from './types';

/**
 * Prompt Manager — реестр переиспользуемых шаблонов промптов AI Engine.
 *
 * Архитектура повторяет паттерн Translation Management (dictionaryService):
 * любой модуль регистрирует свои шаблоны через upsertTemplate(), а получает
 * готовый текст через render(id, params) — с той же нотацией {{param}},
 * что и Language Engine (см. core/language/languageService.interpolate).
 * Ядро не хранит бизнес-текстов — шаблоны предоставляют сами модули.
 */
const store = createStore<Record<string, PromptTemplate>>({});

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, paramName) =>
    paramName in params ? String(params[paramName]) : match
  );
}

function registerTemplate(template: PromptTemplate): void {
  store.setState((prev) => ({ ...prev, [template.id]: template }));
  eventBus.emit('ai-engine.prompt_registered', { id: template.id, namespace: template.namespace }, 'prompt-manager');
}

function upsertTemplate(template: PromptTemplate): void {
  registerTemplate(template);
}

function getTemplate(id: string): PromptTemplate | undefined {
  return store.getState()[id];
}

function listTemplates(namespace?: string): PromptTemplate[] {
  const all = Object.values(store.getState());
  return namespace ? all.filter((t) => t.namespace === namespace) : all;
}

/** Рендер шаблона по id с подстановкой параметров {{param}}. */
function render(id: string, params?: Record<string, string | number>): string {
  const template = getTemplate(id);
  if (!template) {
    throw new Error(`Prompt template "${id}" is not registered`);
  }
  return interpolate(template.template, params);
}

export const promptManager = {
  store,
  registerTemplate,
  upsertTemplate,
  getTemplate,
  listTemplates,
  render,
};
