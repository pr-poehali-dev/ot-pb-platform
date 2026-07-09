import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';

interface PersonnelClearanceTabPlaceholderProps {
  icon: string;
  titleKey: string;
}

/**
 * Временная заглушка содержимого вкладки модуля «Предварительный допуск персонала».
 * Показывает только заголовок раздела — без форм, таблиц и данных.
 * Будет заменена реальным содержимым при реализации бизнес-логики вкладки.
 */
const PersonnelClearanceTabPlaceholder = ({ icon, titleKey }: PersonnelClearanceTabPlaceholderProps) => {
  const { t } = useTranslate();

  return (
    <div className="rounded-2xl border border-dashed border-border glass p-12 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10">
        <Icon name={icon} size={26} className="text-primary" />
      </div>
      <h2 className="font-display text-xl font-semibold">{t(titleKey)}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('dict.personnelClearance:tabPlaceholder', { params: { tab: t(titleKey) } })}
      </p>
    </div>
  );
};

export default PersonnelClearanceTabPlaceholder;
