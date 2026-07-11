import { useNavigate } from 'react-router-dom';
import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import RequirementMatrixRegistry from '@/components/requirement-matrix/RequirementMatrixRegistry';
import { RequirementMatrix } from '@/core/requirement-matrix';

const DOMAIN = 'personnel-clearance';
const CURRENT_USER = 'Администратор';

/** Вкладка «Матрицы требований» модуля «Предварительный допуск персонала». */
const PersonnelClearanceRequirementMatrices = () => {
  const navigate = useNavigate();

  const openMatrix = (matrix: RequirementMatrix) => {
    navigate(`/personnel-clearance/requirement-matrices/${matrix.id}`);
  };

  return (
    <PersonnelClearanceShell activeTab="requirement-matrices">
      <RequirementMatrixRegistry domain={DOMAIN} actor={CURRENT_USER} onOpenMatrix={openMatrix} />
    </PersonnelClearanceShell>
  );
};

export default PersonnelClearanceRequirementMatrices;
