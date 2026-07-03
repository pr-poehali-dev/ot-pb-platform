import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface EntityCard {
  name: string;
  code: string;
  status: 'Активен' | 'В работе' | 'Черновик' | 'Архив';
  parent: string | null;
  owner: string;
  createdAt: string;
}

interface Level {
  id: string;
  title: string;
  icon: string;
  desc: string;
  items: EntityCard[];
}

const LEVELS: Level[] = [
  {
    id: 'company',
    title: 'Компания (Заказчик)',
    icon: 'Landmark',
    desc: 'Верхний уровень иерархии — юридическое лицо заказчика',
    items: [
      { name: 'ООО «СтройИнвест Групп»', code: 'CMP-001', status: 'Активен', parent: null, owner: 'Иванов И. И.', createdAt: '12.01.2026' },
      { name: 'АО «СевТрансСтрой»', code: 'CMP-002', status: 'Активен', parent: null, owner: 'Петров П. П.', createdAt: '03.02.2026' },
    ],
  },
  {
    id: 'project',
    title: 'Проект',
    icon: 'FolderKanban',
    desc: 'Проект в рамках компании-заказчика',
    items: [
      { name: 'Реконструкция ГПП-12', code: 'PRJ-101', status: 'В работе', parent: 'ООО «СтройИнвест Групп»', owner: 'Смирнова А. В.', createdAt: '15.01.2026' },
      { name: 'Строительство склада №4', code: 'PRJ-102', status: 'Черновик', parent: 'АО «СевТрансСтрой»', owner: 'Кузнецов Д. С.', createdAt: '20.02.2026' },
    ],
  },
  {
    id: 'object',
    title: 'Объект',
    icon: 'Boxes',
    desc: 'Объект капитального строительства в составе проекта',
    items: [
      { name: 'Подстанция 110/10 кВ', code: 'OBJ-201', status: 'В работе', parent: 'Реконструкция ГПП-12', owner: 'Фёдоров Н. К.', createdAt: '18.01.2026' },
      { name: 'Складской корпус А', code: 'OBJ-202', status: 'Активен', parent: 'Строительство склада №4', owner: 'Морозова Е. П.', createdAt: '25.02.2026' },
    ],
  },
  {
    id: 'site',
    title: 'Строительная площадка',
    icon: 'HardHat',
    desc: 'Территория проведения строительных работ',
    items: [
      { name: 'Площадка №1 (Северная)', code: 'SITE-301', status: 'Активен', parent: 'Подстанция 110/10 кВ', owner: 'Волков С. И.', createdAt: '22.01.2026' },
      { name: 'Площадка №2 (Складская)', code: 'SITE-302', status: 'В работе', parent: 'Складской корпус А', owner: 'Никитина О. А.', createdAt: '01.03.2026' },
    ],
  },
  {
    id: 'contractor',
    title: 'Подрядная организация',
    icon: 'Handshake',
    desc: 'Организация-исполнитель работ на площадке',
    items: [
      { name: 'ООО «ЭнергоМонтаж»', code: 'CTR-401', status: 'Активен', parent: 'Площадка №1 (Северная)', owner: 'Соколов В. Г.', createdAt: '25.01.2026' },
      { name: 'ООО «СтройБыстрой»', code: 'CTR-402', status: 'Активен', parent: 'Площадка №2 (Складская)', owner: 'Егорова М. В.', createdAt: '03.03.2026' },
    ],
  },
  {
    id: 'subdivision',
    title: 'Подразделение подрядчика',
    icon: 'Network',
    desc: 'Бригада или структурное подразделение подрядчика',
    items: [
      { name: 'Бригада электромонтажников №2', code: 'SUB-501', status: 'В работе', parent: 'ООО «ЭнергоМонтаж»', owner: 'Тарасов К. Л.', createdAt: '28.01.2026' },
      { name: 'Участок каменщиков', code: 'SUB-502', status: 'Активен', parent: 'ООО «СтройБыстрой»', owner: 'Белова Ю. Н.', createdAt: '05.03.2026' },
    ],
  },
  {
    id: 'user',
    title: 'Пользователь',
    icon: 'User',
    desc: 'Конечный сотрудник в структуре подразделения',
    items: [
      { name: 'Дмитриев А. С.', code: 'USR-601', status: 'Активен', parent: 'Бригада электромонтажников №2', owner: 'Тарасов К. Л.', createdAt: '29.01.2026' },
      { name: 'Романова В. И.', code: 'USR-602', status: 'Активен', parent: 'Участок каменщиков', owner: 'Белова Ю. Н.', createdAt: '06.03.2026' },
    ],
  },
];

const statusTone: Record<EntityCard['status'], string> = {
  'Активен': 'text-primary border-primary/30 bg-primary/10',
  'В работе': 'text-accent border-accent/30 bg-accent/10',
  'Черновик': 'text-muted-foreground border-border bg-secondary/60',
  'Архив': 'text-amber-400 border-amber-400/30 bg-amber-400/10',
};

const Hierarchy = () => {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState(LEVELS[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollTo = (id: string) => {
    setActiveLevel(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
            Noventra Core
          </button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">Иерархия данных</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            <Icon name="Workflow" size={13} />
            Data Hierarchy
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Иерархия <span className="text-primary text-glow">данных</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Сквозная структура сущностей платформы: от компании-заказчика до конечного пользователя на площадке.
          </p>
        </header>

        {/* Level stepper */}
        <div className="mb-10 overflow-x-auto rounded-2xl border border-border glass p-4">
          <div className="flex min-w-max items-center gap-1">
            {LEVELS.map((lvl, i) => (
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
                  <span className="whitespace-nowrap">{lvl.title}</span>
                </button>
                {i < LEVELS.length - 1 && <Icon name="ChevronRight" size={16} className="shrink-0 text-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Levels */}
        <div className="space-y-14">
          {LEVELS.map((lvl, levelIdx) => (
            <section
              key={lvl.id}
              ref={(el) => (sectionRefs.current[lvl.id] = el)}
              className="scroll-mt-8"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 glow">
                  <Icon name={lvl.icon} size={22} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    Уровень {levelIdx + 1} из {LEVELS.length}
                  </div>
                  <h2 className="font-display text-xl font-semibold">{lvl.title}</h2>
                  <p className="text-sm text-muted-foreground">{lvl.desc}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {lvl.items.map((item, i) => (
                  <div
                    key={item.code}
                    className="group animate-float-in relative overflow-hidden rounded-2xl border border-border glass p-5 transition-all hover:border-primary/40"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-base font-semibold">{item.name}</h3>
                        <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[11px] ${statusTone[item.status]}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="space-y-2 border-t border-border pt-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="CornerLeftUp" size={14} className="shrink-0" />
                        <span className="truncate">
                          {item.parent ? item.parent : <span className="italic text-border">Корневая сущность</span>}
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
                      <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                        <Icon name="ExternalLink" size={15} />
                        Открыть
                      </button>
                      <button
                        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                        title="Редактировать"
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-amber-400/50 hover:text-amber-400"
                        title="Архивировать"
                      >
                        <Icon name="Archive" size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add new card placeholder */}
                <button className="grid min-h-[200px] place-items-center rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="Plus" size={22} />
                    <span className="text-sm">Добавить: {lvl.title.toLowerCase()}</span>
                  </div>
                </button>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-14 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
          <span>Noventra Core · Иерархия данных</span>
          <span>7 уровней структуры</span>
        </footer>
      </main>
    </div>
  );
};

export default Hierarchy;
