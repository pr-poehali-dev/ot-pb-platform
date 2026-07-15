import { describe, it, expect } from 'bun:test';
import { workflowRegistry } from '../workflowRegistry';
import { buildValidDefinition } from './fixtures';

/**
 * Тесты используют уникальный domainId на каждый it() (через Date.now() +
 * случайный суффикс), чтобы не зависеть от порядка выполнения и не делить
 * общее состояние модуля-синглтона workflowRegistry между тестами.
 */
const uniqueDomainId = () => `test-domain-${Date.now()}-${Math.random().toString(36).slice(2)}`;

describe('workflowRegistry', () => {
  it('регистрирует валидный WorkflowDefinition и возвращает его по domainId+version', () => {
    const domainId = uniqueDomainId();
    const definition = { ...buildValidDefinition(), domainId, version: 1 };

    const result = workflowRegistry.registerWorkflow(definition);

    expect(result.success).toBe(true);
    expect(result.errors).toEqual([]);
    expect(workflowRegistry.getWorkflow(domainId, 1)).toEqual(definition);
  });

  it('отклоняет регистрацию невалидного WorkflowDefinition и не изменяет реестр', () => {
    const domainId = uniqueDomainId();
    const definition = { ...buildValidDefinition(), domainId, version: 1 };
    definition.states = definition.states.map((s) => (s.id === 'draft' ? { ...s, isStart: false } : s));

    const result = workflowRegistry.registerWorkflow(definition);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(workflowRegistry.getWorkflow(domainId, 1)).toBeUndefined();
  });

  it('поддерживает несколько версий одного домена одновременно', () => {
    const domainId = uniqueDomainId();
    const v1 = { ...buildValidDefinition(), domainId, version: 1 };
    const v2 = { ...buildValidDefinition(), domainId, version: 2 };

    workflowRegistry.registerWorkflow(v1);
    workflowRegistry.registerWorkflow(v2);

    const versions = workflowRegistry.listVersions(domainId);
    expect(versions.map((v) => v.version)).toEqual([1, 2]);
    expect(workflowRegistry.getLatestVersion(domainId)?.version).toBe(2);
  });

  it('listDomainIds включает зарегистрированный домен', () => {
    const domainId = uniqueDomainId();
    workflowRegistry.registerWorkflow({ ...buildValidDefinition(), domainId, version: 1 });

    expect(workflowRegistry.listDomainIds()).toContain(domainId);
  });

  it('unregisterWorkflow удаляет конкретную версию из реестра', () => {
    const domainId = uniqueDomainId();
    workflowRegistry.registerWorkflow({ ...buildValidDefinition(), domainId, version: 1 });

    workflowRegistry.unregisterWorkflow(domainId, 1);

    expect(workflowRegistry.getWorkflow(domainId, 1)).toBeUndefined();
  });
});
