import { useState } from 'react';
import Icon from '@/components/ui/icon';

const NAV = [
  { id: 'overview', label: 'Обзор', icon: 'LayoutGrid' },
  { id: 'auth', label: 'Авторизация', icon: 'KeyRound' },
  { id: 'users', label: 'Пользователи', icon: 'Users' },
  { id: 'roles', label: 'Роли', icon: 'ShieldCheck' },
  { id: 'access', label: 'Права доступа', icon: 'Lock' },
  { id: 'orgs', label: 'Организации', icon: 'Building2' },
  { id: 'objects', label: 'Объекты', icon: 'Boxes' },
  { id: 'sites', label: 'Стройплощадки', icon: 'HardHat' },
  { id: 'zones', label: 'Зоны ответственности', icon: 'MapPinned' },
  { id: 'settings', label: 'Настройки', icon: 'Settings2' },
  { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
  { id: 'audit', label: 'Журнал действий', icon: 'ScrollText' },
  { id: 'api', label: 'API ядра', icon: 'Cable' },
];

const MODULES = [
  { icon: 'KeyRound', title: 'Авторизация', desc: 'SSO, 2FA, сессии и токены доступа', stat: 'Активна', tone: 'ok' },
  { icon: 'Users', title: 'Пользователи', desc: 'Учётные записи и профили сотрудников', stat: '1 248', tone: 'num' },
  { icon: 'ShieldCheck', title: 'Роли', desc: 'Наборы прав для групп пользователей', stat: '24 роли', tone: 'num' },
  { icon: 'Lock', title: 'Права доступа', desc: 'Гранулярный контроль по действиям', stat: 'RBAC', tone: 'num' },
  { icon: 'Building2', title: 'Организации', desc: 'Юрлица, филиалы и структура компаний', stat: '36', tone: 'num' },
  { icon: 'Boxes', title: 'Объекты', desc: 'Производственные и офисные объекты', stat: '312', tone: 'num' },
  { icon: 'HardHat', title: 'Стройплощадки', desc: 'Учёт строительных площадок и работ', stat: '58', tone: 'num' },
  { icon: 'MapPinned', title: 'Зоны ответственности', desc: 'Привязка людей к объектам и участкам', stat: '184', tone: 'num' },
  { icon: 'Settings2', title: 'Настройки платформы', desc: 'Глобальные параметры и интеграции', stat: 'Готово', tone: 'ok' },
  { icon: 'Bell', title: 'Центр уведомлений', desc: 'События, оповещения и рассылки', stat: '7 новых', tone: 'warn' },
  { icon: 'ScrollText', title: 'Журнал действий', desc: 'Полный аудит операций в системе', stat: 'Live', tone: 'ok' },
  { icon: 'Cable', title: 'API ядра', desc: 'Единая точка подключения модулей', stat: 'v1.0', tone: 'num' },
];

const toneClass: Record<string, string> = {
  ok: 'text-primary border-primary/30 bg-primary/10',
  warn: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  num: 'text-accent border-accent/30 bg-accent/10',
};

const Index = () => {
  const [active, setActive] = useState('overview');

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
              <div className="font-display text-lg font-bold tracking-tight">Noventra</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Core</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                  active === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={18} className={active === item.id ? 'text-primary' : ''} />
                <span className="truncate">{item.label}</span>
                {active === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />}
              </button>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-secondary/60 p-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-accent/20 font-mono text-sm text-accent">АС</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Администратор</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">root@noventra</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-6 sm:px-8 lg:px-12">
          {/* Topbar */}
          <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                Система работает
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Noventra <span className="text-primary text-glow">Core</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Центральное ядро платформы охраны труда и пожарной безопасности. Все модули подключаются через единый контур управления.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="grid h-11 w-11 place-items-center rounded-xl border border-border glass transition-colors hover:border-primary/40">
                <Icon name="Search" size={18} className="text-muted-foreground" />
              </button>
              <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-border glass transition-colors hover:border-primary/40">
                <Icon name="Bell" size={18} className="text-muted-foreground" />
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] text-accent-foreground">7</span>
              </button>
            </div>
          </header>

          {/* Stats */}
          <section className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Активных модулей', value: '13', icon: 'Component', hint: 'ядро + подсистемы' },
              { label: 'Пользователей', value: '1 248', icon: 'Users', hint: '+38 за неделю' },
              { label: 'Объектов под контролем', value: '370', icon: 'Boxes', hint: 'объекты + площадки' },
              { label: 'Событий в журнале', value: '24.6k', icon: 'Activity', hint: 'за 30 дней' },
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
              <h2 className="font-display text-xl font-semibold">Модули ядра</h2>
              <span className="font-mono text-xs text-muted-foreground">14 подсистем</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {MODULES.map((m, i) => (
                <button
                  key={m.title}
                  className="group animate-float-in relative overflow-hidden rounded-2xl border border-border glass p-5 text-left transition-all hover:border-primary/40 hover:glow"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:bg-primary/10" />
                  <div className="mb-4 flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-border bg-secondary/60 transition-colors group-hover:border-primary/40">
                      <Icon name={m.icon} size={22} className="text-primary" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${toneClass[m.tone]}`}>{m.stat}</span>
                  </div>
                  <h3 className="font-display text-base font-semibold">{m.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  <div className="mt-4 flex items-center gap-1.5 font-mono text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Открыть <Icon name="ArrowRight" size={14} />
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
                <h3 className="font-display font-semibold">Шина подключения модулей</h3>
                <p className="text-sm text-muted-foreground">Бизнес-модули подключаются к ядру через API. Место для будущих модулей ОТ и ПБ.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Инструктажи', 'СИЗ', 'Проверки', 'Инциденты', 'Обучение', '+ ещё'].map((t) => (
                  <span key={t} className="rounded-lg border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          </section>

          <footer className="mt-10 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
            <span>Noventra Core · v1.0</span>
            <span>© 2026 · Платформа ОТ и ПБ</span>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
