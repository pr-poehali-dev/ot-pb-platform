import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { DICTIONARIES, getDictionaryConfig } from '@/data/dictionaries';
import { useDictionaryStore } from '@/context/DictionaryStoreContext';
import DictionaryCrud from '@/components/dictionary/DictionaryCrud';

/**
 * Реестр всех справочников платформы Noventra Core.
 * Левое меню со всеми разделами + единый универсальный CRUD-интерфейс справа.
 * Меняется только источник данных (config) и заголовок — сам интерфейс общий для всех разделов.
 */
const DictionaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItems } = useDictionaryStore();

  const config = id ? getDictionaryConfig(id) : undefined;

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <div className="relative flex">
        {/* Left menu: registry of dictionaries */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border glass lg:flex">
          <div className="flex items-center gap-3 border-b border-border px-5 py-5">
            <button
              onClick={() => navigate('/')}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 glow transition-transform hover:scale-105"
              title="Noventra Core"
            >
              <Icon name="Hexagon" size={20} className="text-primary" />
            </button>
            <div className="min-w-0">
              <div className="truncate font-display text-sm font-bold tracking-tight">Единые справочники</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">Core Dictionaries</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {DICTIONARIES.map((d) => {
              const count = getItems(d.id).length;
              const isActive = d.id === id;
              return (
                <button
                  key={d.id}
                  onClick={() => navigate(`/directories/${d.id}`)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name={d.icon} size={17} className={isActive ? 'text-primary' : ''} />
                  <span className="min-w-0 flex-1 truncate text-left">{d.title}</span>
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[10px] ${
                      isActive ? 'border-primary/30 text-primary' : 'border-border text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-border p-4">
            <button
              onClick={() => navigate('/')}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Icon name="ArrowLeft" size={16} />
              Noventra Core
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-10">
          {/* Mobile back + breadcrumbs */}
          <div className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground lg:hidden">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon name="ArrowLeft" size={14} />
              Noventra Core
            </button>
          </div>

          {/* Mobile dictionary selector */}
          <div className="mb-6 overflow-x-auto lg:hidden">
            <div className="flex min-w-max gap-1.5 rounded-xl border border-border glass p-1.5">
              {DICTIONARIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/directories/${d.id}`)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    d.id === id ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon name={d.icon} size={14} />
                  {d.title}
                </button>
              ))}
            </div>
          </div>

          {config ? (
            <>
              <DictionaryCrud config={config} />
              <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
                <span>Noventra Core · Единые справочники</span>
                <span>{config.title}</span>
              </footer>
            </>
          ) : (
            <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-dashed border-border">
              <div className="text-center">
                <Icon name="Library" size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Выберите справочник</p>
                <p className="text-sm text-muted-foreground">Все разделы используют единый CRUD-интерфейс</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DictionaryDetail;
