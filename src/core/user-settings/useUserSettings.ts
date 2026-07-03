import { useStore } from '../shared/useStore';
import { userSettingsService } from './userSettingsService';

export function useUserSettings() {
  const settings = useStore(userSettingsService.store);
  return {
    settings,
    update: userSettingsService.update,
    setCustom: userSettingsService.setCustom,
    getCustom: userSettingsService.getCustom,
    reset: userSettingsService.reset,
  };
}
