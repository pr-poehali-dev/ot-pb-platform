/**
 * Offline Sync — подсистема Clearance Package Engine: формирование пакета
 * без подключения к интернету, очередь синхронизации и контроль конфликтов
 * после восстановления связи.
 *
 * Состав:
 *  - types.ts               — OfflineChangeEntry/SyncStatus/SyncConflict/ConflictResolution
 *  - offlineSyncService.ts  — queueChange() (постановка офлайн-изменения),
 *                             attemptSync() (сравнение версий и обнаружение
 *                             конфликта), resolveConflict()
 *
 * Только структура очереди и конфликтов — реальное объединение изменений
 * (merge), автоматическое разрешение конфликтов и клиентское офлайн-
 * хранилище (IndexedDB/Service Worker) являются будущей реализацией.
 */
export * from './types';
export { offlineSyncService } from './offlineSyncService';
