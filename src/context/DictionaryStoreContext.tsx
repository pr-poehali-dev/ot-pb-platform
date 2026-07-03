import { createContext, useContext, useState, ReactNode } from 'react';
import { DICTIONARIES, DictionaryItem, DictionaryStatus } from '@/data/dictionaries';
import { eventBus, CoreEventType, EntityDomainEventPayload } from '@/core';

export const CURRENT_USER = 'Администратор';

/** Домен записей справочников в терминах Event Bus / Audit Log: dictionary.<dictionaryId> */
export const dictionaryEntityRef = (dictionaryId: string, itemId: string) => ({
  type: `dictionary.${dictionaryId}`,
  id: itemId,
});

let idCounter = 5000;
const nextId = (prefix: string) => {
  idCounter += 1;
  return `${prefix.toLowerCase()}-${idCounter}`;
};

const pad = (n: number) => String(n).padStart(2, '0');
const todayStr = () => {
  const d = new Date();
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
};

type ItemsMap = Record<string, DictionaryItem[]>;

const buildInitialState = (): ItemsMap => {
  const state: ItemsMap = {};
  DICTIONARIES.forEach((dict) => {
    state[dict.id] = dict.seed;
  });
  return state;
};

export interface DictionaryFormValues {
  name: string;
  code: string;
  owner: string;
  description?: string;
}

interface DictionaryStoreValue {
  itemsMap: ItemsMap;
  getItems: (dictionaryId: string) => DictionaryItem[];
  getItem: (dictionaryId: string, itemId: string) => DictionaryItem | undefined;
  createItem: (dictionaryId: string, codePrefix: string, values: DictionaryFormValues) => DictionaryItem;
  updateItem: (dictionaryId: string, itemId: string, values: DictionaryFormValues) => void;
  archiveItem: (dictionaryId: string, itemId: string) => void;
  restoreItem: (dictionaryId: string, itemId: string) => void;
}

const DictionaryStoreContext = createContext<DictionaryStoreValue | null>(null);

/** Публикация доменного события записи справочника только через Event Bus. */
const emitEntityEvent = (type: string, payload: EntityDomainEventPayload) => {
  eventBus.emit<EntityDomainEventPayload>(type, payload, 'dictionary-store');
};

export const DictionaryStoreProvider = ({ children }: { children: ReactNode }) => {
  const [itemsMap, setItemsMap] = useState<ItemsMap>(buildInitialState);

  const getItems = (dictionaryId: string) => itemsMap[dictionaryId] ?? [];
  const getItem = (dictionaryId: string, itemId: string) => getItems(dictionaryId).find((i) => i.id === itemId);

  const createItem = (dictionaryId: string, codePrefix: string, values: DictionaryFormValues): DictionaryItem => {
    const newItem: DictionaryItem = {
      id: nextId(codePrefix),
      code: values.code,
      name: values.name,
      owner: values.owner,
      description: values.description,
      status: 'Черновик',
      createdAt: todayStr(),
      updatedAt: todayStr(),
    };
    setItemsMap((prev) => ({ ...prev, [dictionaryId]: [...(prev[dictionaryId] ?? []), newItem] }));
    emitEntityEvent(CoreEventType.EntityCreated, {
      entity: dictionaryEntityRef(dictionaryId, newItem.id),
      actor: CURRENT_USER,
      description: `Создана запись «${newItem.name}» в справочнике «${dictionaryId}»`,
    });
    return newItem;
  };

  const updateItem = (dictionaryId: string, itemId: string, values: DictionaryFormValues) => {
    setItemsMap((prev) => {
      const current = (prev[dictionaryId] ?? []).find((i) => i.id === itemId);
      const diff: Record<string, { before: unknown; after: unknown }> = {};
      if (current) {
        if (current.name !== values.name) diff.name = { before: current.name, after: values.name };
        if (current.code !== values.code) diff.code = { before: current.code, after: values.code };
        if (current.owner !== values.owner) diff.owner = { before: current.owner, after: values.owner };
        if ((current.description ?? '') !== (values.description ?? ''))
          diff.description = { before: current.description, after: values.description };
      }

      emitEntityEvent(CoreEventType.EntityUpdated, {
        entity: dictionaryEntityRef(dictionaryId, itemId),
        actor: CURRENT_USER,
        description: `Обновлена запись «${values.name}»`,
        diff: Object.keys(diff).length ? diff : undefined,
      });

      return {
        ...prev,
        [dictionaryId]: (prev[dictionaryId] ?? []).map((item) =>
          item.id === itemId
            ? { ...item, name: values.name, code: values.code, owner: values.owner, description: values.description, updatedAt: todayStr() }
            : item
        ),
      };
    });
  };

  const setStatus = (dictionaryId: string, itemId: string, status: DictionaryStatus, eventType: string) => {
    setItemsMap((prev) => {
      const current = (prev[dictionaryId] ?? []).find((i) => i.id === itemId);
      emitEntityEvent(eventType, {
        entity: dictionaryEntityRef(dictionaryId, itemId),
        actor: CURRENT_USER,
        description: status === 'Архив' ? 'Запись архивирована' : 'Запись восстановлена из архива',
        diff: current ? { status: { before: current.status, after: status } } : undefined,
      });
      return {
        ...prev,
        [dictionaryId]: (prev[dictionaryId] ?? []).map((item) =>
          item.id === itemId ? { ...item, status, updatedAt: todayStr() } : item
        ),
      };
    });
  };

  const archiveItem = (dictionaryId: string, itemId: string) =>
    setStatus(dictionaryId, itemId, 'Архив', CoreEventType.EntityArchived);
  const restoreItem = (dictionaryId: string, itemId: string) =>
    setStatus(dictionaryId, itemId, 'Активен', CoreEventType.EntityRestored);

  return (
    <DictionaryStoreContext.Provider
      value={{ itemsMap, getItems, getItem, createItem, updateItem, archiveItem, restoreItem }}
    >
      {children}
    </DictionaryStoreContext.Provider>
  );
};

export const useDictionaryStore = () => {
  const ctx = useContext(DictionaryStoreContext);
  if (!ctx) throw new Error('useDictionaryStore must be used within DictionaryStoreProvider');
  return ctx;
};
