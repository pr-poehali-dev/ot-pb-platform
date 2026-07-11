import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import { useReferenceList } from '@/core/reference-data';
import { MatrixDocumentRequirement } from '@/core/requirement-matrix';

interface MatrixDocumentsTabProps {
  documents: MatrixDocumentRequirement[];
  mandatory: boolean;
  onAdd: (documentTypeId: string) => void;
}

/**
 * Универсальная вкладка списка требований к документам. Используется как для
 * «Обязательные документы» (mandatory=true), так и для «Дополнительные
 * документы» (mandatory=false) — единственное отличие передаётся пропом.
 * Список типов документов подключён через Reference Data Engine
 * (список 'document-types', сейчас — заглушка).
 */
const MatrixDocumentsTab = ({ documents, mandatory, onAdd }: MatrixDocumentsTabProps) => {
  const { t } = useTranslate();
  const { items } = useReferenceList('document-types');
  const [selected, setSelected] = useState<string>('');

  const emptyKey = mandatory ? 'dict.requirementMatrix:documentsEmptyRequired' : 'dict.requirementMatrix:documentsEmptyOptional';

  return (
    <div className="rounded-2xl border border-border glass p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold">
          {t(mandatory ? 'dict.requirementMatrix:tabRequiredDocuments' : 'dict.requirementMatrix:tabOptionalDocuments')}
        </h3>
        <div className="flex items-center gap-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-56 border-border bg-background/60 glass">
              <SelectValue placeholder={t('dict.ui:name')} />
            </SelectTrigger>
            <SelectContent className="glass border-border">
              {items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            onClick={() => {
              if (selected) onAdd(selected);
              setSelected('');
            }}
            disabled={!selected}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-all hover:glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="Plus" size={15} />
            {t('dict.requirementMatrix:documentsAddAction')}
          </button>
        </div>
      </div>

      {documents.length > 0 ? (
        <div className="space-y-2">
          {documents.map((doc) => {
            const item = items.find((i) => i.id === doc.documentTypeId);
            return (
              <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <span className="text-sm">{item?.label ?? doc.documentTypeId}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {t(emptyKey)}
        </div>
      )}
    </div>
  );
};

export default MatrixDocumentsTab;
