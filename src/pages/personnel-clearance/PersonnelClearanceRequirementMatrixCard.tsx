import { useNavigate, useParams } from 'react-router-dom';
import PersonnelClearanceShell from '@/components/personnel-clearance/PersonnelClearanceShell';
import RequirementMatrixCard from '@/components/requirement-matrix/RequirementMatrixCard';

const CURRENT_USER = 'Администратор';

/** Карточка конкретной матрицы требований модуля «Предварительный допуск персонала». */
const PersonnelClearanceRequirementMatrixCard = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <PersonnelClearanceShell activeTab="requirement-matrices">
      <RequirementMatrixCard
        matrixId={id ?? ''}
        actor={CURRENT_USER}
        onBack={() => navigate('/personnel-clearance/requirement-matrices')}
      />
    </PersonnelClearanceShell>
  );
};

export default PersonnelClearanceRequirementMatrixCard;
