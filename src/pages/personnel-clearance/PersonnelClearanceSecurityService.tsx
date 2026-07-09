import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Служба безопасности» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceSecurityService = () => (
  <PersonnelClearanceShell activeTab="security-service">
    <PersonnelClearanceTabPlaceholder icon="ShieldCheck" titleKey="dict.personnelClearance:tabSecurityService" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceSecurityService;
