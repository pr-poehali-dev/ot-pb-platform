export type FilterValue = string | number | boolean | string[] | null;

export interface FilterState {
  [filterKey: string]: FilterValue;
}
