import { createContext, useContext, useState, ReactNode } from 'react';
import {
  NODES as INITIAL_NODES,
  LEVELS_META,
  LevelId,
  Node,
  EntityHistoryEvent,
  EntityStatus,
} from '@/data/entities';
import { eventBus, CoreEventType, EntityDomainEventPayload } from '@/core';

export const CURRENT_USER = 'Администратор';

/** Домен сущностей иерархии в терминах Event Bus / Audit Log: hierarchy.<level> */
export const entityRef = (node: Pick<Node, 'id' | 'level'>) => ({ type: `hierarchy.${node.level}`, id: node.id });

let idCounter = 1000;
const nextId = (prefix: string) => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

const pad = (n: number) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};
const nowStamp = () => {
  const d = new Date();
  return `${todayStr()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const CODE_PREFIX: Record<LevelId, string> = {
  root: 'ROOT',
  organization: 'ORG',
  company: 'CMP',
  project: 'PRJ',
  object: 'OBJ',
  site: 'SITE',
  contractor: 'CTR',
  subdivision: 'SUB',
  user: 'USR',
};

export interface CreateEntityInput {
  level: LevelId;
  parentId: string;
  name: string;
  code: string;
  owner: string;
  description?: string;
}

export interface EditEntityInput {
  name: string;
  code: string;
  owner: string;
  description?: string;
}

interface EntityStoreValue {
  nodes: Node[];
  getNode: (id: string) => Node | undefined;
  getChildren: (id: string) => Node[];
  getNodesByLevel: (level: LevelId) => Node[];
  getMeta: (level: LevelId) => (typeof LEVELS_META)[number];
  getPath: (id: string) => Node[];
  createEntity: (input: CreateEntityInput) => Node;
  updateEntity: (id: string, input: EditEntityInput) => void;
  archiveEntity: (id: string) => void;
  restoreEntity: (id: string) => void;
}

const EntityStoreContext = createContext<EntityStoreValue | null>(null);

const levelMetaLookup = (level: LevelId) => LEVELS_META.find((l) => l.id === level)!;

/** Публикация доменного события сущности только через Event Bus (единая точка входа для Audit Log). */
const emitEntityEvent = (type: string, payload: EntityDomainEventPayload) => {
  eventBus.emit<EntityDomainEventPayload>(type, payload, 'entity-store');
};

export const EntityStoreProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);

  const getNode = (id: string) => nodes.find((n) => n.id === id);
  const getChildren = (id: string) => nodes.filter((n) => n.parentId === id);
  const getNodesByLevel = (level: LevelId) => nodes.filter((n) => n.level === level);
  const getMeta = levelMetaLookup;
  const getPath = (id: string): Node[] => {
    const path: Node[] = [];
    let current = getNode(id);
    while (current) {
      path.unshift(current);
      current = current.parentId ? getNode(current.parentId) : undefined;
    }
    return path;
  };

  const pushHistory = (id: string, event: Omit<EntityHistoryEvent, 'id'>) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, history: [...(n.history ?? []), { id: nextId('h'), ...event }] }
          : n
      )
    );
  };

  const createEntity = (input: CreateEntityInput): Node => {
    const newNode: Node = {
      id: nextId(CODE_PREFIX[input.level].toLowerCase()),
      level: input.level,
      name: input.name,
      code: input.code,
      status: 'Черновик',
      parentId: input.parentId,
      owner: input.owner,
      createdAt: todayStr(),
      updatedAt: todayStr(),
      description: input.description,
      relatedUsers: [],
      documents: [],
      history: [
        { id: nextId('h'), action: 'Сущность создана', author: CURRENT_USER, date: nowStamp(), icon: 'Sparkles' },
      ],
    };
    setNodes((prev) => [...prev, newNode]);
    emitEntityEvent(CoreEventType.EntityCreated, {
      entity: entityRef(newNode),
      actor: CURRENT_USER,
      description: `Создана сущность «${newNode.name}» (${getMeta(newNode.level).label})`,
    });
    return newNode;
  };

  const updateEntity = (id: string, input: EditEntityInput) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const changes: string[] = [];
        const diff: Record<string, { before: unknown; after: unknown }> = {};
        if (n.name !== input.name) {
          changes.push(`название «${n.name}» → «${input.name}»`);
          diff.name = { before: n.name, after: input.name };
        }
        if (n.code !== input.code) {
          changes.push(`код «${n.code}» → «${input.code}»`);
          diff.code = { before: n.code, after: input.code };
        }
        if ((n.owner ?? '') !== input.owner) {
          changes.push(`ответственный «${n.owner ?? '—'}» → «${input.owner}»`);
          diff.owner = { before: n.owner, after: input.owner };
        }
        if ((n.description ?? '') !== (input.description ?? '')) {
          changes.push('описание');
          diff.description = { before: n.description, after: input.description };
        }

        const historyEntry: EntityHistoryEvent = {
          id: nextId('h'),
          action: changes.length ? `Изменено: ${changes.join(', ')}` : 'Данные обновлены без изменений',
          author: CURRENT_USER,
          date: nowStamp(),
          icon: 'Pencil',
        };

        const updated: Node = {
          ...n,
          name: input.name,
          code: input.code,
          owner: input.owner,
          description: input.description,
          updatedAt: todayStr(),
          history: [...(n.history ?? []), historyEntry],
        };

        emitEntityEvent(CoreEventType.EntityUpdated, {
          entity: entityRef(updated),
          actor: CURRENT_USER,
          description: changes.length ? `Изменено: ${changes.join(', ')}` : 'Данные обновлены без изменений',
          diff: Object.keys(diff).length ? diff : undefined,
        });

        return updated;
      })
    );
  };

  const setStatus = (id: string, status: EntityStatus, action: string, icon: string, eventType: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const updated: Node = {
          ...n,
          status,
          updatedAt: todayStr(),
          history: [
            ...(n.history ?? []),
            { id: nextId('h'), action, author: CURRENT_USER, date: nowStamp(), icon },
          ],
        };
        emitEntityEvent(eventType, {
          entity: entityRef(updated),
          actor: CURRENT_USER,
          description: action,
          diff: { status: { before: n.status, after: status } },
        });
        return updated;
      })
    );
  };

  const archiveEntity = (id: string) =>
    setStatus(id, 'Архив', 'Сущность архивирована', 'Archive', CoreEventType.EntityArchived);
  const restoreEntity = (id: string) =>
    setStatus(id, 'Активен', 'Сущность восстановлена из архива', 'RotateCcw', CoreEventType.EntityRestored);

  return (
    <EntityStoreContext.Provider
      value={{
        nodes,
        getNode,
        getChildren,
        getNodesByLevel,
        getMeta,
        getPath,
        createEntity,
        updateEntity,
        archiveEntity,
        restoreEntity,
      }}
    >
      {children}
    </EntityStoreContext.Provider>
  );
};

export const useEntityStore = () => {
  const ctx = useContext(EntityStoreContext);
  if (!ctx) throw new Error('useEntityStore must be used within EntityStoreProvider');
  return ctx;
};
