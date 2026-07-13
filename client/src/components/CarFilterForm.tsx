import { useState, type FormEvent } from "react";
import type { CarQueryParameters } from "../types/CarQueryParameters";
import Icon from "./Icon";

interface FilterValues {
  brand: string; model: string; color: string; minYear: string; maxYear: string;
  minHorsepower: string; maxHorsepower: string; sortBy: string; sortDirection: "asc" | "desc";
}

const initialFilters: FilterValues = {
  brand: "", model: "", color: "", minYear: "", maxYear: "",
  minHorsepower: "", maxHorsepower: "", sortBy: "brand", sortDirection: "asc",
};

interface CarFilterFormProps {
  isLoading: boolean;
  onApply: (query: CarQueryParameters) => void;
  onReset: () => void;
}

export default function CarFilterForm({ isLoading, onApply, onReset }: CarFilterFormProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [isExpanded, setIsExpanded] = useState(true);

  function update<K extends keyof FilterValues>(key: K, value: FilterValues[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply({
      brand: filters.brand.trim() || undefined,
      model: filters.model.trim() || undefined,
      color: filters.color.trim() || undefined,
      minYear: filters.minYear ? Number(filters.minYear) : undefined,
      maxYear: filters.maxYear ? Number(filters.maxYear) : undefined,
      minHorsepower: filters.minHorsepower ? Number(filters.minHorsepower) : undefined,
      maxHorsepower: filters.maxHorsepower ? Number(filters.maxHorsepower) : undefined,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
    });
  }

  function handleReset() {
    setFilters(initialFilters);
    onReset();
  }

  return (
    <section className="panel filter-panel">
      <button className="filter-heading" type="button" onClick={() => setIsExpanded((value) => !value)} aria-expanded={isExpanded} aria-controls="inventory-filters">
        <span><Icon name="filter" /> Filters</span><span className="filter-toggle">{isExpanded ? "Hide" : "Show"}</span>
      </button>
      {isExpanded && (
        <form id="inventory-filters" onSubmit={handleSubmit}>
          <div className="filter-grid">
            <label className="field"><span>Brand</span><span className="input-with-icon"><Icon name="search" size={16} /><input value={filters.brand} onChange={(event) => update("brand", event.target.value)} placeholder="Search brand..." maxLength={100} /></span></label>
            <label className="field"><span>Model</span><span className="input-with-icon"><Icon name="search" size={16} /><input value={filters.model} onChange={(event) => update("model", event.target.value)} placeholder="Search model..." maxLength={100} /></span></label>
            <label className="field"><span>Color</span><input value={filters.color} onChange={(event) => update("color", event.target.value)} placeholder="Any color" maxLength={100} /></label>
            <fieldset className="range-field"><legend>Year Range</legend><div><input aria-label="Minimum year" type="number" min="1886" max="2026" value={filters.minYear} onChange={(event) => update("minYear", event.target.value)} placeholder="Min" /><span>–</span><input aria-label="Maximum year" type="number" min="1886" max="2026" value={filters.maxYear} onChange={(event) => update("maxYear", event.target.value)} placeholder="Max" /></div></fieldset>
            <fieldset className="range-field"><legend>Horsepower Range</legend><div><input aria-label="Minimum horsepower" type="number" min="1" max="3600" value={filters.minHorsepower} onChange={(event) => update("minHorsepower", event.target.value)} placeholder="Min" /><span>–</span><input aria-label="Maximum horsepower" type="number" min="1" max="3600" value={filters.maxHorsepower} onChange={(event) => update("maxHorsepower", event.target.value)} placeholder="Max" /></div></fieldset>
            <div className="sort-fields">
              <label className="field"><span>Sort By</span><select value={filters.sortBy} onChange={(event) => update("sortBy", event.target.value)}><option value="brand">Brand</option><option value="model">Model</option><option value="color">Color</option><option value="year">Year</option><option value="horsepower">Horsepower</option><option value="doorcount">Door Count</option></select></label>
              <label className="field"><span>Direction</span><select value={filters.sortDirection} onChange={(event) => update("sortDirection", event.target.value === "desc" ? "desc" : "asc")}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
            </div>
          </div>
          <div className="filter-actions"><button className="button button-ghost" type="button" onClick={handleReset} disabled={isLoading}>Reset</button><button className="button button-secondary" type="submit" disabled={isLoading}>{isLoading ? "Applying..." : "Apply Filters"}</button></div>
        </form>
      )}
    </section>
  );
}
