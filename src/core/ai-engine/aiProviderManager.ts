import { providerRegistry } from './providerRegistry';
import { aiConfiguration } from './aiConfiguration';
import { aiEngineService } from './aiEngineService';
import { AIModelMeta, AIProviderId } from './types';

/**
 * AI Provider Manager — административный слой управления провайдерами моделей.
 *
 * Не дублирует providerRegistry (реестр остаётся единственным источником
 * истины по зарегистрированным адаптерам) — а объединяет его с AI Configuration,
 * чтобы административные экраны работали через один сервис:
 *  - список моделей с состоянием enabled/disabled;
 *  - включение/выключение конкретной модели;
 *  - назначение платформенной модели по умолчанию (aiConfiguration)
 *    и, при необходимости, синхронизация активного провайдера пользователя.
 */
function listModels(): AIModelMeta[] {
  return providerRegistry.listProviders().map((p) => p.meta);
}

function listEnabledModels(): AIModelMeta[] {
  return providerRegistry.listEnabledProviders().map((p) => p.meta);
}

function setModelEnabled(providerId: AIProviderId, enabled: boolean): void {
  providerRegistry.setEnabled(providerId, enabled);
}

function setPlatformDefault(providerId: AIProviderId): void {
  if (!providerRegistry.getProvider(providerId)) return;
  aiConfiguration.setDefaultProvider(providerId);
}

function getPlatformDefault(): AIProviderId {
  return aiConfiguration.get().defaultProviderId;
}

function setPlatformEnabled(enabled: boolean): void {
  aiConfiguration.setEnabled(enabled);
}

function isPlatformEnabled(): boolean {
  return aiConfiguration.get().enabled;
}

/** Активная модель текущего пользователя (делегирует aiEngineService — единая точка правды). */
function getActiveModel(): AIProviderId {
  return aiEngineService.getActiveProviderId();
}

function setActiveModel(providerId: AIProviderId): void {
  aiEngineService.setActiveProvider(providerId);
}

export const aiProviderManager = {
  listModels,
  listEnabledModels,
  setModelEnabled,
  setPlatformDefault,
  getPlatformDefault,
  setPlatformEnabled,
  isPlatformEnabled,
  getActiveModel,
  setActiveModel,
};
