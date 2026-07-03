import { CoreEvent, EventHandler, Unsubscribe } from './types';

/**
 * Event Bus — центральная шина событий платформы Noventra Core.
 * Полностью независимый сервис: не знает ничего о бизнес-сущностях.
 * Любой будущий модуль может публиковать и слушать события по строковому типу.
 *
 * Пример использования (без бизнес-логики):
 *   eventBus.emit('entity.created', { id: '123' }, 'dictionary-module');
 *   const unsubscribe = eventBus.on('entity.created', (e) => console.log(e));
 */
class EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on<TPayload = unknown>(type: string, handler: EventHandler<TPayload>): Unsubscribe {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);
    return () => this.handlers.get(type)?.delete(handler as EventHandler);
  }

  /** Подписка на все события шины независимо от типа */
  onAny(handler: EventHandler): Unsubscribe {
    return this.on('*', handler);
  }

  emit<TPayload = unknown>(type: string, payload: TPayload, source?: string): void {
    const event: CoreEvent<TPayload> = {
      type,
      payload,
      source,
      timestamp: new Date().toISOString(),
    };
    this.handlers.get(type)?.forEach((handler) => handler(event));
    this.handlers.get('*')?.forEach((handler) => handler(event));
  }

  off(type: string, handler: EventHandler): void {
    this.handlers.get(type)?.delete(handler);
  }
}

export const eventBus = new EventBus();
