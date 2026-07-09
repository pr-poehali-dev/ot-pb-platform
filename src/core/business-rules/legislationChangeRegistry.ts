import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { ruleRegistry } from './ruleRegistry';
import { LegislationChangeProposal, LegislationRuleDraft, RulePriority } from './types';

/**
 * Legislation Change Registry — фиксация изменений законодательства.
 *
 * Требование архитектуры: законодательство НЕ обновляется автоматически.
 * Любое новое или изменённое законодательное требование сначала фиксируется
 * здесь как предложение (proposeChange) со статусом 'pending_confirmation' —
 * оно НЕ попадает в ruleRegistry и не участвует в выполнении правил, пока
 * ответственный специалист явно не подтвердит его (confirmChange). Только
 * подтверждение регистрирует/обновляет правило уровня RulePriority.Legislation
 * в ruleRegistry через defineRule()/updateRule().
 */
let counter = 0;
const nextId = () => `legislation-change-${++counter}`;

const store = createStore<Record<string, LegislationChangeProposal>>({});

function proposeChange(ruleKey: string, proposedRule: LegislationRuleDraft, proposedBy: string): LegislationChangeProposal {
  const proposal: LegislationChangeProposal = {
    id: nextId(),
    ruleKey,
    proposedRule,
    status: 'pending_confirmation',
    proposedBy,
    proposedAt: new Date().toISOString(),
  };
  store.setState((prev) => ({ ...prev, [proposal.id]: proposal }));
  eventBus.emit('business-rules.legislation_change_proposed', { proposalId: proposal.id, ruleKey }, 'legislation-change-registry');
  return proposal;
}

function listPending(): LegislationChangeProposal[] {
  return Object.values(store.getState()).filter((p) => p.status === 'pending_confirmation');
}

function listAll(): LegislationChangeProposal[] {
  return Object.values(store.getState());
}

function getProposal(proposalId: string): LegislationChangeProposal | undefined {
  return store.getState()[proposalId];
}

/**
 * Подтверждение предложенного изменения ответственным специалистом.
 * Только этот вызов активирует новое законодательное требование в ruleRegistry:
 * если правило с таким id уже существует — версионированно обновляется
 * (updateRule), иначе — регистрируется впервые (defineRule). До вызова
 * confirmChange() предложение не оказывает никакого влияния на выполнение правил.
 */
function confirmChange(proposalId: string, reviewedBy: string, reviewComment?: string) {
  const proposal = store.getState()[proposalId];
  if (!proposal || proposal.status !== 'pending_confirmation') return undefined;

  const draft = proposal.proposedRule;
  const existingRule = ruleRegistry.getRule(draft.id);

  const rule = existingRule
    ? ruleRegistry.updateRule(draft.id, {
        ...draft,
        priority: RulePriority.Legislation,
        changedBy: reviewedBy,
        changeDescription: `Legislation change confirmed: ${draft.changeDescription}`,
      })
    : ruleRegistry.defineRule({ ...draft, priority: RulePriority.Legislation });

  const updatedProposal: LegislationChangeProposal = {
    ...proposal,
    status: 'confirmed',
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewComment,
  };
  store.setState((prev) => ({ ...prev, [proposalId]: updatedProposal }));
  eventBus.emit(
    'business-rules.legislation_change_confirmed',
    { proposalId, ruleKey: proposal.ruleKey, ruleId: draft.id, reviewedBy },
    'legislation-change-registry'
  );
  return rule;
}

/** Отклонение предложенного изменения — правило не создаётся и не обновляется. */
function rejectChange(proposalId: string, reviewedBy: string, reviewComment?: string): void {
  const proposal = store.getState()[proposalId];
  if (!proposal || proposal.status !== 'pending_confirmation') return;

  const updatedProposal: LegislationChangeProposal = {
    ...proposal,
    status: 'rejected',
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    reviewComment,
  };
  store.setState((prev) => ({ ...prev, [proposalId]: updatedProposal }));
  eventBus.emit(
    'business-rules.legislation_change_rejected',
    { proposalId, ruleKey: proposal.ruleKey, reviewedBy },
    'legislation-change-registry'
  );
}

export const legislationChangeRegistry = {
  store,
  proposeChange,
  listPending,
  listAll,
  getProposal,
  confirmChange,
  rejectChange,
};
