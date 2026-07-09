import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «История» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceHistory = () => (
  <PersonnelClearanceShell activeTab="history">
    <PersonnelClearanceTabPlaceholder icon="History" titleKey="dict.personnelClearance:tabHistory" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceHistory;
