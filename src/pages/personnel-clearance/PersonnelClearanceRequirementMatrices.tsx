import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Матрицы требований» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceRequirementMatrices = () => (
  <PersonnelClearanceShell activeTab="requirement-matrices">
    <PersonnelClearanceTabPlaceholder icon="Grid3x3" titleKey="dict.personnelClearance:tabRequirementMatrices" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceRequirementMatrices;
