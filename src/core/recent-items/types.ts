import { EntityRef } from '../types';

export interface RecentEntry extends EntityRef {
  openedAt: string;
  /** Заголовок для отображения без повторного похода за данными */
  label?: string;
}
