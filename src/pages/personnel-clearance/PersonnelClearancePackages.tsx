import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Пакеты допуска» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearancePackages = () => (
  <PersonnelClearanceShell activeTab="clearance-packages">
    <PersonnelClearanceTabPlaceholder icon="PackageCheck" titleKey="dict.personnelClearance:tabClearancePackages" />
  </PersonnelClearanceShell>
);

export default PersonnelClearancePackages;
