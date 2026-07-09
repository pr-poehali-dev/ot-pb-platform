/**
 * Domain Configs — регистрация доменов применения Requirement Matrix Engine.
 * Каждый файл этой папки подключает один модуль платформы (по образцу
 * src/core/business-rules/domain-rules/): personnel-clearance сейчас,
 * будущие equipment-clearance/contractor-clearance/document-verification/
 * work-permit — по тому же образцу, без изменения архитектуры движка.
 */
import { registerPersonnelClearanceMatrixDomain } from './personnel-clearance';

let registered = false;

export function registerAllMatrixDomains(): void {
  if (registered) return;
  registered = true;

  registerPersonnelClearanceMatrixDomain();
}

export { registerPersonnelClearanceMatrixDomain };
