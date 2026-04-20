// ✅ localStorage eliminado completamente
// El usuario se lee del contexto del router (hidratado desde cookie HttpOnly en el servidor)
// Este archivo puede usarse para helpers relacionados con auth del lado del cliente

import type { User } from "#/features/users/types";

// Utilidad para verificar si un usuario tiene cierto rol
export function hasRole(user: User | null, ...roles: User["role"][]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

// Utilidad para verificar si es admin o owner
export function isAdminOrOwner(user: User | null): boolean {
  return hasRole(user, "ADMIN", "OWNER");
}
