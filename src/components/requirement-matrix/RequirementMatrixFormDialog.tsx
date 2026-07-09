import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { useToast } from '@/hooks/use-toast';
import { MatrixDomainId, MatrixPriorityLevel, MatrixPriorityLevelValue, MatrixScopeType, useRequirementMatrices } from '@/core/requirement-matrix';
import { MATRIX_PRIORITY_KEY, MATRIX_SCOPE_KEY } from '@/data/requirementMatrixKeys';

interface RequirementMatrixFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: MatrixDomainId;
  actor: string;
  onCreated?: (matrixId: string) => void;
}

const PRIORITY_OPTIONS: MatrixPriorityLevelValue[] = [
  MatrixPriorityLevel.Legislation,
  MatrixPriorityLevel.Corporate,
  MatrixPriorityLevel.Project,
  MatrixPriorityLevel.Customer,
  MatrixPriorityLevel.Temporary,
];

const SCOPE_OPTIONS: MatrixScopeType[] = ['global', 'project', 'object', 'contractor'];

/**
 * Универсальный диалог создания новой матрицы требований в реестре домена.
 * Создаёт только запись верхнего уровня (название, приоритет, область
 * применения) — заполнение остальных вкладок карточки происходит отдельно.
 */
const RequirementMatrixFormDialog = ({ open, onOpenChange, domain, actor, onCreated }: RequirementMatrixFormDialogProps) => {
  const { t } = useTranslate();
  const { toast } = useToast();
  const { createMatrix } = useRequirementMatrices();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MatrixPriorityLevelValue>(MatrixPriorityLevel.Corporate);
  const [scopeType, setScopeType] = useState<MatrixScopeType>('global');

  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setPriority(MatrixPriorityLevel.Corporate);
      setScopeType('global');
    }
  }, [open]);

  const isValid = name.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const matrix = createMatrix({
      name: name.trim(),
      description: description.trim() || undefined,
      domain,
      priority,
      mandatory: false,
      scope: { scopeType },
      changedBy: actor,
      changeDescription: 'Матрица создана',
    });

    toast({
      title: t('dict.requirementMatrix:toastCreatedTitle'),
      description: t('dict.requirementMatrix:toastCreatedDesc', { params: { name: matrix.name } }),
    });

    onOpenChange(false);
    onCreated?.(matrix.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
              <Icon name="Grid3x3" size={16} className="text-primary" />
            </div>
            <DialogTitle className="font-display">{t('dict.requirementMatrix:createTitle')}</DialogTitle>
          </div>
          <DialogDescription>{t('dict.requirementMatrix:createDesc')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="matrix-name">{t('dict.requirementMatrix:fieldName')}</Label>
            <Input id="matrix-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('dict.requirementMatrix:fieldNamePlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="matrix-desc">{t('dict.ui:description')}</Label>
            <Textarea id="matrix-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid gap-2">
            <Label>{t('dict.requirementMatrix:tabPriority')}</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as MatrixPriorityLevelValue)}>
              <SelectTrigger className="border-border bg-background/60 glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                {PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {t(`dict.requirementMatrix:${MATRIX_PRIORITY_KEY[p]}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>{t('dict.requirementMatrix:tabScope')}</Label>
            <Select value={scopeType} onValueChange={(v) => setScopeType(v as MatrixScopeType)}>
              <SelectTrigger className="border-border bg-background/60 glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-border">
                {SCOPE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`dict.requirementMatrix:${MATRIX_SCOPE_KEY[s]}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('dict.buttons:cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="Plus" size={15} />
            {t('dict.buttons:create')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementMatrixFormDialog;
