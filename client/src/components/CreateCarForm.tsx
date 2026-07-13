import { useState, type FormEvent } from "react";
import { createCar } from "../services/carApi";
import type { CreateCarRequest } from "../types/CreateCar";

export default function CreateCarForm() {
  const [form, setForm] = useState<CreateCarRequest>({
    brand: "",
    model: "",
    color: "",
    year: 2020,
    horsepower: 100,
    doorCount: 4,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage(null);

      await createCar(form);

      setMessage("Araba başarıyla eklendi.");

      setForm({
        brand: "",
        model: "",
        color: "",
        year: 2020,
        horsepower: 100,
        doorCount: 4,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Araba eklenirken bir hata oluştu.";

      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Add New Car</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="create-brand">Brand</label>
          <input
            id="create-brand"
            type="text"
            value={form.brand}
            required
            onChange={(event) =>
              setForm({
                ...form,
                brand: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="create-model">Model</label>
          <input
            id="create-model"
            type="text"
            value={form.model}
            required
            onChange={(event) =>
              setForm({
                ...form,
                model: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="create-color">Color</label>
          <input
            id="create-color"
            type="text"
            value={form.color}
            required
            onChange={(event) =>
              setForm({
                ...form,
                color: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="create-year">Year</label>
          <input
            id="create-year"
            type="number"
            value={form.year}
            required
            onChange={(event) =>
              setForm({
                ...form,
                year: Number(event.target.value),
              })
            }
          />
        </div>

        <div>
          <label htmlFor="create-horsepower">Horsepower</label>
          <input
            id="create-horsepower"
            type="number"
            value={form.horsepower}
            required
            onChange={(event) =>
              setForm({
                ...form,
                horsepower: Number(event.target.value),
              })
            }
          />
        </div>

        <div>
          <label htmlFor="create-door-count">Door Count</label>
          <input
            id="create-door-count"
            type="number"
            value={form.doorCount}
            required
            onChange={(event) =>
              setForm({
                ...form,
                doorCount: Number(event.target.value),
              })
            }
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Car"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  );
}