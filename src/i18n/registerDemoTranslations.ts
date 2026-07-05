import { translationRegistry, LanguageNamespace } from '@/core';
import { menuTranslations } from './translations/menu';
import { commonTranslations } from './translations/common';
import { modulesTranslations } from './translations/modules';

/**
 * Регистрация демонстрационных переводов через публичный API Language Engine.
 * Это НЕ часть архитектуры ядра — обычный "клиент" Language Engine, показывающий,
 * как любой существующий или будущий модуль подключает свои переводы.
 * Ядро (translationRegistry/languageService) не изменялось.
 */
let registered = false;

export function registerDemoTranslations(): void {
  if (registered) return;
  registered = true;

  translationRegistry.registerNamespace(LanguageNamespace.Menu, menuTranslations);
  translationRegistry.registerNamespace(LanguageNamespace.Common, commonTranslations);
  translationRegistry.registerNamespace('modules', modulesTranslations);
}
