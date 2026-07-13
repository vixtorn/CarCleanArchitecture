import type { Car } from "../types/car";
import type { CarQueryParameters } from "../types/CarQueryParameters";
import type { CreateCarRequest } from "../types/CreateCar";
import type { UpdateCarRequest } from "../types/UpdateCar";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const backendBaseUrl = (configuredBaseUrl || "https://localhost:7273").replace(/\/$/, "");
const API_BASE_URL = `${backendBaseUrl}/api/cars`;

async function ensureSuccessful(response: Response, fallbackMessage: string) {
  if (response.ok) return;

  if (response.status === 404) {
    throw new Error("The requested car could not be found.");
  }

  if (response.status === 400) {
    throw new Error("Some vehicle details are invalid. Please review the form and try again.");
  }

  throw new Error(fallbackMessage);
}

export async function getCars(query: CarQueryParameters = {}): Promise<Car[]> {
  const parameters = new URLSearchParams();

  if (query.brand) parameters.set("brand", query.brand);
  if (query.model) parameters.set("model", query.model);
  if (query.color) parameters.set("color", query.color);
  if (query.minYear !== undefined) parameters.set("minYear", String(query.minYear));
  if (query.maxYear !== undefined) parameters.set("maxYear", String(query.maxYear));
  if (query.minHorsepower !== undefined) parameters.set("minHorsepower", String(query.minHorsepower));
  if (query.maxHorsepower !== undefined) parameters.set("maxHorsepower", String(query.maxHorsepower));
  if (query.sortBy) parameters.set("sortBy", query.sortBy);
  if (query.sortDirection) parameters.set("sortDirection", query.sortDirection);

  const queryString = parameters.toString();
  const response = await fetch(queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL);
  await ensureSuccessful(response, "We couldn't load the inventory. Please try again.");
  return response.json() as Promise<Car[]>;
}

export async function getCarById(id: string): Promise<Car> {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`);
  await ensureSuccessful(response, "We couldn't load this vehicle. Please try again.");
  return response.json() as Promise<Car>;
}

export async function createCar(car: CreateCarRequest): Promise<Car> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  await ensureSuccessful(response, "The car couldn't be added. Please try again.");
  return response.json() as Promise<Car>;
}

export async function updateCar(id: string, car: UpdateCarRequest): Promise<Car> {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });
  await ensureSuccessful(response, "The car couldn't be updated. Please try again.");
  return response.json() as Promise<Car>;
}

export async function deleteCar(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
  await ensureSuccessful(response, "The car couldn't be deleted. Please try again.");
}
