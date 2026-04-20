import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AuthResponse } from "./types";

export const AUTH_QUERY_KEY = ["auth"];
export const useAuth = () =>
  useQuery<AuthResponse | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: 
    });
