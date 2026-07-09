import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import PersonnelClearanceTabPlaceholder from '@/components/personnel-clearance/PersonnelClearanceTabPlaceholder';

/** Вкладка «Маршруты согласования» модуля «Предварительный допуск персонала» (временный каркас). */
const PersonnelClearanceApprovalRoutes = () => (
  <PersonnelClearanceShell activeTab="approval-routes">
    <PersonnelClearanceTabPlaceholder icon="Route" titleKey="dict.personnelClearance:tabApprovalRoutes" />
  </PersonnelClearanceShell>
);

export default PersonnelClearanceApprovalRoutes;
