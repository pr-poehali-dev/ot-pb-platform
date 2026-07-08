import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { EntityRef } from '../types';
import { RuleAuditEntry, RuleCategoryValue, RuleOutcome, RuleResult, RuleSeverity } from './types';

/**
 * Rule Audit Log — журнал выполнения бизнес-правил, по архитектуре Audit Log
 * (core/audit-log) и AI Action Log (core/ai-engine/aiActionLog): отдельное
 * хранилище в памяти, запись только через record(), без прямого доступа
 * извне к store. Слушает события Rule Executor через Event Bus
 * (см. initRuleAuditLogBridge) — вызывающий код не обязан писать в журнал сам.
 */
let counter = 0;
const nextId = () => `rule-audit-${++counter}`;

const store = createStore<RuleAuditEntry[]>([]);

interface RecordRuleAuditInput {
  ruleId: string;
  category: RuleCategoryValue;
  outcome: RuleOutcome;
  severity: RuleSeverity;
  actor: string;
  message: string;
  entity?: EntityRef;
  metadata?: Record<string, unknown>;
}

function record(input: RecordRuleAuditInput): RuleAuditEntry {
  const entry: RuleAuditEntry = {
    id: nextId(),
    ruleId: input.ruleId,
    category: input.category,
    outcome: input.outcome,
    severity: input.severity,
    actor: input.actor,
    message: input.message,
    entity: input.entity,
    metadata: input.metadata,
    timestamp: new Date().toISOString(),
  };
  store.setState((prev) => [entry, ...prev]);
  eventBus.emit('business-rules.audit_recorded', entry, 'rule-audit-log');
  return entry;
}

function listAll(): RuleAuditEntry[] {
  return store.getState();
}

function listByRule(ruleId: string): RuleAuditEntry[] {
  return store.getState().filter((e) => e.ruleId === ruleId);
}

function listForEntity(entity: EntityRef): RuleAuditEntry[] {
  return store.getState().filter((e) => e.entity?.type === entity.type && e.entity?.id === entity.id);
}

export const ruleAuditLog = {
  store,
  record,
  listAll,
  listByRule,
  listForEntity,
};

let bridgeInitialized = false;

/**
 * Мост Event Bus → Rule Audit Log, по образцу initAuditEventBridge /
 * initAIActionLogBridge. Единственное место, где Rule Audit Log подписывается
 * на события выполнения правил (business-rules.rule_evaluated) — Rule Executor
 * лишь публикует событие через eventBus.emit(), не обращаясь к ruleAuditLog напрямую.
 */
export function initRuleAuditLogBridge(): void {
  if (bridgeInitialized) return;
  bridgeInitialized = true;

  eventBus.on<{
    ruleId: string;
    category: RuleCategoryValue;
    actor: string;
    entity?: EntityRef;
    result: RuleResult;
  }>('business-rules.rule_evaluated', (event) => {
    const { ruleId, category, actor, entity, result } = event.payload;
    record({
      ruleId,
      category,
      outcome: result.outcome,
      severity: result.severity,
      actor,
      message: result.message,
      entity: result.affectedEntity ?? entity,
      metadata: result.metadata,
    });
  });

  eventBus.on<{ ruleId: string; category: RuleCategoryValue; actor: string; entity?: EntityRef; error: string }>(
    'business-rules.rule_failed',
    (event) => {
      const { ruleId, category, actor, entity, error } = event.payload;
      record({
        ruleId,
        category,
        outcome: 'failed',
        severity: 'high',
        actor,
        message: `Rule execution error: ${error}`,
        entity,
      });
    }
  );
}
