import { createStore } from '../shared/createStore';
import { eventBus } from '../event-bus';
import { AppNotification, CreateNotificationInput } from './types';

/**
 * Сервис уведомлений — независимый от бизнес-логики.
 * Хранит список уведомлений в памяти и публикует события в Event Bus,
 * чтобы любой модуль мог отреагировать (например, показать toast).
 */
let counter = 0;
const nextId = () => `ntf-${++counter}`;

const store = createStore<AppNotification[]>([]);

function push(input: CreateNotificationInput): AppNotification {
  const notification: AppNotification = {
    id: nextId(),
    title: input.title,
    message: input.message,
    level: input.level ?? 'info',
    read: false,
    createdAt: new Date().toISOString(),
    relatedTo: input.relatedTo,
  };
  store.setState((prev) => [notification, ...prev]);
  eventBus.emit('notification.created', notification, 'notification-service');
  return notification;
}

function markAsRead(id: string): void {
  store.setState((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
}

function markAllAsRead(): void {
  store.setState((prev) => prev.map((n) => ({ ...n, read: true })));
}

function remove(id: string): void {
  store.setState((prev) => prev.filter((n) => n.id !== id));
}

function clear(): void {
  store.setState([]);
}

function list(): AppNotification[] {
  return store.getState();
}

function unreadCount(): number {
  return store.getState().filter((n) => !n.read).length;
}

export const notificationService = {
  store,
  push,
  markAsRead,
  markAllAsRead,
  remove,
  clear,
  list,
  unreadCount,
};
