import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { useEntityStore } from '@/context/EntityStoreContext';
import { LEVELS_META, LevelId, Node, statusTone } from '@/data/entities';
import { ENTITY_STATUS_KEY } from '@/i18n/statusKeys';
import { levelLabelKey } from '@/i18n/levelKeys';
import EntityActionsMenu from '@/components/entity/EntityActionsMenu';
import EntityFormDialog from '@/components/entity/EntityFormDialog';
import EntityStatusDialog from '@/components/entity/EntityStatusDialog';
import EntityHistoryDialog from '@/components/entity/EntityHistoryDialog';

const DISPLAY_LEVELS = LEVELS_META.filter((l) => l.id !== 'root');

const Hierarchy = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { nodes, getPath } = useEntityStore();
  const [activeLevel, setActiveLevel] = useState<LevelId>(DISPLAY_LEVELS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formLevel, setFormLevel] = useState<LevelId>('organization');
  const [formParentId, setFormParentId] = useState<string>('root');
  const [formEntity, setFormEntity] = useState<Node | undefined>();

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'archive' | 'restore'>('archive');
  const [statusEntity, setStatusEntity] = useState<Node | undefined>();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEntity, setHistoryEntity] = useState<Node | undefined>();

  const scrollTo = (id: LevelId) => {
    setActiveLevel(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openCreate = (level: LevelId) => {
    const levelIdx = DISPLAY_LEVELS.findIndex((l) => l.id === level);
    const parentLevel: LevelId = levelIdx <= 0 ? 'root' : DISPLAY_LEVELS[levelIdx - 1].id;
    const parentPool = nodes.filter((n) => n.level === parentLevel);
    const parentId = parentLevel === 'root' ? 'root' : parentPool[0]?.id ?? 'root';
    setFormMode('create');
    setFormLevel(level);
    setFormParentId(parentId);
    setFormEntity(undefined);
    setFormOpen(true);
  };

  const openEdit = (entity: Node) => {
    setFormMode('edit');
    setFormLevel(entity.level);
    setFormEntity(entity);
    setFormOpen(true);
  };

  const openArchive = (entity: Node) => {
    setStatusEntity(entity);
    setStatusAction('archive');
    setStatusOpen(true);
  };

  const openRestore = (entity: Node) => {
    setStatusEntity(entity);
    setStatusAction('restore');
    setStatusOpen(true);
  };

  const openHistory = (entity: Node) => {
    setHistoryEntity(entity);
    setHistoryOpen(true);
  };

  const formMeta = LEVELS_META.find((l) => l.id === formLevel)!;

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
          <span className="text-foreground">{t('dict.menu:hierarchy')}</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            <Icon name="Workflow" size={13} />
            {t('dict.app:hierarchyBadge')}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('dict.app:hierarchyTitle')} <span className="text-primary text-glow">{t('dict.app:hierarchyTitleHighlight')}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t('dict.app:hierarchySubtitle')}
          </p>
        </header>

        {/* Level stepper */}
        <div className="mb-10 overflow-x-auto rounded-2xl border border-border glass p-4">
          <div className="flex min-w-max items-center gap-1">
            {DISPLAY_LEVELS.map((lvl, i) => (
              <div key={lvl.id} className="flex items-center gap-1">
                <button
                  onClick={() => scrollTo(lvl.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
                    activeLevel === lvl.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name={lvl.icon} size={16} className={activeLevel === lvl.id ? 'text-primary' : ''} />
                  <span className="whitespace-nowrap">{t(levelLabelKey(lvl.id))}</span>
                </button>
                {i < DISPLAY_LEVELS.length - 1 && <Icon name="ChevronRight" size={16} className="shrink-0 text-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-14">
          {DISPLAY_LEVELS.map((lvl, levelIdx) => {
            const items = nodes.filter((n) => n.level === lvl.id);
            return (
              <section key={lvl.id} ref={(el) => (sectionRefs.current[lvl.id] = el)} className="scroll-mt-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 glow">
                      <Icon name={lvl.icon} size={22} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                        {t('dict.app:hierarchyLevelOfTotal', { params: { level: levelIdx + 1, total: DISPLAY_LEVELS.length } })}
                      </div>
                      <h2 className="font-display text-xl font-semibold">{t(levelLabelKey(lvl.id))}</h2>
                    </div>
                  </div>
                  <button
                    onClick={() => openCreate(lvl.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    <Icon name="Plus" size={16} />
                    {t('dict.buttons:create')}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((item, i) => {
                    const path = getPath(item.id);
                    const parent = path[path.length - 2];
                    return (
                      <div
                        key={item.id}
                        className="group animate-float-in relative overflow-hidden rounded-2xl border border-border glass p-5 transition-all hover:border-primary/40"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />

                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-display text-base font-semibold">{item.name}</h3>
                            <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {item.status && (
                              <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${statusTone[item.status]}`}>
                                {t(`dict.statuses:${ENTITY_STATUS_KEY[item.status]}`)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-border pt-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon name="CornerLeftUp" size={14} className="shrink-0" />
                            <span className="truncate">
                              {parent ? parent.name : <span className="italic text-border">{t('dict.app:rootEntity')}</span>}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon name="UserCircle2" size={14} className="shrink-0" />
                            <span className="truncate">{item.owner}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Icon name="CalendarDays" size={14} className="shrink-0" />
                            <span>{item.createdAt}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                          <button
                            onClick={() => navigate(`/entity/${item.id}`)}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                          >
                            <Icon name="ExternalLink" size={15} />
                            {t('common:buttons.open')}
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                            title={t('dict.buttons:edit')}
                          >
                            <Icon name="Pencil" size={16} />
                          </button>
                          <EntityActionsMenu
                            entity={item}
                            onEdit={openEdit}
                            onArchive={openArchive}
                            onRestore={openRestore}
                            onHistory={openHistory}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => openCreate(lvl.id)}
                    className="grid min-h-[200px] place-items-center rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon name="Plus" size={22} />
                      <span className="text-sm">{t('dict.app:hierarchyAddChild', { params: { level: t(levelLabelKey(lvl.id)).toLowerCase() } })}</span>
                    </div>
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        <footer className="mt-14 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>{t('common:brand.name')} {t('common:brand.suffix')} · {t('dict.menu:hierarchy')}</span>
          <span>{t('dict.app:hierarchyFooterLevelsCount', { params: { count: 8 } })}</span>
        </footer>
      </main>

      <EntityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        meta={formMeta}
        parentId={formParentId}
        entity={formEntity}
      />
      <EntityStatusDialog open={statusOpen} onOpenChange={setStatusOpen} action={statusAction} entity={statusEntity} />
      <EntityHistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} entity={historyEntity} />
    </div>
  );
};

export default Hierarchy;
