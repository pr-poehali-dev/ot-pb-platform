import { useStore } from '../shared/useStore';
import { notificationService } from './notificationService';

/**
 * React-хук доступа к сервису уведомлений.
 * Компоненты (колокольчик в шапке, центр уведомлений) используют только этот хук.
 */
export function useNotifications() {
  const notifications = useStore(notificationService.store);
  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    push: notificationService.push,
    markAsRead: notificationService.markAsRead,
    markAllAsRead: notificationService.markAllAsRead,
    remove: notificationService.remove,
    clear: notificationService.clear,
  };
}
