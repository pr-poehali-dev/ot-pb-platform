import { useEffect } from 'react';
import { eventBus } from './eventBus';
import { EventHandler } from './types';

/**
 * React-хук для подписки компонента на события шины.
 * Автоматически отписывается при размонтировании.
 */
export function useEventBus<TPayload = unknown>(type: string, handler: EventHandler<TPayload>): void {
  useEffect(() => {
    const unsubscribe = eventBus.on<TPayload>(type, handler);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
}
