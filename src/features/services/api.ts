import { API_URL } from "#/lib/api-url";
import type { Service } from "./types";
import { apiClient } from "#/lib/api-client";

// GET
export const getServices = async (): Promise<Service[]> => {
  return apiClient<Service[]>(`${API_URL}/api/servicio`)
};

// POST
export const createService = async (data: Partial<Service>): Promise<Service> => {
  return apiClient<Service>(`${API_URL}/api/servicio`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

// PATCH
export const updateService = async (id: number, data: Partial<Service>): Promise<Service> => {
  return apiClient<Service>(`${API_URL}/api/servicio/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

// DELETE
export const deleteService = async (id: number): Promise<void> => {
  return apiClient<void>(`${API_URL}/api/servicio/${id}`, {
    method: "DELETE",
  })
}