import { useStore } from '../shared/useStore';
import { matrixService } from './matrixService';
import { matrixCriteriaDimensionRegistry } from './matrixCriteriaDimensionRegistry';

/**
 * React-хук доступа к одной матрице требований (используется карточкой матрицы
 * и всеми её вкладками): реактивная сущность матрицы + действие обновления
 * + список зарегистрированных измерений критериев (для вкладок «Категории
 * работников», «Гражданство», «Профессии» и т.д.).
 */
export function useRequirementMatrix(matrixId: string | undefined) {
  const matricesMap = useStore(matrixService.store);
  useStore(matrixCriteriaDimensionRegistry.store);

  const matrix = matrixId ? matricesMap[matrixId] : undefined;

  return {
    matrix,
    dimensions: matrix ? matrixCriteriaDimensionRegistry.listByDomain(matrix.domain) : [],
    updateMatrix: matrixService.updateMatrix,
  };
}