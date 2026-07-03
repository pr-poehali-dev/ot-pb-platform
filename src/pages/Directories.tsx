import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const DIRECTORIES = [
  { id: 'orgs', icon: 'Building2', title: 'Организации', desc: 'Юридические лица, филиалы и структура компаний' },
  { id: 'contractors', icon: 'Handshake', title: 'Подрядчики', desc: 'Внешние организации-исполнители работ' },
  { id: 'objects', icon: 'Boxes', title: 'Объекты', desc: 'Производственные и офисные объекты' },
  { id: 'sites', icon: 'HardHat', title: 'Строительные площадки', desc: 'Учёт стройплощадок и участков работ' },
  { id: 'users', icon: 'Users', title: 'Пользователи', desc: 'Учётные записи сотрудников' },
  { id: 'roles', icon: 'ShieldCheck', title: 'Роли', desc: 'Наборы прав для групп пользователей' },
  { id: 'zones', icon: 'MapPinned', title: 'Зоны ответственности', desc: 'Привязка людей к объектам и участкам' },
  { id: 'positions', icon: 'BriefcaseBusiness', title: 'Должности', desc: 'Штатные должности сотрудников' },
  { id: 'work-types', icon: 'Wrench', title: 'Виды работ', desc: 'Классификатор выполняемых работ' },
  { id: 'equipment', icon: 'Truck', title: 'Типы техники', desc: 'Спецтехника и оборудование' },
  { id: 'violations', icon: 'TriangleAlert', title: 'Категории нарушений', desc: 'Классификатор нарушений ОТ и ПБ' },
  { id: 'statuses', icon: 'CircleDot', title: 'Статусы', desc: 'Статусы объектов и процессов' },
  { id: 'priorities', icon: 'Flag', title: 'Приоритеты', desc: 'Уровни важности задач и событий' },
];

const Directories = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = DIRECTORIES.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen grid-bg text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <main className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Breadcrumb + back */}
        <div className="mb-8 flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border glass px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Icon name="ArrowLeft" size={14} />
            Noventra Core
          </button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">Единые справочники</span>
        </div>

        {/* Header */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
              <Icon name="Library" size={13} />
              Master Data
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Единые <span className="text-primary text-glow">справочники</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Централизованные справочники ядра. Единый источник данных для всех модулей платформы ОТ и ПБ.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-all hover:glow">
            <Icon name="Plus" size={18} />
            Новый справочник
          </button>
        </header>

        {/* Search */}
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-border glass px-4 py-3">
          <Icon name="Search" size={18} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по справочникам…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="font-mono text-xs text-muted-foreground">{filtered.length} / {DIRECTORIES.length}</span>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <div
              key={d.id}
              className="group animate-float-in relative flex flex-col overflow-hidden rounded-2xl border border-border glass p-5 transition-all hover:border-primary/40"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />

              <div className="mb-4 flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-secondary/60 transition-colors group-hover:border-primary/40">
                  <Icon name={d.icon} size={22} className="text-primary" />
                </div>
                <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                  0 записей
                </span>
              </div>

              <h3 className="font-display text-base font-semibold">{d.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{d.desc}</p>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                  <Icon name="Plus" size={15} />
                  Добавить
                </button>
                <button
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                  title="Редактировать"
                >
                  <Icon name="Pencil" size={16} />
                </button>
                <button
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                  title="Удалить"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
            <Icon name="SearchX" size={32} className="mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Справочники не найдены</p>
          </div>
        )}

        <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>Noventra Core · Единые справочники</span>
          <span>13 справочников</span>
        </footer>
      </main>
    </div>
  );
};

export default Directories;
