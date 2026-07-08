import { aiEngineService } from './aiEngineService';
import { aiRouter } from './aiRouter';
import { aiProviderManager } from './aiProviderManager';
import { promptManager } from './promptManager';
import { contextManager } from './contextManager';
import { memoryManager } from './memoryManager';
import { toolRegistry } from './toolRegistry';
import { aiConfiguration } from './aiConfiguration';
import { aiActionLog, initAIActionLogBridge } from './aiActionLog';
import { providerRegistry } from './providerRegistry';
import { registerBuiltinProviders } from './providers';

/**
 * AI Core — единая точка входа во всю инфраструктуру AI Engine Noventra Core.
 *
 * По аналогии с src/core/index.ts (который объединяет 16 сервисов ядра
 * платформы), aiCore объединяет все внутренние сервисы AI Engine в один
 * фасад — модули могут импортировать либо отдельные сервисы напрямую
 * (aiEngineService, promptManager и т.д.), либо весь набор через aiCore.
 *
 * initAICore() — единая точка инициализации AI Engine, вызывается один раз
 * при старте приложения (по образцу initAuditEventBridge + registerBuiltinProviders
 * в App.tsx): регистрирует встроенных провайдеров и поднимает мост
 * Event Bus → AI Action Log.
 */
let initialized = false;

function initAICore(): void {
  if (initialized) return;
  initialized = true;

  registerBuiltinProviders();
  initAIActionLogBridge();
}

export const aiCore = {
  initAICore,
  engine: aiEngineService,
  router: aiRouter,
  providers: aiProviderManager,
  registry: providerRegistry,
  prompts: promptManager,
  context: contextManager,
  memory: memoryManager,
  tools: toolRegistry,
  configuration: aiConfiguration,
  actionLog: aiActionLog,
};
