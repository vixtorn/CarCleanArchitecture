import type { Car } from "../types/car";
import type { CarQueryParameters } from "../types/CarQueryParameters";
import type { CreateCarRequest } from "../types/createCar";

const API_BASE_URL = "https://localhost:7273/api/cars";

export async function getCars(
  query: CarQueryParameters = {},
): Promise<Car[]> {
  const parameters = new URLSearchParams();

  if (query.brand) {
    parameters.append("brand", query.brand);
  }

  if (query.model) {
    parameters.append("model", query.model);
  }

  if (query.color) {
    parameters.append("color", query.color);
  }

  if (query.minYear !== undefined) {
    parameters.append("minYear", query.minYear.toString());
  }

  if (query.maxYear !== undefined) {
    parameters.append("maxYear", query.maxYear.toString());
  }

  if (query.minHorsepower !== undefined) {
    parameters.append(
      "minHorsepower",
      query.minHorsepower.toString(),
    );
  }

  if (query.maxHorsepower !== undefined) {
    parameters.append(
      "maxHorsepower",
      query.maxHorsepower.toString(),
    );
  }

  if (query.sortBy) {
    parameters.append("sortBy", query.sortBy);
  }

  if (query.sortDirection) {
    parameters.append(
      "sortDirection",
      query.sortDirection,
    );
  }

  const queryString = parameters.toString();

  const requestUrl = queryString
    ? `${API_BASE_URL}?${queryString}`
    : API_BASE_URL;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(
      `Arabalar alınamadı. HTTP kodu: ${response.status}`,
    );
  }

  return response.json();
}

export async function createCar(
  car: CreateCarRequest,
): Promise<Car> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });

  if (!response.ok) {
    throw new Error(
      `Araba eklenemedi. HTTP kodu: ${response.status}`,
    );
  }

  return response.json();
}

export async function deleteCar(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/${id}`,
    {
      method: "DELETE",
    },
  );

  if (response.status === 404) {
    throw new Error(
      "Silmek istediğiniz araba bulunamadı.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `Araba silinemedi. HTTP kodu: ${response.status}`,
    );
  }
}