export type NotificationLevel = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  message?: string;
  level: NotificationLevel;
  read: boolean;
  createdAt: string;
  /** Ссылка на связанную сущность (опционально), не зависит от конкретного модуля */
  relatedTo?: { type: string; id: string };
}

export interface CreateNotificationInput {
  title: string;
  message?: string;
  level?: NotificationLevel;
  relatedTo?: { type: string; id: string };
}
