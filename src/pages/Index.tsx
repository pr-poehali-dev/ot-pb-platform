import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import LanguageMenuButton from '@/components/language/LanguageMenuButton';
import ProfileSettingsDialog from '@/components/language/ProfileSettingsDialog';

const NAV = [
  { id: 'overview', labelKey: 'menu:overview', icon: 'LayoutGrid' },
  { id: 'directories', labelKey: 'menu:directories', icon: 'Library', to: '/directories' },
  { id: 'hierarchy', labelKey: 'menu:hierarchy', icon: 'Workflow', to: '/hierarchy' },
  { id: 'entity-links', labelKey: 'menu:entity-links', icon: 'GitBranch', to: '/entity-links' },
  { id: 'auth', labelKey: 'menu:auth', icon: 'KeyRound' },
  { id: 'users', labelKey: 'menu:users', icon: 'Users' },
  { id: 'roles', labelKey: 'menu:roles', icon: 'ShieldCheck' },
  { id: 'access', labelKey: 'menu:access', icon: 'Lock' },
  { id: 'orgs', labelKey: 'menu:orgs', icon: 'Building2' },
  { id: 'objects', labelKey: 'menu:objects', icon: 'Boxes' },
  { id: 'sites', labelKey: 'menu:sites', icon: 'HardHat' },
  { id: 'zones', labelKey: 'menu:zones', icon: 'MapPinned' },
  { id: 'settings', labelKey: 'menu:settings', icon: 'Settings2' },
  { id: 'notifications', labelKey: 'menu:notifications', icon: 'Bell' },
  { id: 'audit', labelKey: 'menu:audit', icon: 'ScrollText' },
  { id: 'api', labelKey: 'menu:api', icon: 'Cable' },
];

const MODULES = [
  { icon: 'KeyRound', key: 'auth', tone: 'ok' },
  { icon: 'Users', key: 'users', tone: 'num' },
  { icon: 'ShieldCheck', key: 'roles', tone: 'num' },
  { icon: 'Lock', key: 'access', tone: 'num' },
  { icon: 'Building2', key: 'orgs', tone: 'num' },
  { icon: 'Boxes', key: 'objects', tone: 'num' },
  { icon: 'HardHat', key: 'sites', tone: 'num' },
  { icon: 'MapPinned', key: 'zones', tone: 'num' },
  { icon: 'Settings2', key: 'settings', tone: 'ok' },
  { icon: 'Bell', key: 'notifications', tone: 'warn' },
  { icon: 'ScrollText', key: 'audit', tone: 'ok' },
  { icon: 'Cable', key: 'api', tone: 'num' },
];

const toneClass: Record<string, string> = {
  ok: 'text-primary border-primary/30 bg-primary/10',
  warn: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  num: 'text-accent border-accent/30 bg-accent/10',
};

const Index = () => {
  const [active, setActive] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslate();

  const moduleStat = (key: string, fallback: string) =>
    t(`modules:${key}.stat`, { fallback });

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <div className="relative flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-border glass lg:flex">
          <div className="flex items-center gap-3 border-b border-border px-6 py-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 glow">
              <Icon name="Hexagon" className="text-primary" size={24} />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-tight">{t('common:brand.name')}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{t('common:brand.suffix')}</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => (item.to ? navigate(item.to) : setActive(item.id))}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  active === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={18} className={active === item.id ? 'text-primary' : ''} />
                <span className="truncate">{t(item.labelKey)}</span>
                {active === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />}
              </button>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <button
              onClick={() => setProfileOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg bg-secondary/60 p-3 text-left transition-colors hover:bg-secondary"
            >
              <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 font-mono text-sm text-accent">АС</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{t('common:profile.role')}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">root@noventra</div>
              </div>
              <Icon name="Settings2" size={15} className="shrink-0 text-muted-foreground" />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-12">
          {/* Topbar */}
          <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                {t('common:status.systemOnline')}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {t('common:brand.name')} <span className="text-primary text-glow">{t('common:brand.suffix')}</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t('common:brand.tagline')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="grid h-11 w-11 place-items-center rounded-xl border border-border glass transition-colors hover:border-primary/40">
                <Icon name="Search" size={18} className="text-muted-foreground" />
              </button>
              <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-border glass transition-colors hover:border-primary/40">
                <Icon name="Bell" size={18} className="text-muted-foreground" />
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] text-accent-foreground">7</span>
              </button>
              <LanguageMenuButton />
              <button
                onClick={() => setProfileOpen(true)}
                className="grid h-11 w-11 place-items-center rounded-full bg-accent/20 font-mono text-sm text-accent transition-colors hover:bg-accent/30"
                title={t('common:profile.role')}
              >
                АС
              </button>
            </div>
          </header>

          {/* Stats */}
          <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: t('dict.app:indexStatActiveModules'), value: '13', icon: 'Component', hint: t('dict.app:indexHintCore') },
              { label: t('dict.app:indexStatUsers'), value: '1 248', icon: 'Users', hint: t('dict.app:indexHintUsers') },
              { label: t('dict.app:indexStatObjects'), value: '370', icon: 'Boxes', hint: t('dict.app:indexHintObjects') },
              { label: t('dict.app:indexStatEvents'), value: '24.6k', icon: 'Activity', hint: t('dict.app:indexHintEvents') },
            ].map((s, i) => (
              <div
                key={s.label}
                className="animate-float-in rounded-2xl border border-border glass p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10">
                    <Icon name={s.icon} size={18} className="text-primary" />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                <div className="mt-2 font-mono text-[11px] text-primary/70">{s.hint}</div>
              </div>
            ))}
          </section>

          {/* Modules */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">{t('common:header.coreModules')}</h2>
              <span className="font-mono text-xs text-muted-foreground">
                {t('common:header.subsystemsCount', { params: { count: 14 } })}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {MODULES.map((m, i) => (
                <button
                  key={m.key}
                  className="group animate-float-in relative overflow-hidden rounded-2xl border border-border glass p-5 text-left transition-all hover:border-primary/40 hover:glow"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />
                  <div className="mb-4 flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-secondary/60 transition-colors group-hover:border-primary/40">
                      <Icon name={m.icon} size={22} className="text-primary" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${toneClass[m.tone]}`}>
                      {moduleStat(m.key, '')}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold">{t(`modules:${m.key}.title`)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`modules:${m.key}.desc`)}</p>
                  <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {t('common:buttons.open')} <Icon name="ArrowRight" size={14} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Module bus */}
          <section className="mt-10 overflow-hidden rounded-2xl border border-border glass p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15">
                <Icon name="Cable" size={22} className="text-accent" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <h3 className="font-display font-semibold">{t('modules:bus.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('modules:bus.desc')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  t('dict.app:indexBusTagInduction'),
                  t('dict.menu:ppe'),
                  t('dict.menu:inspections'),
                  t('dict.app:indexBusTagIncidents'),
                  t('dict.app:indexBusTagTraining'),
                  t('dict.app:indexBusTagMore'),
                ].map((label) => (
                  <span key={label} className="rounded-lg border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">{label}</span>
                ))}
              </div>
            </div>
          </section>

          <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
            <span>{t('common:brand.name')} {t('common:brand.suffix')} · v1.0</span>
            <span>{t('common:footer.copyright')}</span>
          </footer>
        </main>
      </div>

      <ProfileSettingsDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};

export default Index;