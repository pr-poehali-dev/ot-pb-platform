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
import { useTranslate } from '@/core';
import { DictionaryConfig, DictionaryItem, DictionaryStatus, statusTone } from '@/data/dictionaries';
import { DICTIONARY_STATUS_KEY } from '@/i18n/statusKeys';

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
  const { t } = useTranslate();
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
            placeholder={t('dict.app:dictTableSearchPlaceholder', { params: { title: config.title } })}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DictionaryStatus | 'all')}>
          <SelectTrigger className="w-44 border-border bg-background/60 glass">
            <SelectValue placeholder={t('dict.ui:status')} />
          </SelectTrigger>
          <SelectContent className="glass border-border">
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? t('dict.app:dictTableAllStatuses') : t(`dict.statuses:${DICTIONARY_STATUS_KEY[s]}`)}
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
                  {t('dict.ui:code')} <SortIcon column="code" />
                </button>
              </TableHead>
              <TableHead className="text-muted-foreground">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
                  {t('dict.ui:name')} <SortIcon column="name" />
                </button>
              </TableHead>
              <TableHead className="text-muted-foreground">{t('dict.ui:owner')}</TableHead>
              <TableHead className="text-muted-foreground">{t('dict.ui:status')}</TableHead>
              <TableHead className="text-muted-foreground">
                <button onClick={() => toggleSort('createdAt')} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
                  {t('dict.app:dictTableColumnCreated')} <SortIcon column="createdAt" />
                </button>
              </TableHead>
              <TableHead className="text-right text-muted-foreground">{t('dict.app:dictTableColumnActions')}</TableHead>
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
                    {t(`dict.statuses:${DICTIONARY_STATUS_KEY[item.status]}`)}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{item.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(item)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      title={t('dict.app:viewAction')}
                    >
                      <Icon name="Eye" size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      title={t('dict.buttons:edit')}
                    >
                      <Icon name="Pencil" size={14} />
                    </button>
                    {item.status === 'Архив' ? (
                      <button
                        onClick={() => onRestore(item)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        title={t('dict.buttons:restore')}
                      >
                        <Icon name="RotateCcw" size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onArchive(item)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-amber-400/50 hover:text-amber-400"
                        title={t('dict.buttons:archive')}
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
            <p className="text-sm text-muted-foreground">{t('dict.app:dictTableNoRecords')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryTable;
