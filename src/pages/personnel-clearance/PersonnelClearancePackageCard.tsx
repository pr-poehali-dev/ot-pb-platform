import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/**
 * Маршрут карточки конкретного Пакета допуска (/personnel-clearance/clearance-packages/:id).
 * На этом этапе реализована только архитектура сущности Clearance Package
 * (см. src/core/clearance-package) — сам UI карточки (общая информация,
 * применённые матрицы, требования, независимые проверки ОТ/ПБ и Службы
 * безопасности, история, журнал решений) будет реализован отдельно.
 */
const PersonnelClearancePackageCard = () => (
  <PersonnelClearanceShell activeTab="clearance-packages">
    <PersonnelClearanceTabPlaceholder icon="PackageCheck" titleKey="dict.clearancePackage:registryTitle" />
  </PersonnelClearanceShell>
);

export default PersonnelClearancePackageCard;
