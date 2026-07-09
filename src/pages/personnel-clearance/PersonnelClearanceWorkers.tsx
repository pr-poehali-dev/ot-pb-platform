import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Работники» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceWorkers = () => (
  <PersonnelClearanceShell activeTab="workers">
    <PersonnelClearanceTabPlaceholder icon="Users" titleKey="dict.personnelClearance:tabWorkers" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceWorkers;
