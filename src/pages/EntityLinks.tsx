import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

type LevelId = 'root' | 'company' | 'project' | 'object' | 'site' | 'contractor' | 'subdivision' | 'user';

interface Node {
  id: string;
  level: LevelId;
  name: string;
  code: string;
  status?: 'Активен' | 'В работе' | 'Черновик' | 'Архив';
  parentId: string | null;
  owner?: string;
  createdAt?: string;
}

interface LevelMeta {
  id: LevelId;
  label: string;
  icon: string;
  childLabel: string | null;
}

const LEVELS_META: LevelMeta[] = [
  { id: 'root', label: 'Noventra Core', icon: 'Hexagon', childLabel: 'Компании' },
  { id: 'company', label: 'Компания (Заказчик)', icon: 'Landmark', childLabel: 'Проекты компании' },
  { id: 'project', label: 'Проект', icon: 'FolderKanban', childLabel: 'Объекты проекта' },
  { id: 'object', label: 'Объект', icon: 'Boxes', childLabel: 'Строительные площадки объекта' },
  { id: 'site', label: 'Строительная площадка', icon: 'HardHat', childLabel: 'Подрядные организации площадки' },
  { id: 'contractor', label: 'Подрядная организация', icon: 'Handshake', childLabel: 'Подразделения подрядчика' },
  { id: 'subdivision', label: 'Подразделение подрядчика', icon: 'Network', childLabel: 'Пользователи подразделения' },
  { id: 'user', label: 'Пользователь', icon: 'User', childLabel: null },
];

const NODES: Node[] = [
  { id: 'root', level: 'root', name: 'Noventra Core', code: '—', parentId: null },

  { id: 'cmp-1', level: 'company', name: 'ООО «СтройИнвест Групп»', code: 'CMP-001', status: 'Активен', parentId: 'root', owner: 'Иванов И. И.', createdAt: '12.01.2026' },
  { id: 'cmp-2', level: 'company', name: 'АО «СевТрансСтрой»', code: 'CMP-002', status: 'Активен', parentId: 'root', owner: 'Петров П. П.', createdAt: '03.02.2026' },

  { id: 'prj-101', level: 'project', name: 'Реконструкция ГПП-12', code: 'PRJ-101', status: 'В работе', parentId: 'cmp-1', owner: 'Смирнова А. В.', createdAt: '15.01.2026' },
  { id: 'prj-103', level: 'project', name: 'Модернизация ЛЭП №7', code: 'PRJ-103', status: 'Черновик', parentId: 'cmp-1', owner: 'Волкова Т. Н.', createdAt: '02.02.2026' },
  { id: 'prj-102', level: 'project', name: 'Строительство склада №4', code: 'PRJ-102', status: 'Черновик', parentId: 'cmp-2', owner: 'Кузнецов Д. С.', createdAt: '20.02.2026' },

  { id: 'obj-201', level: 'object', name: 'Подстанция 110/10 кВ', code: 'OBJ-201', status: 'В работе', parentId: 'prj-101', owner: 'Фёдоров Н. К.', createdAt: '18.01.2026' },
  { id: 'obj-203', level: 'object', name: 'РУ-10 кВ Корпус 2', code: 'OBJ-203', status: 'Черновик', parentId: 'prj-101', owner: 'Лебедев А. О.', createdAt: '22.01.2026' },
  { id: 'obj-204', level: 'object', name: 'Опора №12', code: 'OBJ-204', status: 'Черновик', parentId: 'prj-103', owner: 'Волкова Т. Н.', createdAt: '05.02.2026' },
  { id: 'obj-202', level: 'object', name: 'Складской корпус А', code: 'OBJ-202', status: 'Активен', parentId: 'prj-102', owner: 'Морозова Е. П.', createdAt: '25.02.2026' },

  { id: 'site-301', level: 'site', name: 'Площадка №1 (Северная)', code: 'SITE-301', status: 'Активен', parentId: 'obj-201', owner: 'Волков С. И.', createdAt: '22.01.2026' },
  { id: 'site-303', level: 'site', name: 'Площадка №3 (Южная)', code: 'SITE-303', status: 'В работе', parentId: 'obj-201', owner: 'Игнатьев Р. В.', createdAt: '27.01.2026' },
  { id: 'site-304', level: 'site', name: 'Площадка №4', code: 'SITE-304', status: 'Черновик', parentId: 'obj-203', owner: 'Лебедев А. О.', createdAt: '24.01.2026' },
  { id: 'site-302', level: 'site', name: 'Площадка №2 (Складская)', code: 'SITE-302', status: 'В работе', parentId: 'obj-202', owner: 'Никитина О. А.', createdAt: '01.03.2026' },

  { id: 'ctr-401', level: 'contractor', name: 'ООО «ЭнергоМонтаж»', code: 'CTR-401', status: 'Активен', parentId: 'site-301', owner: 'Соколов В. Г.', createdAt: '25.01.2026' },
  { id: 'ctr-403', level: 'contractor', name: 'ООО «ЭлектроСервис»', code: 'CTR-403', status: 'Активен', parentId: 'site-301', owner: 'Гришина Н. Д.', createdAt: '29.01.2026' },
  { id: 'ctr-404', level: 'contractor', name: 'ООО «ГидроСтрой»', code: 'CTR-404', status: 'Черновик', parentId: 'site-303', owner: 'Игнатьев Р. В.', createdAt: '30.01.2026' },
  { id: 'ctr-402', level: 'contractor', name: 'ООО «СтройБыстрой»', code: 'CTR-402', status: 'Активен', parentId: 'site-302', owner: 'Егорова М. В.', createdAt: '03.03.2026' },

  { id: 'sub-501', level: 'subdivision', name: 'Бригада электромонтажников №2', code: 'SUB-501', status: 'В работе', parentId: 'ctr-401', owner: 'Тарасов К. Л.', createdAt: '28.01.2026' },
  { id: 'sub-503', level: 'subdivision', name: 'Бригада сварщиков', code: 'SUB-503', status: 'Активен', parentId: 'ctr-401', owner: 'Пахомов Г. И.', createdAt: '01.02.2026' },
  { id: 'sub-504', level: 'subdivision', name: 'Участок наладки', code: 'SUB-504', status: 'Черновик', parentId: 'ctr-403', owner: 'Гришина Н. Д.', createdAt: '02.02.2026' },
  { id: 'sub-502', level: 'subdivision', name: 'Участок каменщиков', code: 'SUB-502', status: 'Активен', parentId: 'ctr-402', owner: 'Белова Ю. Н.', createdAt: '05.03.2026' },

  { id: 'usr-601', level: 'user', name: 'Дмитриев А. С.', code: 'USR-601', status: 'Активен', parentId: 'sub-501', owner: 'Тарасов К. Л.', createdAt: '29.01.2026' },
  { id: 'usr-603', level: 'user', name: 'Кузьмин П. Р.', code: 'USR-603', status: 'Активен', parentId: 'sub-501', owner: 'Тарасов К. Л.', createdAt: '30.01.2026' },
  { id: 'usr-604', level: 'user', name: 'Ткачёв О. М.', code: 'USR-604', status: 'Активен', parentId: 'sub-503', owner: 'Пахомов Г. И.', createdAt: '03.02.2026' },
  { id: 'usr-605', level: 'user', name: 'Панов И. С.', code: 'USR-605', status: 'Черновик', parentId: 'sub-504', owner: 'Гришина Н. Д.', createdAt: '04.02.2026' },
  { id: 'usr-602', level: 'user', name: 'Романова В. И.', code: 'USR-602', status: 'Активен', parentId: 'sub-502', owner: 'Белова Ю. Н.', createdAt: '06.03.2026' },
];

const statusTone: Record<string, string> = {
  'Активен': 'text-primary border-primary/30 bg-primary/10',
  'В работе': 'text-accent border-accent/30 bg-accent/10',
  'Черновик': 'text-muted-foreground border-border bg-secondary/60',
  'Архив': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

const getNode = (id: string) => NODES.find((n) => n.id === id)!;
const getChildren = (id: string) => NODES.filter((n) => n.parentId === id);
const getMeta = (level: LevelId) => LEVELS_META.find((l) => l.id === level)!;
const getPath = (id: string): Node[] => {
  const path: Node[] = [];
  let current: Node | undefined = getNode(id);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getNode(current.parentId) : undefined;
  }
  return path;
};

const EntityLinks = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('root');

  const node = getNode(selectedId);
  const meta = getMeta(node.level);
  const parent = node.parentId ? getNode(node.parentId) : null;
  const parentMeta = parent ? getMeta(parent.level) : null;
  const children = getChildren(node.id);
  const path = getPath(node.id);

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
            Noventra Core
          </button>
        </div>

        {/* Header */}
        <header className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            <Icon name="GitBranch" size={13} />
            Entity Links
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Связи <span className="text-primary text-glow">сущностей</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Навигация по утверждённой иерархии Noventra: от компании-заказчика до конечного пользователя.
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
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{meta.label}</div>
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
            {node.status && (
              <span className={`rounded-full border px-3 py-1 font-mono text-[11px] ${statusTone[node.status]}`}>
                {node.status}
              </span>
            )}
          </div>

          {/* Parent link */}
          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Родительская сущность</div>
            {parent ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Icon name={parentMeta!.icon} size={18} className="text-primary" />
                  <div>
                    <div className="text-sm font-medium">{parent.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{parentMeta!.label}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedId(parent.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon name="ExternalLink" size={14} />
                  Открыть
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-3 text-sm italic text-muted-foreground">
                Корневая сущность — родителя нет
              </div>
            )}
          </div>
        </section>

        {/* Children section */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-xl font-semibold">{meta.childLabel ?? 'Дочерние сущности'}</h3>
              <span className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                {children.length}
              </span>
            </div>
            {meta.childLabel && (
              <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow">
                <Icon name="Plus" size={16} />
                Добавить дочерний элемент
              </button>
            )}
          </div>

          {children.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child, i) => {
                const childMeta = getMeta(child.level);
                const childChildrenCount = getChildren(child.id).length;
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
                          {child.status}
                        </span>
                      )}
                    </div>

                    {childMeta.childLabel && (
                      <div className="mb-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                        <Icon name="CornerDownRight" size={13} />
                        {childChildrenCount} {childMeta.childLabel.toLowerCase()}
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedId(child.id)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <Icon name="ExternalLink" size={15} />
                      Открыть
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-border py-14 text-center">
              <Icon name="FolderOpen" size={30} className="mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {meta.childLabel ? 'Дочерние сущности ещё не добавлены' : 'У пользователя нет дочерних сущностей'}
              </p>
            </div>
          )}
        </section>

        <footer className="mt-14 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>Noventra Core · Связи сущностей</span>
          <span>Уровень: {meta.label}</span>
        </footer>
      </main>
    </div>
  );
};

export default EntityLinks;
