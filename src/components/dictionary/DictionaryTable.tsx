import { useMemo, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { DictionaryConfig, DictionaryItem, DictionaryStatus, statusTone } from '@/data/dictionaries';

type SortKey = 'name' | 'code' | 'createdAt' | 'updatedAt';
type SortDir = 'asc' | 'desc';

interface DictionaryTableProps {
  config: DictionaryConfig;
  items: DictionaryItem[];
  onView: (item: DictionaryItem) => void;
  onEdit: (item: DictionaryItem) => void;
  onArchive: (item: DictionaryItem) => void;
  onRestore: (item: DictionaryItem) => void;
}

const STATUS_FILTERS: Array<DictionaryStatus | 'all'> = ['all', 'Активен', 'Черновик', 'Архив'];

const DictionaryTable = ({ config, items, onView, onEdit, onArchive, onRestore }: DictionaryTableProps) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DictionaryStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase())
    );
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }
    result = [...result].sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      const cmp = av.localeCompare(bv, 'ru');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [items, query, statusFilter, sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <Icon name="ArrowUpDown" size={13} className="text-muted-foreground/50" />;
    return <Icon name={sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={13} className="text-primary" />;
  };

  return (
    <div>
      {/* Search + filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-border glass px-3.5 py-2.5">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Поиск по «${config.title}»…`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DictionaryStatus | 'all')}>
          <SelectTrigger className="w-44 border-border bg-background/60 glass">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent className="glass border-border">
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? 'Все статусы' : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
          {filtered.length} / {items.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border glass">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">
                <button onClick={() => toggleSort('code')} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
                  Код <SortIcon column="code" />
                </button>
              </TableHead>
              <TableHead className="text-muted-foreground">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
                  Название <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead className="text-muted-foreground">Ответственный</TableHead>
              <TableHead className="text-muted-foreground">Статус</TableHead>
              <TableHead className="text-muted-foreground">
                <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
                  Создано <SortIcon column="createdAt" />
                </button>
              </TableHead>
              <TableHead className="text-right text-muted-foreground">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="border-border">
                <TableCell className="font-mono text-xs text-muted-foreground">{item.code}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.owner}</TableCell>
                <TableCell>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${statusTone[item.status]}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{item.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      title="Просмотреть"
                    >
                      <Icon name="Eye" size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      title="Редактировать"
                    >
                      <Icon name="Pencil" size={14} />
                    </button>
                    {item.status === 'Архив' ? (
                      <button
                        onClick={() => onRestore(item)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        title="Восстановить"
                      >
                        <Icon name="RotateCcw" size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onArchive(item)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-amber-400/50 hover:text-amber-400"
                        title="Архивировать"
                      >
                        <Icon name="Archive" size={14} />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="grid place-items-center py-14 text-center">
            <Icon name="SearchX" size={28} className="mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Записи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryTable;
