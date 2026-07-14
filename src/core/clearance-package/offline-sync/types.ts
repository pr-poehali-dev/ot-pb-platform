import { ISODateString } from '../../types';

/**
 * Offline Sync — архитектура формирования Пакета допуска без подключения к
 * интернету (п.3 доработки): локально накопленные изменения ставятся в
 * очередь синхронизации и применяются к серверному состоянию пакета после
 * восстановления связи, с контролем конфликтов (если серверная версия
 * пакета изменилась параллельно, пока клиент был офлайн).
 *
 * Эта подсистема не хранит собственную копию ClearancePackage — только
 * очередь изменений (patch-подобные записи) и обнаруженные конфликты;
 * применение изменений к clearancePackageService — задача синхронизации,
 * которая на этом этапе не реализуется (только структура).
 */

export type SyncStatus = 'pending' | 'synced' | 'conflict' | 'failed';

/**
 * Одно локально накопленное офлайн-изменение пакета, ожидающее отправки на
 * сервер. baseVersion — версия ClearancePackage.version, на основе которой
 * клиент вносил изменение локально (нужна для обнаружения конфликта: если
 * серверная версия пакета на момент синхронизации больше baseVersion,
 * значит пакет менялся кем-то ещё, пока клиент был офлайн).
 */
export interface OfflineChangeEntry {
  id: string;
  packageId: string;
  /** Версия пакета (ClearancePackage.version), от которой отталкивалось офлайн-изменение. */
  baseVersion: number;
  /** Условное описание изменения — конкретная бизнес-логика применения не реализуется. */
  changeDescription: string;
  /** Произвольные данные изменения (черновой patch) — структура зависит от будущей реализации синхронизации. */
  payload: Record<string, unknown>;
  createdBy: string;
  createdAt: ISODateString;
  status: SyncStatus;
}

/**
 * Обнаруженный конфликт при попытке синхронизации офлайн-изменения:
 * серверная версия пакета оказалась новее, чем baseVersion изменения.
 * resolution — как конфликт был разрешён (заполняется после разрешения;
 * сам механизм разрешения — будущая бизнес-логика).
 */
export interface SyncConflict {
  id: string;
  changeId: string;
  packageId: string;
  /** Версия пакета на сервере на момент попытки синхронизации. */
  serverVersion: number;
  detectedAt: ISODateString;
  resolution?: ConflictResolution;
  resolvedAt?: ISODateString;
  resolvedBy?: string;
}

/** Способ разрешения конфликта. Открытый строковый тип — не ограничивает будущую бизнес-логику. */
export type ConflictResolution = 'keep_local' | 'keep_server' | 'merged' | string;

export interface QueueOfflineChangeInput {
  packageId: string;
  baseVersion: number;
  changeDescription: string;
  payload: Record<string, unknown>;
  createdBy: string;
}
