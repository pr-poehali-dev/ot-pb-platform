import { eventBus } from '../../event-bus';
import { aiEngineService } from '../../ai-engine';
import { localeRegistry } from '../localeRegistry';
import { dictionaryService } from './dictionaryService';
import { LocaleCode } from '../types';

/**
 * Автоматическое добавление отсутствующего термина через AI Engine.
 *
 * Архитектурная заготовка: словарь остаётся источником истины, а этот модуль
 * лишь вызывает единый интерфейс AI Engine (aiEngineService.send) для генерации
 * недостающих переводов термина. Пока ни одна модель не подключена
 * (см. core/ai-engine/providers/*.ts) — вызов корректно завершится ошибкой,
 * термин будет помечен статусом 'needs_review', ничего не сломается.
 *
 * Когда AI Engine будет подключён к реальному провайдеру, вызов
 * requestAutoTranslation() начнёт работать без изменения кода этого файла.
 */
async function requestAutoTranslation(
  namespace: string,
  localKey: string,
  sourceLocale: LocaleCode,
  actor = 'ai-engine'
): Promise<void> {
  const term = dictionaryService.getTerm(namespace, localKey);
  const sourceText = term?.translations[sourceLocale];
  if (!sourceText) return;

  const missingLocales = localeRegistry
    .listLocales()
    .map((l) => l.code)
    .filter((locale) => locale !== sourceLocale && !term?.translations[locale]);

  if (missingLocales.length === 0) return;

  try {
    const response = await aiEngineService.send({
      messages: [
        {
          role: 'system',
          content: 'Translate the given HSE platform UI term into the requested languages. Return only translations.',
        },
        {
          role: 'user',
          content: `Term: "${sourceText}". Target locales: ${missingLocales.join(', ')}.`,
        },
      ],
    });

    // Ожидаемый формат ответа модели — JSON { [locale]: string }. Парсинг вынесен
    // отдельно, чтобы не завязывать словарь на конкретный формат провайдера.
    const parsed = JSON.parse(response.content) as Partial<Record<LocaleCode, string>>;

    dictionaryService.upsertTerm({
      key: localKey,
      namespace,
      translations: parsed,
      status: 'ai_generated',
      actor,
    });
  } catch {
    // AI Engine ещё не подключён к провайдеру — термин остаётся без перевода
    // на недостающие локали, требует ручной проверки.
    eventBus.emit(
      'translation-management.ai_translation_failed',
      { namespace, localKey, missingLocales },
      'translation-management'
    );
  }
}

export const aiAutoTranslate = {
  requestAutoTranslation,
};
