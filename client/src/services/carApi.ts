import { supabase } from "../lib/supabaseClient";
import type { Car } from "../types/car";
import type { CarQueryParameters } from "../types/CarQueryParameters";
import type { CreateCarRequest } from "../types/CreateCar";
import type { UpdateCarRequest } from "../types/UpdateCar";

const configuredApiUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiUrl) {
  throw new Error(
    "VITE_API_BASE_URL environment variable is missing.",
  );
}

// Sondaki gereksiz "/" karakterlerini kaldırır.
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");

async function getRequiredAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(
      "Oturum bilgisi alınamadı. Lütfen tekrar giriş yapın.",
    );
  }

  if (!session?.access_token) {
    throw new Error(
      "Bu işlemi gerçekleştirmek için giriş yapmalısınız.",
    );
  }

  return session.access_token;
}

async function getSafeErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  if (response.status === 400) {
    return "Girilen araç bilgileri geçersiz. Lütfen formu kontrol edin.";
  }

  if (response.status === 401) {
    return "Bu işlem için giriş yapmalısınız.";
  }

  if (response.status === 403) {
    return "Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.";
  }

  if (response.status === 404) {
    return "İstenen araç bulunamadı.";
  }

  try {
    const responseBody: unknown = await response.json();

    if (
      typeof responseBody === "object" &&
      responseBody !== null &&
      "title" in responseBody &&
      typeof responseBody.title === "string"
    ) {
      return responseBody.title;
    }
  } catch {
    // API geçerli bir JSON hata gövdesi döndürmediyse
    // aşağıdaki güvenli mesaj kullanılır.
  }

  return `${fallbackMessage} HTTP kodu: ${response.status}`;
}

function validateCarId(id: string): string {
  const normalizedId = id.trim();

  if (!normalizedId) {
    throw new Error("Araç kimliği geçersiz.");
  }

  return encodeURIComponent(normalizedId);
}

export async function getCars(
  query: CarQueryParameters = {},
): Promise<Car[]> {
  const parameters = new URLSearchParams();

  if (query.brand?.trim()) {
    parameters.set("brand", query.brand.trim());
  }

  if (query.model?.trim()) {
    parameters.set("model", query.model.trim());
  }

  if (query.color?.trim()) {
    parameters.set("color", query.color.trim());
  }

  if (query.minYear !== undefined) {
    parameters.set(
      "minYear",
      query.minYear.toString(),
    );
  }

  if (query.maxYear !== undefined) {
    parameters.set(
      "maxYear",
      query.maxYear.toString(),
    );
  }

  if (query.minHorsepower !== undefined) {
    parameters.set(
      "minHorsepower",
      query.minHorsepower.toString(),
    );
  }

  if (query.maxHorsepower !== undefined) {
    parameters.set(
      "maxHorsepower",
      query.maxHorsepower.toString(),
    );
  }

  if (query.sortBy?.trim()) {
    parameters.set("sortBy", query.sortBy.trim());
  }

  if (query.sortDirection) {
    parameters.set(
      "sortDirection",
      query.sortDirection,
    );
  }

  const queryString = parameters.toString();

  const requestUrl = queryString
    ? `${API_BASE_URL}?${queryString}`
    : API_BASE_URL;

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      await getSafeErrorMessage(
        response,
        "Araç listesi yüklenemedi.",
      ),
    );
  }

  return (await response.json()) as Car[];
}

export async function getCarById(
  id: string,
): Promise<Car> {
  const encodedId = validateCarId(id);

  const response = await fetch(
    `${API_BASE_URL}/${encodedId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getSafeErrorMessage(
        response,
        "Araç bilgileri yüklenemedi.",
      ),
    );
  }

  return (await response.json()) as Car;
}

export async function createCar(
  car: CreateCarRequest,
): Promise<Car> {
  const accessToken = await getRequiredAccessToken();

  const requestBody: CreateCarRequest = {
    brand: car.brand.trim(),
    model: car.model.trim(),
    color: car.color.trim(),
    year: car.year,
    horsepower: car.horsepower,
    doorCount: car.doorCount,
  };

  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(
      await getSafeErrorMessage(
        response,
        "Araç eklenemedi.",
      ),
    );
  }

  return (await response.json()) as Car;
}

export async function updateCar(
  id: string,
  car: UpdateCarRequest,
): Promise<Car> {
  const encodedId = validateCarId(id);
  const accessToken = await getRequiredAccessToken();

  const requestBody: UpdateCarRequest = {
    brand: car.brand.trim(),
    model: car.model.trim(),
    color: car.color.trim(),
    year: car.year,
    horsepower: car.horsepower,
    doorCount: car.doorCount,
  };

  const response = await fetch(
    `${API_BASE_URL}/${encodedId}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getSafeErrorMessage(
        response,
        "Araç güncellenemedi.",
      ),
    );
  }

  return (await response.json()) as Car;
}

export async function deleteCar(
  id: string,
): Promise<void> {
  const encodedId = validateCarId(id);
  const accessToken = await getRequiredAccessToken();

  const response = await fetch(
    `${API_BASE_URL}/${encodedId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getSafeErrorMessage(
        response,
        "Araç silinemedi.",
      ),
    );
  }
}