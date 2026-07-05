import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslate } from '@/core';
import LanguageSelect from '@/components/language/LanguageSelect';

/**
 * Экран входа платформы Noventra Core.
 * Содержит выпадающий список выбора языка (Language Engine) — язык переключается
 * мгновенно, без перезагрузки страницы, и запоминается для текущего пользователя.
 * Бизнес-логика аутентификации не реализуется — интерфейс демонстрационный.
 */
const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <div className="relative flex min-h-screen items-center justify-center grid-bg px-4 text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5" />

      <div className="absolute right-5 top-5">
        <LanguageSelect className="w-44" />
      </div>

      <div className="relative w-full max-w-sm rounded-2xl border border-border glass p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 glow">
            <Icon name="Hexagon" size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight">{t('common:login.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('common:login.subtitle')}</p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login-email">{t('common:login.emailLabel')}</Label>
            <Input id="login-email" type="email" placeholder={t('common:login.emailPlaceholder')} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login-password">{t('common:login.passwordLabel')}</Label>
            <Input id="login-password" type="password" placeholder={t('common:login.passwordPlaceholder')} />
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow"
          >
            <Icon name="LogIn" size={16} />
            {t('common:buttons.login')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
