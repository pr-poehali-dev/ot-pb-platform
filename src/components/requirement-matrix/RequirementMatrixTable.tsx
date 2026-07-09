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
import { RequirementMatrix, MatrixStatus } from '@/core/requirement-matrix';
import { MATRIX_STATUS_KEY, MATRIX_STATUS_TONE, MATRIX_PRIORITY_KEY } from '@/data/requirementMatrixKeys';

interface RequirementMatrixTableProps {
  matrices: RequirementMatrix[];
  query: string;
  onQueryChange: (query: string) => void;
  statusFilter: MatrixStatus | 'all';
  onStatusFilterChange: (status: MatrixStatus | 'all') => void;
  onOpen: (matrix: RequirementMatrix) => void;
  onDuplicate: (matrix: RequirementMatrix) => void;
  onArchive: (matrix: RequirementMatrix) => void;
  onRestore: (matrix: RequirementMatrix) => void;
}

const STATUS_FILTERS: Array<MatrixStatus | 'all'> = ['all', 'draft', 'active', 'archived'];

/**
 * Универсальная таблица реестра матриц требований (namespace dict.requirementMatrix):
 * поиск, фильтр по статусу, действия (открыть карточку, копировать,
 * архивировать/восстановить). Используется любым доменом Requirement Matrix
 * Engine — компонент не знает о конкретном модуле-потребителе.
 */
const RequirementMatrixTable = ({
  matrices,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  onOpen,
  onDuplicate,
  onArchive,
  onRestore,
}: RequirementMatrixTableProps) => {
  const { t } = useTranslate();
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(
    () =>
      [...matrices].sort((a, b) => {
        const cmp = a.updatedAt.localeCompare(b.updatedAt);
        return sortDir === 'asc' ? cmp : -cmp;
      }),
    [matrices, sortDir]
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-border glass px-3.5 py-2.5">
          <Icon name="Search" size={16} className="text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t('dict.requirementMatrix:searchPlaceholder')}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as MatrixStatus | 'all')}>
          <SelectTrigger className="w-44 border-border bg-background/60 glass">
            <SelectValue placeholder={t('dict.ui:status')} />
          </SelectTrigger>
          <SelectContent className="glass border-border">
            {STATUS_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? t('dict.app:dictTableAllStatuses') : t(`dict.requirementMatrix:${MATRIX_STATUS_KEY[s]}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="whitespace-nowrap rounded-full border border-border bg-secondary/60 px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
          {matrices.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border glass">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">{t('dict.requirementMatrix:columnName')}</TableHead>
              <TableHead className="text-muted-foreground">{t('dict.requirementMatrix:columnPriority')}</TableHead>
              <TableHead className="text-muted-foreground">{t('dict.ui:status')}</TableHead>
              <TableHead className="text-muted-foreground">{t('dict.requirementMatrix:columnVersion')}</TableHead>
              <TableHead className="text-muted-foreground">
                <button onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))} className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide">
                  {t('dict.requirementMatrix:columnUpdatedAt')}
                  <Icon name={sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={13} className="text-primary" />
                </button>
              </TableHead>
              <TableHead className="text-right text-muted-foreground">{t('dict.app:dictTableColumnActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((matrix) => (
              <TableRow key={matrix.id} className="border-border">
                <TableCell className="font-medium">
                  <button onClick={() => onOpen(matrix)} className="text-left hover:text-primary">
                    {matrix.name}
                  </button>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t(`dict.requirementMatrix:${MATRIX_PRIORITY_KEY[matrix.priority]}`)}
                </TableCell>
                <TableCell>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${MATRIX_STATUS_TONE[matrix.status]}`}>
                    {t(`dict.requirementMatrix:${MATRIX_STATUS_KEY[matrix.status]}`)}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">v{matrix.version}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{matrix.updatedAt.slice(0, 10)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onOpen(matrix)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      title={t('dict.app:viewAction')}
                    >
                      <Icon name="Eye" size={14} />
                    </button>
                    <button
                      onClick={() => onDuplicate(matrix)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                      title={t('dict.requirementMatrix:duplicateAction')}
                    >
                      <Icon name="Copy" size={14} />
                    </button>
                    {matrix.status === 'archived' ? (
                      <button
                        onClick={() => onRestore(matrix)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        title={t('dict.buttons:restore')}
                      >
                        <Icon name="RotateCcw" size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onArchive(matrix)}
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

        {sorted.length === 0 && (
          <div className="grid place-items-center py-14 text-center">
            <Icon name="SearchX" size={28} className="mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('dict.app:dictTableNoRecords')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementMatrixTable;
