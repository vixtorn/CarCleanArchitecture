export interface CarQueryParameters {
  brand?: string;
  model?: string;
  color?: string;
  minYear?: number;
  maxYear?: number;
  minHorsepower?: number;
  maxHorsepower?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}