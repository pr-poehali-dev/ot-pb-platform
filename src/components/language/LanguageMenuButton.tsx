import Icon from '@/components/ui/icon';
import { useLocale } from '@/core';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

/**
 * Кнопка 🌐 верхней панели рядом с профилем пользователя.
 * Открывает список языков платформы; выбор переключает интерфейс мгновенно
 * и сохраняется в профиле текущего пользователя через Language Engine.
 */
const LanguageMenuButton = () => {
  const { locale, setLocale, availableLocales } = useLocale();
  const activeMeta = availableLocales.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="grid h-11 w-11 place-items-center rounded-xl border border-border glass transition-colors hover:border-primary/40"
          title={activeMeta?.nativeLabel}
        >
          <span className="text-lg leading-none">🌐</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableLocales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={l.code === locale ? 'bg-primary/10 text-primary' : ''}
          >
            <span className="flex-1">{l.nativeLabel}</span>
            {l.code === locale && <Icon name="Check" size={14} className="text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageMenuButton;
