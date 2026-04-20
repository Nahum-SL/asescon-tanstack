import type { User } from "#/features/users/types";

export function getUserFromStorage(): User | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  return JSON.parse(raw);
}
