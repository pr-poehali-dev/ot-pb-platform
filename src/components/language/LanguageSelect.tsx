import { useLocale, useTranslate } from '@/core';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface LanguageSelectProps {
  className?: string;
}

/**
 * Выпадающий список выбора языка — переиспользуемый компонент поверх
 * Language Engine (useLocale). Используется на экране входа и в профиле пользователя.
 * Переключение происходит мгновенно, без перезагрузки страницы, и сохраняется
 * в персональных настройках текущего пользователя (core/user-settings).
 */
const LanguageSelect = ({ className }: LanguageSelectProps) => {
  const { locale, setLocale, availableLocales } = useLocale();
  const { t } = useTranslate();

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={t('common:language.selectPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {availableLocales.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.nativeLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
