import { useState } from 'react';
import { useTranslate, aiCore, useAIHub } from '@/core';
import Icon from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AI_VENDORS, findVendorByModelId } from './aiVendors';
import NoventraAISettingsDialog from './NoventraAISettingsDialog';

type ConnectionStatus = 'idle' | 'checking' | 'connected' | 'failed';

/**
 * Кнопка «Noventra AI» верхней панели платформы + компактная панель управления.
 *
 * Полностью построена поверх существующей архитектуры AI Engine:
 *  - useAIHub()           — состояние моделей, активный провайдер, конфигурация, журнал
 *  - aiCore.providers      — включение/выключение платформы и моделей (AI Provider Manager)
 *  - aiCore.engine.send()  — фактическая проверка подключения (через выбранный провайдер)
 * Состояние (вкл/выкл, активный провайдер) сохраняется через существующие
 * механизмы (user-settings — активная модель, aiConfiguration — платформенный рубильник),
 * ничего нового не хранится в обход них.
 */
const NoventraAIButton = () => {
  const { t } = useTranslate();
  const { toast } = useToast();
  const hub = useAIHub();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [checkStatus, setCheckStatus] = useState<ConnectionStatus>('idle');

  const activeVendor = findVendorByModelId(hub.activeProviderId);
  const isPlatformEnabled = hub.configuration.enabled;

  const handleToggle = (enabled: boolean) => {
    aiCore.providers.setPlatformEnabled(enabled);
  };

  const handleVendorChange = (vendorId: string) => {
    const vendor = AI_VENDORS.find((v) => v.id === vendorId);
    const modelId = vendor?.modelIds[0];
    if (modelId) {
      aiCore.providers.setActiveModel(modelId);
      setCheckStatus('idle');
    }
  };

  const handleModelChange = (modelId: string) => {
    aiCore.providers.setActiveModel(modelId);
    setCheckStatus('idle');
  };

  const handleCheckConnection = async () => {
    setCheckStatus('checking');
    const providerLabel =
      hub.models.find((m) => m.id === hub.activeProviderId)?.label ?? hub.activeProviderId;
    try {
      await aiCore.engine.send({
        messages: [{ role: 'user', content: 'ping' }],
        modelId: hub.activeProviderId,
      });
      setCheckStatus('connected');
      toast({
        title: t('ai-engine:checkSuccessTitle'),
        description: t('ai-engine:checkSuccessDesc', { params: { provider: providerLabel } }),
      });
    } catch (error) {
      setCheckStatus('failed');
      toast({
        title: t('ai-engine:checkFailedTitle'),
        description: t('ai-engine:checkFailedDesc', {
          params: { provider: providerLabel, error: String(error instanceof Error ? error.message : error) },
        }),
      });
    }
  };

  const statusLabel = !isPlatformEnabled
    ? t('ai-engine:statusOff')
    : checkStatus === 'checking'
      ? t('ai-engine:statusChecking')
      : checkStatus === 'connected'
        ? t('ai-engine:statusConnected')
        : checkStatus === 'failed'
          ? t('ai-engine:statusNotConnected')
          : t('ai-engine:statusOn');

  const statusDotClass = !isPlatformEnabled
    ? 'bg-muted-foreground'
    : checkStatus === 'failed'
      ? 'bg-destructive'
      : checkStatus === 'connected'
        ? 'bg-primary'
        : 'bg-accent';

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border glass px-3.5 transition-colors hover:border-primary/40"
            title={t('ai-engine:panelButton')}
          >
            <Icon name="Sparkles" size={18} className={isPlatformEnabled ? 'text-primary' : 'text-muted-foreground'} />
            <span className="hidden text-sm font-medium sm:inline">{t('ai-engine:panelButton')}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 border-border glass p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
              <Icon name="Sparkles" size={16} className="text-primary" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold">{t('ai-engine:panelTitle')}</div>
              <div className="text-xs text-muted-foreground">{t('ai-engine:panelSubtitle')}</div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
              <div>
                <div className="text-sm font-medium">{t('ai-engine:toggleLabel')}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass}`} />
                  {statusLabel}
                </div>
              </div>
              <Switch checked={isPlatformEnabled} onCheckedChange={handleToggle} />
            </div>

            {/* Provider select */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-muted-foreground">{t('ai-engine:providerLabel')}</div>
              <Select
                value={activeVendor?.id}
                onValueChange={handleVendorChange}
                disabled={!isPlatformEnabled}
              >
                <SelectTrigger className="h-9 border-border bg-background/60">
                  <SelectValue placeholder={t('ai-engine:providerPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {AI_VENDORS.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {t(vendor.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model select */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-muted-foreground">{t('ai-engine:modelLabel')}</div>
              <Select
                value={hub.activeProviderId}
                onValueChange={handleModelChange}
                disabled={!isPlatformEnabled}
              >
                <SelectTrigger className="h-9 border-border bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hub.models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCheckConnection}
                disabled={!isPlatformEnabled || checkStatus === 'checking'}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name={checkStatus === 'checking' ? 'LoaderCircle' : 'PlugZap'} size={14} className={checkStatus === 'checking' ? 'animate-spin' : ''} />
                {t('ai-engine:checkConnection')}
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Icon name="Settings2" size={14} />
                {t('ai-engine:openSettings')}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <NoventraAISettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default NoventraAIButton;