import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  deleteCar,
  getCars,
} from "../services/carApi";

import type { Car } from "../types/car";
import type { CarQueryParameters } from "../types/CarQueryParameters";

interface FilterForm {
  brand: string;
  model: string;
  color: string;
  minYear: string;
  maxYear: string;
  minHorsepower: string;
  maxHorsepower: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
}

const initialFilters: FilterForm = {
  brand: "",
  model: "",
  color: "",
  minYear: "",
  maxYear: "",
  minHorsepower: "",
  maxHorsepower: "",
  sortBy: "brand",
  sortDirection: "asc",
};

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);

  const [filters, setFilters] =
    useState<FilterForm>(initialFilters);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [deletingCarId, setDeletingCarId] =
    useState<string | null>(null);

  async function loadCars(
    query: CarQueryParameters = {},
  ) {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getCars(query);

      setCars(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Beklenmeyen bir hata oluştu.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCars();
  }, []);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const query: CarQueryParameters = {
      brand:
        filters.brand.trim() || undefined,

      model:
        filters.model.trim() || undefined,

      color:
        filters.color.trim() || undefined,

      minYear:
        filters.minYear === ""
          ? undefined
          : Number(filters.minYear),

      maxYear:
        filters.maxYear === ""
          ? undefined
          : Number(filters.maxYear),

      minHorsepower:
        filters.minHorsepower === ""
          ? undefined
          : Number(filters.minHorsepower),

      maxHorsepower:
        filters.maxHorsepower === ""
          ? undefined
          : Number(filters.maxHorsepower),

      sortBy:
        filters.sortBy || undefined,

      sortDirection:
        filters.sortDirection,
    };

    void loadCars(query);
  }

  function handleReset() {
    setFilters(initialFilters);
    void loadCars();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Bu arabayı silmek istediğinize emin misiniz?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCarId(id);
      setError(null);

      await deleteCar(id);

      setCars((currentCars) =>
        currentCars.filter(
          (car) => car.id !== id,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Araba silinirken beklenmeyen bir hata oluştu.";

      setError(message);
    } finally {
      setDeletingCarId(null);
    }
  }

  return (
    <div>
      <h1>Car Inventory</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="brand">
            Brand
          </label>

          <input
            id="brand"
            type="text"
            placeholder="BMW"
            value={filters.brand}
            onChange={(event) =>
              setFilters({
                ...filters,
                brand: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="model">
            Model
          </label>

          <input
            id="model"
            type="text"
            placeholder="M4"
            value={filters.model}
            onChange={(event) =>
              setFilters({
                ...filters,
                model: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="color">
            Color
          </label>

          <input
            id="color"
            type="text"
            placeholder="Black"
            value={filters.color}
            onChange={(event) =>
              setFilters({
                ...filters,
                color: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="minYear">
            Minimum Year
          </label>

          <input
            id="minYear"
            type="number"
            placeholder="2020"
            value={filters.minYear}
            onChange={(event) =>
              setFilters({
                ...filters,
                minYear: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="maxYear">
            Maximum Year
          </label>

          <input
            id="maxYear"
            type="number"
            placeholder="2025"
            value={filters.maxYear}
            onChange={(event) =>
              setFilters({
                ...filters,
                maxYear: event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="minHorsepower">
            Minimum Horsepower
          </label>

          <input
            id="minHorsepower"
            type="number"
            placeholder="200"
            value={filters.minHorsepower}
            onChange={(event) =>
              setFilters({
                ...filters,
                minHorsepower:
                  event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="maxHorsepower">
            Maximum Horsepower
          </label>

          <input
            id="maxHorsepower"
            type="number"
            placeholder="700"
            value={filters.maxHorsepower}
            onChange={(event) =>
              setFilters({
                ...filters,
                maxHorsepower:
                  event.target.value,
              })
            }
          />
        </div>

        <div>
          <label htmlFor="sortBy">
            Sort By
          </label>

          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(event) =>
              setFilters({
                ...filters,
                sortBy: event.target.value,
              })
            }
          >
            <option value="brand">
              Brand
            </option>

            <option value="model">
              Model
            </option>

            <option value="color">
              Color
            </option>

            <option value="year">
              Year
            </option>

            <option value="horsepower">
              Horsepower
            </option>

            <option value="doorcount">
              Door Count
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="sortDirection">
            Sort Direction
          </label>

          <select
            id="sortDirection"
            value={filters.sortDirection}
            onChange={(event) =>
              setFilters({
                ...filters,
                sortDirection: event.target
                  .value as "asc" | "desc",
              })
            }
          >
            <option value="asc">
              Ascending
            </option>

            <option value="desc">
              Descending
            </option>
          </select>
        </div>

        <div>
          <button type="submit">
            Apply Filters
          </button>

          <button
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {isLoading && (
        <p>Arabalar yükleniyor...</p>
      )}

      {error && (
        <p>Hata: {error}</p>
      )}

      {!isLoading &&
        !error &&
        cars.length === 0 && (
          <p>
            Filtrelere uygun araba bulunamadı.
          </p>
        )}

      {!isLoading &&
        !error &&
        cars.length > 0 && (
          <>
            <p>
              {cars.length} araba bulundu.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Color</th>
                  <th>Year</th>
                  <th>Horsepower</th>
                  <th>Doors</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.brand}</td>

                    <td>{car.model}</td>

                    <td>{car.color}</td>

                    <td>{car.year}</td>

                    <td>
                      {car.horsepower} HP
                    </td>

                    <td>
                      {car.doorCount}
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            car.id,
                          )
                        }
                        disabled={
                          deletingCarId ===
                          car.id
                        }
                      >
                        {deletingCarId ===
                        car.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
    </div>
  );
}