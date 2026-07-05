import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useTranslate } from '@/core';
import LanguageSelect from './LanguageSelect';

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Настройки профиля пользователя. Содержит настройку «Язык интерфейса»
 * поверх Language Engine — изменение применяется мгновенно и сохраняется
 * персонально для текущего пользователя.
 */
const ProfileSettingsDialog = ({ open, onOpenChange }: ProfileSettingsDialogProps) => {
  const { t } = useTranslate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
              <Icon name="UserCog" size={16} className="text-primary" />
            </div>
            <DialogTitle className="font-display">{t('menu:settings')}</DialogTitle>
          </div>
          <DialogDescription>{t('common:profile.settingsDescription')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="profile-language" className="flex items-center gap-2">
              <Icon name="Globe" size={14} />
              {t('common:language.label')}
            </Label>
            <LanguageSelect />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;