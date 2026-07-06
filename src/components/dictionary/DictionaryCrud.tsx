import { useState } from 'react';
import { DictionaryConfig, DictionaryItem } from '@/data/dictionaries';
import { useDictionaryStore } from '@/context/DictionaryStoreContext';
import { useTranslate } from '@/core';
import { dictMetaTitleKey, dictMetaDescKey } from '@/i18n/dictionaryMetaKeys';
import DictionaryTable from './DictionaryTable';
import DictionaryFormDialog from './DictionaryFormDialog';
import DictionaryViewDialog from './DictionaryViewDialog';
import DictionaryStatusDialog from './DictionaryStatusDialog';
import Icon from '@/components/ui/icon';

interface DictionaryCrudProps {
  config: DictionaryConfig;
}

/**
 * Единый универсальный CRUD-компонент для всех справочников Noventra Core.
 * Инкапсулирует таблицу (поиск, фильтр, сортировка) и полный набор действий:
 * просмотр, создание, редактирование, архивирование, восстановление.
 */
const DictionaryCrud = ({ config }: DictionaryCrudProps) => {
  const { getItems } = useDictionaryStore();
  const { t } = useTranslate();
  const items = getItems(config.id);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [activeItem, setActiveItem] = useState<DictionaryItem | undefined>();

  const [viewOpen, setViewOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'archive' | 'restore'>('archive');

  const openCreate = () => {
    setFormMode('create');
    setActiveItem(undefined);
    setFormOpen(true);
  };

  const openEdit = (item: DictionaryItem) => {
    setFormMode('edit');
    setActiveItem(item);
    setFormOpen(true);
  };

  const openView = (item: DictionaryItem) => {
    setActiveItem(item);
    setViewOpen(true);
  };

  const openArchive = (item: DictionaryItem) => {
    setActiveItem(item);
    setStatusAction('archive');
    setStatusOpen(true);
  };

  const openRestore = (item: DictionaryItem) => {
    setActiveItem(item);
    setStatusAction('restore');
    setStatusOpen(true);
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 glow">
            <Icon name={config.icon} size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">{t(dictMetaTitleKey(config.id), { fallback: config.title })}</h2>
            <p className="text-sm text-muted-foreground">{t(dictMetaDescKey(config.id), { fallback: config.description })}</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow"
        >
          <Icon name="Plus" size={16} />
          {t('dict.app:dictCrudCreateRecord')}
        </button>
      </div>

      <DictionaryTable
        config={config}
        items={items}
        onView={openView}
        onEdit={openEdit}
        onArchive={openArchive}
        onRestore={openRestore}
      />

      <DictionaryFormDialog open={formOpen} onOpenChange={setFormOpen} mode={formMode} config={config} item={activeItem} />
      <DictionaryViewDialog open={viewOpen} onOpenChange={setViewOpen} config={config} item={activeItem} />
      <DictionaryStatusDialog open={statusOpen} onOpenChange={setStatusOpen} action={statusAction} config={config} item={activeItem} />
    </div>
  );
};

export default DictionaryCrud;