import { EntityRef } from '../types';

export interface SearchDocument {
  entity: EntityRef;
  title: string;
  subtitle?: string;
  keywords?: string[];
}

export interface SearchResult extends SearchDocument {
  score: number;
}
