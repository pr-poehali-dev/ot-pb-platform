export interface CoreEvent<TPayload = unknown> {
  /** Тип события в формате "домен.действие", например "entity.created" */
  type: string;
  payload: TPayload;
  /** Источник события — модуль или сервис, который его инициировал */
  source?: string;
  timestamp: string;
}

export type EventHandler<TPayload = unknown> = (event: CoreEvent<TPayload>) => void;
export type Unsubscribe = () => void;
