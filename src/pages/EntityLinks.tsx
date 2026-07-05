import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { statusTone, LevelId, Node } from '@/data/entities';
import { useEntityStore } from '@/context/EntityStoreContext';
import { ENTITY_STATUS_KEY } from '@/i18n/statusKeys';
import { levelLabelKey, levelChildLabelKey } from '@/i18n/levelKeys';
import EntityActionsMenu from '@/components/entity/EntityActionsMenu';
import EntityFormDialog from '@/components/entity/EntityFormDialog';
import EntityStatusDialog from '@/components/entity/EntityStatusDialog';
import EntityHistoryDialog from '@/components/entity/EntityHistoryDialog';

const EntityLinks = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { getNode, getChildren, getMeta, getPath } = useEntityStore();
  const [selectedId, setSelectedId] = useState('root');

  const node = getNode(selectedId)!;
  const meta = getMeta(node.level);
  const parent = node.parentId ? getNode(node.parentId) : null;
  const parentMeta = parent ? getMeta(parent.level) : null;
  const children = getChildren(node.id);
  const path = getPath(node.id);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formLevel, setFormLevel] = useState<LevelId>('organization');
  const [formEntity, setFormEntity] = useState<Node | undefined>();

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'archive' | 'restore'>('archive');
  const [statusEntity, setStatusEntity] = useState<Node | undefined>();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyEntity, setHistoryEntity] = useState<Node | undefined>();

  const childLevelId: LevelId | null = children[0]?.level ?? null;

  const CHILD_LEVEL_MAP: Record<LevelId, LevelId | null> = {
    root: 'organization',
    organization: 'company',
    company: 'project',
    project: 'object',
    object: 'site',
    site: 'contractor',
    contractor: 'subdivision',
    subdivision: 'user',
    user: null,
  };

  const openCreateChild = () => {
    const level = childLevelId ?? CHILD_LEVEL_MAP[node.level];
    if (!level) return;
    setFormMode('create');
    setFormLevel(level);
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

  const formMeta = getMeta(formLevel);
  const childLabelKey = levelChildLabelKey(node.level);

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <main className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Back to core */}
        <div className="mb-6 flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            {t('common:brand.name')} {t('common:brand.suffix')}
          </button>
        </div>

        {/* Header */}
        <header className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            <Icon name="GitBranch" size={13} />
            {t('dict.app:entityLinksBadge')}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('dict.app:entityLinksTitle')} <span className="text-primary text-glow">{t('dict.app:entityLinksTitleHighlight')}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t('dict.app:entityLinksSubtitle')}
          </p>
        </header>

        {/* Breadcrumbs */}
        <div className="mb-8 flex flex-wrap items-center gap-1.5 rounded-xl border border-border glass px-4 py-3 font-mono text-xs">
          {path.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedId(n.id)}
                className={`rounded-md px-2 py-1 transition-colors ${
                  n.id === selectedId ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {n.name}
              </button>
              {i < path.length - 1 && <Icon name="ChevronRight" size={13} className="text-border" />}
            </div>
          ))}
        </div>

        {/* Current entity card */}
        <section className="mb-8 rounded-2xl border border-border glass p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 glow">
                <Icon name={meta.icon} size={26} className="text-primary" />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{t(levelLabelKey(node.level))}</div>
                <h2 className="font-display text-xl font-semibold">{node.name}</h2>
                <div className="mt-1 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span>{node.code}</span>
                  {node.owner && (
                    <span className="flex items-center gap-1">
                      <Icon name="UserCircle2" size={13} /> {node.owner}
                    </span>
                  )}
                  {node.createdAt && (
                    <span className="flex items-center gap-1">
                      <Icon name="CalendarDays" size={13} /> {node.createdAt}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {node.status && (
                <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${statusTone[node.status]}`}>
                  {t(`dict.statuses:${ENTITY_STATUS_KEY[node.status]}`)}
                </span>
              )}
              {node.level !== 'root' && (
                <>
                  <button
                    onClick={() => navigate(`/entity/${node.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    <Icon name="IdCard" size={14} />
                    {t('dict.app:entityLinksOpenCard')}
                  </button>
                  <EntityActionsMenu
                    entity={node}
                    onEdit={openEdit}
                    onArchive={openArchive}
                    onRestore={openRestore}
                    onHistory={openHistory}
                  />
                </>
              )}
            </div>
          </div>

          {/* Parent link */}
          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{t('dict.dictionaries:parentEntity')}</div>
            {parent ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon name={parentMeta!.icon} size={18} className="text-primary" />
                  <div>
                    <div className="text-sm font-medium">{parent.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{t(levelLabelKey(parent.level))}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(parent.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon name="ExternalLink" size={14} />
                  {t('common:buttons.open')}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-3 text-sm italic text-muted-foreground">
                {t('dict.app:rootEntityNoParent')}
              </div>
            )}
          </div>
        </section>

        {/* Children section */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-xl font-semibold">
                {childLabelKey ? t(childLabelKey) : t('dict.app:childEntitiesDefault')}
              </h3>
              <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                {children.length}
              </span>
            </div>
            {meta.childLabel && (
              <button
                onClick={openCreateChild}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow"
              >
                <Icon name="Plus" size={16} />
                {t('dict.app:entityLinksAddChild')}
              </button>
            )}
          </div>

          {children.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child, i) => {
                const childMeta = getMeta(child.level);
                const childChildrenCount = getChildren(child.id).length;
                const childChildLabelKey = levelChildLabelKey(child.level);
                return (
                  <div
                    key={child.id}
                    className="group animate-float-in relative overflow-hidden rounded-2xl border border-border glass p-5 transition-all hover:border-primary/40"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-secondary/60">
                          <Icon name={childMeta.icon} size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate font-display text-sm font-semibold">{child.name}</h4>
                          <span className="font-mono text-[11px] text-muted-foreground">{child.code}</span>
                        </div>
                      </div>
                      {child.status && (
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] ${statusTone[child.status]}`}>
                          {t(`dict.statuses:${ENTITY_STATUS_KEY[child.status]}`)}
                        </span>
                      )}
                    </div>

                    {childChildLabelKey && (
                      <div className="mb-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                        <Icon name="CornerDownRight" size={13} />
                        {childChildrenCount} {t(childChildLabelKey).toLowerCase()}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedId(child.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <Icon name="ExternalLink" size={15} />
                        {t('common:buttons.open')}
                      </button>
                      <button
                        onClick={() => navigate(`/entity/${child.id}`)}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                        title={t('dict.app:entityLinksOpenCard')}
                      >
                        <Icon name="IdCard" size={16} />
                      </button>
                      <EntityActionsMenu
                        entity={child}
                        onEdit={openEdit}
                        onArchive={openArchive}
                        onRestore={openRestore}
                        onHistory={openHistory}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-border py-14 text-center">
              <Icon name="FolderOpen" size={30} className="mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {meta.childLabel ? t('dict.app:childEntitiesNotAdded') : t('dict.app:noChildEntitiesForUser')}
              </p>
            </div>
          )}
        </section>

        <footer className="mt-14 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>{t('common:brand.name')} {t('common:brand.suffix')} · {t('dict.menu:entityLinks')}</span>
          <span>{t('dict.app:entityLinksFooterLevel', { params: { level: t(levelLabelKey(node.level)) } })}</span>
        </footer>
      </main>

      <EntityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        meta={formMeta}
        parentId={node.id}
        entity={formEntity}
      />
      <EntityStatusDialog open={statusOpen} onOpenChange={setStatusOpen} action={statusAction} entity={statusEntity} />
      <EntityHistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} entity={historyEntity} />
    </div>
  );
};

export default EntityLinks;
