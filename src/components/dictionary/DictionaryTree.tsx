import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { CATEGORIES, DICTIONARIES, DictionaryCategory } from '@/data/dictionaries';
import { useDictionaryStore } from '@/context/DictionaryStoreContext';
import { dictMetaTitleKey } from '@/i18n/dictionaryMetaKeys';

interface DictionaryTreeProps {
  activeId?: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelect: (id: string) => void;
}

const DictionaryTree = ({ activeId, favorites, onToggleFavorite, onSelect }: DictionaryTreeProps) => {
  const { getItems } = useDictionaryStore();
  const { t } = useTranslate();
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<DictionaryCategory, boolean>>({
    structure: false,
    personnel: false,
    production: false,
    hse: false,
    system: false,
  });

  const toggleCategory = (id: DictionaryCategory) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredIds = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return new Set(
      DICTIONARIES.filter((d) => t(dictMetaTitleKey(d.id), { fallback: d.title }).toLowerCase().includes(q)).map((d) => d.id)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, t]);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2">
          <Icon name="Search" size={14} className="shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('dict.app:dictTreeSearchPlaceholder')}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button onClick={() => setQuery('')} className="shrink-0 text-muted-foreground hover:text-foreground">
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tree */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {CATEGORIES.map((cat) => {
          const items = DICTIONARIES.filter((d) => d.category === cat.id).filter(
            (d) => !filteredIds || filteredIds.has(d.id)
          );
          if (items.length === 0) return null;
          const isCollapsed = collapsed[cat.id] && !filteredIds;

          return (
            <div key={cat.id} className="mb-1">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-secondary"
              >
                <Icon
                  name="ChevronRight"
                  size={13}
                  className={`shrink-0 text-muted-foreground transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                />
                <Icon name={cat.icon} size={14} className="shrink-0 text-accent" />
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t(`dict.dictCategories:${cat.id}`)}
                </span>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">{items.length}</span>
              </button>

              {!isCollapsed && (
                <div className="ml-2 space-y-0.5 border-l border-border pl-2">
                  {items.map((d) => {
                    const count = getItems(d.id).length;
                    const isActive = d.id === activeId;
                    const isFav = favorites.includes(d.id);
                    return (
                      <div
                        key={d.id}
                        className={`group flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm transition-all ${
                          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        }`}
                      >
                        <button onClick={() => onSelect(d.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                          <Icon name={d.icon} size={15} className={`shrink-0 ${isActive ? 'text-primary' : ''}`} />
                          <span className="min-w-0 flex-1 truncate">{t(dictMetaTitleKey(d.id), { fallback: d.title })}</span>
                          <span
                            className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[10px] ${
                              isActive ? 'border-primary/30 text-primary' : 'border-border text-muted-foreground'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                        <button
                          onClick={() => onToggleFavorite(d.id)}
                          className={`shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${isFav ? '!opacity-100 text-amber-400' : 'text-muted-foreground'}`}
                          title={isFav ? t('dict.app:dictHubRemoveFavorite') : t('dict.app:dictHubAddFavorite')}
                        >
                          <Icon name="Star" size={13} className={isFav ? 'fill-amber-400' : ''} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default DictionaryTree;