import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Настройки» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceSettings = () => (
  <PersonnelClearanceShell activeTab="settings">
    <PersonnelClearanceTabPlaceholder icon="Settings2" titleKey="dict.personnelClearance:tabSettings" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceSettings;
