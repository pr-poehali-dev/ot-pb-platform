import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { workflowDefinitionValidator } from './workflowDefinitionValidator';
import { WorkflowDefinition, WorkflowRegistrationResult } from './types';

/**
 * Workflow Registry — централизованное хранилище WorkflowDefinition платформы.
 * Архитектура идентична ruleRegistry (Business Rules Engine): любой домен
 * регистрирует свой WorkflowDefinition через registerWorkflow() — реестр
 * ничего не знает о бизнес-смысле домена, только хранит и отдаёт определения
 * по ключу (domainId, version).
 *
 * Регистрация ВСЕГДА проходит через workflowDefinitionValidator — невалидное
 * определение в реестр не попадает (см. registerWorkflow: возвращает
 * WorkflowRegistrationResult с полным списком ошибок вместо исключения,
 * чтобы вызывающий код мог показать понятный отчёт).
 *
 * Ключ хранения — `${domainId}@${version}`, что позволяет одновременно
 * держать в реестре несколько версий одного домена (например, во время
 * миграции workflow) — выбор АКТИВНОЙ версии для исполнения остаётся
 * ответственностью вызывающего кода/будущей реализации, не этого реестра.
 */
const store = createStore<Record<string, WorkflowDefinition>>({});

const storeKey = (domainId: string, version: number) => `${domainId}@${version}`;

/**
 * Регистрация WorkflowDefinition. Выполняет полную валидацию
 * (workflowDefinitionValidator.validate) ПЕРЕД записью в реестр — при любой
 * ошибке регистрация отклоняется целиком, реестр не изменяется.
 */
function registerWorkflow(definition: WorkflowDefinition): WorkflowRegistrationResult {
  const validation = workflowDefinitionValidator.validate(definition);

  if (!validation.valid) {
    eventBus.emit(
      'workflow-engine.registration_rejected',
      { domainId: definition.domainId, version: definition.version, errors: validation.errors },
      'workflow-registry'
    );
    return { success: false, errors: validation.errors };
  }

  const key = storeKey(definition.domainId, definition.version);
  store.setState((prev) => ({ ...prev, [key]: definition }));

  eventBus.emit(
    'workflow-engine.registered',
    { domainId: definition.domainId, version: definition.version },
    'workflow-registry'
  );

  return { success: true, definition, errors: [] };
}

function getWorkflow(domainId: string, version: number): WorkflowDefinition | undefined {
  return store.getState()[storeKey(domainId, version)];
}

/** Все зарегистрированные версии WorkflowDefinition конкретного домена, отсортированные по возрастанию версии. */
function listVersions(domainId: string): WorkflowDefinition[] {
  return Object.values(store.getState())
    .filter((d) => d.domainId === domainId)
    .sort((a, b) => a.version - b.version);
}

/** Версия с наибольшим номером для домена — по умолчанию считается последней зарегистрированной. */
function getLatestVersion(domainId: string): WorkflowDefinition | undefined {
  const versions = listVersions(domainId);
  return versions[versions.length - 1];
}

function listAll(): WorkflowDefinition[] {
  return Object.values(store.getState());
}

function listDomainIds(): string[] {
  return Array.from(new Set(listAll().map((d) => d.domainId)));
}

function unregisterWorkflow(domainId: string, version: number): void {
  store.setState((prev) => {
    const next = { ...prev };
    delete next[storeKey(domainId, version)];
    return next;
  });
}

export const workflowRegistry = {
  store,
  registerWorkflow,
  getWorkflow,
  listVersions,
  getLatestVersion,
  listAll,
  listDomainIds,
  unregisterWorkflow,
};
