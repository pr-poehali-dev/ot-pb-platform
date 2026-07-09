import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Проверка документов» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceDocumentVerification = () => (
  <PersonnelClearanceShell activeTab="document-verification">
    <PersonnelClearanceTabPlaceholder icon="FileSearch" titleKey="dict.personnelClearance:tabDocumentVerification" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceDocumentVerification;
