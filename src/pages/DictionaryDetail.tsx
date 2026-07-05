import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { getDictionaryConfig } from '@/data/dictionaries';
import DictionaryCrud from '@/components/dictionary/DictionaryCrud';
import DictionaryTree from '@/components/dictionary/DictionaryTree';
import DictionaryHub from '@/components/dictionary/DictionaryHub';
import { useDictionaryPreferences } from '@/hooks/useDictionaryPreferences';

/**
 * Главная страница модуля «Единые справочники» Noventra Core.
 * Слева — дерево всех справочников, сгруппированное по категориям, с поиском и избранным.
 * Справа — либо панель (часто используемые / избранные / последние), либо
 * универсальный CRUD-интерфейс выбранного справочника. Источник данных меняется,
 * интерфейс — общий для всех разделов.
 */
const DictionaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { favorites, recent, toggleFavorite, pushRecent } = useDictionaryPreferences();

  const config = id ? getDictionaryConfig(id) : undefined;

  useEffect(() => {
    if (id) pushRecent(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSelect = (dictId: string) => navigate(`/directories/${dictId}`);

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <div className="relative flex">
        {/* Left: dictionary tree grouped by category */}
        <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col border-r border-border glass lg:flex">
          <div className="flex items-center gap-3 border-b border-border px-5 py-5">
            <button
              onClick={() => navigate('/')}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 glow transition-transform hover:scale-105"
              title={`${t('common:brand.name')} ${t('common:brand.suffix')}`}
            >
              <Icon name="Hexagon" size={20} className="text-primary" />
            </button>
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-bold tracking-tight">{t('dict.menu:directories')}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">{t('dict.app:dictDetailBadge')}</div>
            </div>
          </div>

          <DictionaryTree
            activeId={id}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelect={handleSelect}
          />

          <div className="border-t border-border p-4">
            <button
              onClick={() => navigate('/')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={16} />
              {t('common:brand.name')} {t('common:brand.suffix')}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10">
          {/* Mobile back */}
          <div className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground lg:hidden">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon name="ArrowLeft" size={14} />
              {t('common:brand.name')} {t('common:brand.suffix')}
            </button>
            {config && (
              <>
                <Icon name="ChevronRight" size={13} />
                <button onClick={() => navigate('/directories')} className="transition-colors hover:text-primary">
                  {t('dict.menu:directories')}
                </button>
              </>
            )}
          </div>

          {/* Mobile tree (collapsed as horizontal scroller) */}
          {!config && (
            <div className="mb-6 lg:hidden">
              <DictionaryTree
                activeId={id}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelect={handleSelect}
              />
            </div>
          )}

          {config ? (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <span className="hidden lg:inline">{t('dict.menu:directories')}</span>
                <Icon name="ChevronRight" size={13} className="hidden lg:inline" />
                <span className="text-foreground">{config.title}</span>
              </div>
              <DictionaryCrud config={config} />
              <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
                <span>{t('common:brand.name')} {t('common:brand.suffix')} · {t('dict.menu:directories')}</span>
                <span>{config.title}</span>
              </footer>
            </>
          ) : (
            <DictionaryHub
              favorites={favorites}
              recent={recent}
              onSelect={handleSelect}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default DictionaryDetail;
