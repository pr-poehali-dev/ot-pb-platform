import { Navigate } from 'react-router-dom';
import { DEFAULT_PERSONNEL_CLEARANCE_TAB } from '@/data/personnelClearanceTabs';

/**
 * Главная страница модуля «Предварительный допуск персонала».
 * Перенаправляет на первую вкладку модуля (Работники) — единая точка входа
 * по маршруту /personnel-clearance.
 */
const PersonnelClearanceIndex = () => (
  <Navigate to={`/personnel-clearance/${DEFAULT_PERSONNEL_CLEARANCE_TAB}`} replace />
);

export default PersonnelClearanceIndex;
