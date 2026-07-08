import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useTranslate, aiCore, useAIHub } from '@/core';

interface NoventraAISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Расширенные настройки Noventra AI: список всех зарегистрированных
 * провайдеров (providerRegistry через useAIHub) с индивидуальным
 * включением/выключением (aiCore.providers.setModelEnabled — AI Provider
 * Manager) и журнал действий AI Engine (AI Action Log через useAIHub.actions).
 */
const NoventraAISettingsDialog = ({ open, onOpenChange }: NoventraAISettingsDialogProps) => {
  const { t } = useTranslate();
  const hub = useAIHub();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
              <Icon name="Sparkles" size={16} className="text-primary" />
            </div>
            <DialogTitle className="font-display">{t('ai-engine:settingsTitle')}</DialogTitle>
          </div>
          <DialogDescription>{t('ai-engine:settingsDescription')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Available providers */}
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('ai-engine:availableProviders')}
            </div>
            <div className="space-y-2">
              {hub.models.map((model) => (
                <div
                  key={model.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{model.label}</div>
                    {model.descriptionKey && (
                      <div className="truncate text-xs text-muted-foreground">{t(model.descriptionKey)}</div>
                    )}
                  </div>
                  <Switch
                    checked={model.enabled}
                    onCheckedChange={(checked) => aiCore.providers.setModelEnabled(model.id, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Action Log */}
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('ai-engine:actionLogTitle')}
            </div>
            {hub.actions.length > 0 ? (
              <div className="max-h-48 space-y-1.5 overflow-y-auto pr-1">
                {hub.actions.slice(0, 20).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs"
                  >
                    <span className="truncate text-foreground/90">{entry.description}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                {t('ai-engine:actionLogEmpty')}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoventraAISettingsDialog;
