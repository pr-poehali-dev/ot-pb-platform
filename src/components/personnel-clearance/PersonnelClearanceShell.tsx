import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { PERSONNEL_CLEARANCE_TABS } from '@/data/personnelClearanceTabs';

interface PersonnelClearanceShellProps {
  activeTab: string;
  children: ReactNode;
}

/**
 * Общий каркас (layout) модуля «Предварительный допуск персонала»:
 * хлебные крошки, заголовок модуля и навигация по вкладкам.
 * Используется всеми страницами вкладок модуля — без бизнес-логики,
 * только структура и переходы между вкладками.
 */
const PersonnelClearanceShell = ({ activeTab, children }: PersonnelClearanceShellProps) => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <main className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            {t('common:brand.name')} {t('common:brand.suffix')}
          </button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">{t('dict.menu:personnelClearance')}</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            <Icon name="ShieldCheck" size={13} />
            {t('dict.personnelClearance:moduleBadge')}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('dict.personnelClearance:moduleTitle')}{' '}
            <span className="text-primary text-glow">{t('dict.personnelClearance:moduleTitleHighlight')}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t('dict.personnelClearance:moduleSubtitle')}
          </p>
        </header>

        {/* Tabs navigation */}
        <div className="mb-8 overflow-x-auto rounded-2xl border border-border glass p-2">
          <div className="flex min-w-max items-center gap-1">
            {PERSONNEL_CLEARANCE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/personnel-clearance/${tab.path}`)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon name={tab.icon} size={16} className={activeTab === tab.id ? 'text-primary' : ''} />
                <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {children}
      </main>
    </div>
  );
};

export default PersonnelClearanceShell;
