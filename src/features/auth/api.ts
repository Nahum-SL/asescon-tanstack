import { apiClient } from "#/lib/api-client";
import { API_URL } from "#/lib/api-url";
import type { User } from "../users/types";
import type { LoginActionResult } from "../users/types";

export const login = async (): Promise<LoginActionResult> => {
  try {
    const res = 
    apiClient<{}>(`${API_URL}/api/auth/login`)  
      
  } catch (err) {

  }
}

export const getMe = async () => {
  return apiClient<User>("/api/auth/me");
};