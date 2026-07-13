import { useState, type FormEvent } from "react";
import carPlaceholder from "../assets/car-placeholder.png";
import type { Car } from "../types/car";
import type { CreateCarRequest } from "../types/CreateCar";
import Icon from "./Icon";

type VehicleRequest = CreateCarRequest;

const emptyForm: VehicleRequest = { brand: "", model: "", color: "", year: 2020, horsepower: 100, doorCount: 4 };

interface CreateCarFormProps {
  car?: Car;
  isSubmitting: boolean;
  onSubmit: (request: VehicleRequest) => Promise<void>;
}

export default function CreateCarForm({ car, isSubmitting, onSubmit }: CreateCarFormProps) {
  const [form, setForm] = useState<VehicleRequest>(() => car ? { brand: car.brand, model: car.model, color: car.color, year: car.year, horsepower: car.horsepower, doorCount: car.doorCount } : emptyForm);
  const isEditing = Boolean(car);

  function update<K extends keyof VehicleRequest>(key: K, value: VehicleRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const request: VehicleRequest = {
      brand: form.brand.trim(), model: form.model.trim(), color: form.color.trim(),
      year: form.year, horsepower: form.horsepower, doorCount: form.doorCount,
    };
    await onSubmit(request);
  }

  return (
    <form id="vehicle-form" className="vehicle-form" onSubmit={(event) => void handleSubmit(event)}>
      <div className="form-preview">
        <img src={carPlaceholder} alt={`${form.brand || "New"} ${form.model || "car"} vehicle placeholder`} />
        <div><strong>{form.brand.trim() || "Your new vehicle"} {form.model.trim()}</strong><span>Inventory image preview</span></div>
      </div>
      <fieldset className="form-section"><legend><Icon name="car" size={18} /> Vehicle Identity</legend>
        <label className="field"><span>Brand</span><input value={form.brand} onChange={(event) => update("brand", event.target.value)} placeholder="e.g. BMW" required maxLength={100} disabled={isSubmitting} /></label>
        <label className="field"><span>Model</span><input value={form.model} onChange={(event) => update("model", event.target.value)} placeholder="e.g. M4 Competition" required maxLength={100} disabled={isSubmitting} /></label>
        <label className="field"><span>Year</span><input type="number" value={form.year} onChange={(event) => update("year", event.target.valueAsNumber)} min="1886" max="2026" required disabled={isSubmitting} /></label>
      </fieldset>
      <fieldset className="form-section"><legend><Icon name="gauge" size={18} /> Specifications</legend>
        <div className="form-two-columns">
          <label className="field"><span>Exterior Color</span><input value={form.color} onChange={(event) => update("color", event.target.value)} placeholder="e.g. Midnight Black" required maxLength={50} disabled={isSubmitting} /></label>
          <label className="field"><span>Door Count</span><select value={form.doorCount} onChange={(event) => update("doorCount", Number(event.target.value))} required disabled={isSubmitting}>{[2,3,4,5].map((count) => <option value={count} key={count}>{count} doors</option>)}</select></label>
        </div>
        <label className="field"><span>Horsepower (HP)</span><input type="number" value={form.horsepower} onChange={(event) => update("horsepower", event.target.valueAsNumber)} min="1" max="3600" required disabled={isSubmitting} /></label>
      </fieldset>
      <div className="form-note"><Icon name="info" /><p>{isEditing ? "Saving will update this vehicle in the live inventory." : "Adding this car will immediately update the live inventory."}</p></div>
    </form>
  );
}
