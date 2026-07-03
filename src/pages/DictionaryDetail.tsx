import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { getDictionaryConfig } from '@/data/dictionaries';
import DictionaryCrud from '@/components/dictionary/DictionaryCrud';

const DictionaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const config = id ? getDictionaryConfig(id) : undefined;

  if (!config) {
    return (
      <div className="grid min-h-screen place-items-center grid-bg text-foreground">
        <div className="text-center">
          <Icon name="FileSearch" size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="mb-4 text-sm text-muted-foreground">Справочник не найден</p>
          <button
            onClick={() => navigate('/directories')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            К справочникам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <main className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            Noventra Core
          </button>
          <Icon name="ChevronRight" size={14} />
          <button onClick={() => navigate('/directories')} className="transition-colors hover:text-primary">
            Единые справочники
          </button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">{config.title}</span>
        </div>

        <DictionaryCrud config={config} />

        <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>Noventra Core · Единые справочники</span>
          <span>{config.title}</span>
        </footer>
      </main>
    </div>
  );
};

export default DictionaryDetail;
