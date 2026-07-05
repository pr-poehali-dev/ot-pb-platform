import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { DICTIONARIES, getDictionaryConfig } from '@/data/dictionaries';
import { useDictionaryStore } from '@/context/DictionaryStoreContext';

interface DictionaryHubProps {
  favorites: string[];
  recent: string[];
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const DictionaryHub = ({ favorites, recent, onSelect, onToggleFavorite }: DictionaryHubProps) => {
  const { getItems } = useDictionaryStore();
  const { t } = useTranslate();

  const frequent = DICTIONARIES.filter((d) => d.frequent);
  const favoriteConfigs = favorites.map((id) => getDictionaryConfig(id)).filter(Boolean) as typeof DICTIONARIES;
  const recentConfigs = recent.map((id) => getDictionaryConfig(id)).filter(Boolean) as typeof DICTIONARIES;

  const totalItems = DICTIONARIES.reduce((sum, d) => sum + getItems(d.id).length, 0);

  return (
    <div>
      {/* Hero header */}
      <header className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          <Icon name="Library" size={13} />
          {t('dict.app:dictDetailBadge')}
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {t('dict.app:dictHubTitle')} <span className="text-primary text-glow">{t('dict.app:dictHubTitleHighlight')}</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t('dict.app:dictHubSubtitle')}
        </p>
      </header>

      {/* Stats strip */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon="Library" label={t('dict.app:dictHubStatDictionaries')} value={String(DICTIONARIES.length)} />
        <StatCard icon="Database" label={t('dict.app:dictHubStatTotalRecords')} value={String(totalItems)} />
        <StatCard icon="Star" label={t('dict.app:dictHubStatFavorites')} value={String(favorites.length)} />
        <StatCard icon="History" label={t('dict.app:dictHubStatRecent')} value={String(recent.length)} />
      </div>

      {/* Frequently used */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="Flame" size={17} className="text-accent" />
          <h2 className="font-display text-lg font-semibold">{t('dict.app:dictHubFrequentlyUsed')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {frequent.map((d, i) => (
            <DictionaryCard
              key={d.id}
              id={d.id}
              title={d.title}
              description={d.description}
              icon={d.icon}
              count={getItems(d.id).length}
              isFavorite={favorites.includes(d.id)}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
              delay={i * 40}
            />
          ))}
        </div>
      </section>

      {/* Favorites */}
      {favoriteConfigs.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="Star" size={17} className="text-amber-400" />
            <h2 className="font-display text-lg font-semibold">{t('dict.app:dictHubFavoriteDictionaries')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteConfigs.map((d, i) => (
              <DictionaryCard
                key={d.id}
                id={d.id}
                title={d.title}
                description={d.description}
                icon={d.icon}
                count={getItems(d.id).length}
                isFavorite
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
                delay={i * 40}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently opened */}
      {recentConfigs.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Icon name="History" size={17} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">{t('dict.app:dictHubRecentlyOpened')}</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {recentConfigs.map((d) => (
              <button
                key={d.id}
                onClick={() => onSelect(d.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon name={d.icon} size={15} />
                {d.title}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="rounded-2xl border border-border glass p-4">
    <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
      <Icon name={icon} size={16} className="text-primary" />
    </div>
    <div className="font-display text-2xl font-bold tracking-tight">{value}</div>
    <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
  </div>
);

const DictionaryCard = ({
  id,
  title,
  description,
  icon,
  count,
  isFavorite,
  onSelect,
  onToggleFavorite,
  delay,
}: {
  id: string;
  title: string;
  description: string;
  icon: string;
  count: number;
  isFavorite: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  delay: number;
}) => {
  const { t } = useTranslate();
  return (
    <div
      className="group animate-float-in relative flex flex-col overflow-hidden rounded-2xl border border-border glass p-5 transition-all hover:border-primary/40"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />

      <div className="mb-4 flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-secondary/60 transition-colors group-hover:border-primary/40">
          <Icon name={icon} size={22} className="text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
            {count} {count === 1 ? t('dict.app:dictHubRecordSingular') : t('dict.app:dictHubRecordPlural')}
          </span>
          <button
            onClick={() => onToggleFavorite(id)}
            className={isFavorite ? 'text-amber-400' : 'text-muted-foreground hover:text-amber-400'}
            title={isFavorite ? t('dict.app:dictHubRemoveFavorite') : t('dict.app:dictHubAddFavorite')}
          >
            <Icon name="Star" size={16} className={isFavorite ? 'fill-amber-400' : ''} />
          </button>
        </div>
      </div>

      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{description}</p>

      <button
        onClick={() => onSelect(id)}
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <Icon name="ArrowRight" size={15} />
        {t('dict.app:dictHubOpenDictionary')}
      </button>
    </div>
  );
};

export default DictionaryHub;
