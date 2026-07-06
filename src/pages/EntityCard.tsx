import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { statusTone } from '@/data/entities';
import { useEntityStore } from '@/context/EntityStoreContext';
import { ENTITY_STATUS_KEY } from '@/i18n/statusKeys';
import { levelLabelKey, levelChildLabelKey } from '@/i18n/levelKeys';
import { translateHistoryAction } from '@/i18n/historyActionKeys';
import EntityFormDialog from '@/components/entity/EntityFormDialog';
import EntityStatusDialog from '@/components/entity/EntityStatusDialog';

const EntityCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { getNode, getChildren, getMeta, getPath } = useEntityStore();

  const node = id ? getNode(id) : undefined;

  const [formOpen, setFormOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'archive' | 'restore'>('archive');

  if (!node) {
    return (
      <div className="grid min-h-screen place-items-center grid-bg text-foreground">
        <div className="text-center">
          <Icon name="FileSearch" size={32} className="mx-auto mb-3 text-muted-foreground" />
          <p className="mb-4 text-sm text-muted-foreground">{t('dict.app:entityCardNotFound')}</p>
          <button
            onClick={() => navigate('/entity-links')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            {t('dict.app:entityCardBackToLinks')}
          </button>
        </div>
      </div>
    );
  }

  const meta = getMeta(node.level);
  const parent = node.parentId ? getNode(node.parentId) : null;
  const parentMeta = parent ? getMeta(parent.level) : null;
  const children = getChildren(node.id);
  const path = getPath(node.id);
  const isArchived = node.status === 'Архив';
  const history = [...(node.history ?? [])].reverse();
  const childLabelKey = levelChildLabelKey(node.level);

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <main className="relative mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Back */}
        <div className="mb-6 flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/entity-links')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            {t('dict.menu:entityLinks')}
          </button>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 font-mono text-xs text-muted-foreground">
          {path.map((n, i) => (
            <div key={n.id} className="flex items-center gap-1.5">
              <span className={n.id === node.id ? 'text-primary' : ''}>{n.name}</span>
              {i < path.length - 1 && <Icon name="ChevronRight" size={13} className="text-border" />}
            </div>
          ))}
        </div>

        {/* Entity header */}
        <header className="mb-8 rounded-2xl border border-border glass p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary/10 glow">
                <Icon name={meta.icon} size={30} className="text-primary" />
              </div>
              <div>
                <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
                  {t(levelLabelKey(node.level))}
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{node.name}</h1>
                <span className="font-mono text-xs text-muted-foreground">{node.code}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {node.status && (
                <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${statusTone[node.status]}`}>
                  {t(`dict.statuses:${ENTITY_STATUS_KEY[node.status]}`)}
                </span>
              )}
              <button
                onClick={() => setFormOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                title={t('dict.buttons:edit')}
              >
                <Icon name="Pencil" size={16} />
              </button>
              {isArchived ? (
                <button
                  onClick={() => {
                    setStatusAction('restore');
                    setStatusOpen(true);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  title={t('dict.buttons:restore')}
                >
                  <Icon name="RotateCcw" size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setStatusAction('archive');
                    setStatusOpen(true);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-amber-400/50 hover:text-amber-400"
                  title={t('dict.buttons:archive')}
                >
                  <Icon name="Archive" size={16} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="mb-6 h-auto flex-wrap gap-1 rounded-xl border border-border glass p-1.5">
            <TabsTrigger value="main" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Icon name="LayoutPanelLeft" size={15} />
              {t('dict.app:entityCardTabMain')}
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Icon name="GitBranch" size={15} />
              {t('dict.app:entityCardTabLinks')}
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Icon name="FileText" size={15} />
              {t('dict.app:entityCardTabDocs')}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Icon name="History" size={15} />
              {t('dict.app:entityCardTabHistory')}
            </TabsTrigger>
          </TabsList>

          {/* Основное */}
          <TabsContent value="main" className="space-y-4 mt-0">
            <div className="rounded-2xl border border-border glass p-6">
              <h3 className="mb-4 font-display text-base font-semibold">{t('dict.app:entityCardMainInfo')}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('dict.ui:name')} value={node.name} icon="Type" />
                <Field label={t('dict.ui:code')} value={node.code} icon="Hash" mono />
                <Field label={t('dict.ui:status')} icon="CircleDot">
                  {node.status && (
                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${statusTone[node.status]}`}>
                      {t(`dict.statuses:${ENTITY_STATUS_KEY[node.status]}`)}
                    </span>
                  )}
                </Field>
                <Field label={t('dict.ui:owner')} value={node.owner ?? '—'} icon="UserCircle2" />
                <Field label={t('dict.ui:createdAt')} value={node.createdAt ?? '—'} icon="CalendarPlus" />
                <Field label={t('dict.app:entityCardLastModified')} value={node.updatedAt ?? '—'} icon="History" />
              </div>
              {node.description && (
                <div className="mt-4 border-t border-border pt-4">
                  <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{t('dict.ui:description')}</div>
                  <p className="text-sm text-foreground/90">{node.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Связи */}
          <TabsContent value="links" className="space-y-4 mt-0">
            <div className="rounded-2xl border border-border glass p-6">
              <h3 className="mb-4 font-display text-base font-semibold">{t('dict.dictionaries:parentEntity')}</h3>
              {parent ? (
                <button
                  onClick={() => navigate(`/entity/${parent.id}`)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <Icon name={parentMeta!.icon} size={18} className="text-primary" />
                    <div>
                      <div className="text-sm font-medium">{parent.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{t(levelLabelKey(parent.level))}</div>
                    </div>
                  </div>
                  <Icon name="ExternalLink" size={15} className="text-muted-foreground" />
                </button>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-3 text-sm italic text-muted-foreground">
                  {t('dict.app:rootEntityNoParent')}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border glass p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">
                  {t('dict.app:entityCardChildEntities')} {childLabelKey && <span className="text-muted-foreground font-normal">· {t(childLabelKey)}</span>}
                </h3>
                <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                  {children.length}
                </span>
              </div>
              {children.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {children.map((child) => {
                    const childMeta = getMeta(child.level);
                    return (
                      <button
                        key={child.id}
                        onClick={() => navigate(`/entity/${child.id}`)}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left transition-colors hover:border-primary/40"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon name={childMeta.icon} size={16} className="shrink-0 text-primary" />
                          <span className="truncate text-sm">{child.name}</span>
                        </div>
                        <Icon name="ChevronRight" size={14} className="shrink-0 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  {t('dict.app:entityCardChildEntitiesNone')}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border glass p-6">
              <h3 className="mb-4 font-display text-base font-semibold">{t('dict.app:entityCardRelatedUsers')}</h3>
              {node.relatedUsers && node.relatedUsers.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {node.relatedUsers.map((u) => (
                    <span key={u} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/20 font-mono text-[10px] text-accent">
                        {u.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                      </span>
                      {u}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  {t('dict.app:entityCardRelatedUsersNone')}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Документы */}
          <TabsContent value="docs" className="mt-0">
            <div className="rounded-2xl border border-border glass p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">{t('dict.app:entityCardRelatedDocs')}</h3>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                  <Icon name="Upload" size={15} />
                  {t('dict.app:entityCardUploadDoc')}
                </button>
              </div>
              {node.documents && node.documents.length > 0 ? (
                <div className="space-y-2">
                  {node.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-secondary/60">
                          <Icon name="FileText" size={17} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{doc.name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {doc.type} · {doc.size} · {doc.uploadedAt}
                          </div>
                        </div>
                      </div>
                      <button className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                        <Icon name="Download" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  {t('dict.app:entityCardNoDocsYet')}
                </div>
              )}
            </div>
          </TabsContent>

          {/* История */}
          <TabsContent value="history" className="mt-0">
            <div className="rounded-2xl border border-border glass p-6">
              <h3 className="mb-4 font-display text-base font-semibold">{t('dict.app:entityCardChangeHistory')}</h3>
              {history.length > 0 ? (
                <div className="relative space-y-5 pl-6">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                  {history.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-6 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary/15 ring-4 ring-background">
                        <Icon name={event.icon} size={10} className="text-primary" />
                      </div>
                      <div className="text-sm font-medium">{translateHistoryAction(event.action, t)}</div>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                        <Icon name="UserCircle2" size={12} />
                        {event.author}
                        <span className="text-border">·</span>
                        <Icon name="Clock" size={12} />
                        {event.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                  {t('dict.app:entityCardHistoryEmpty')}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>{t('common:brand.name')} {t('common:brand.suffix')} · {t('dict.app:entityCardFooterLabel')}</span>
          <span>{t(levelLabelKey(node.level))}</span>
        </footer>
      </main>

      <EntityFormDialog open={formOpen} onOpenChange={setFormOpen} mode="edit" meta={meta} entity={node} />
      <EntityStatusDialog open={statusOpen} onOpenChange={setStatusOpen} action={statusAction} entity={node} />
    </div>
  );
};

const Field = ({
  label,
  value,
  icon,
  mono,
  children,
}: {
  label: string;
  value?: string;
  icon: string;
  mono?: boolean;
  children?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
    <Icon name={icon} size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <div className="mb-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{label}</div>
      {children ?? <div className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</div>}
    </div>
  </div>
);

export default EntityCard;