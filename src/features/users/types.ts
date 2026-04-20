// Cambios clave:
// ✅ Eliminado "password" del tipo User — jamás debe llegar al cliente
// ✅ CLIENTE añadido al enum (faltaba vs tu backend)
// ✅ "as const" en userRole para inferencia de tipos correcta

export const userRole = {
  ADMIN: "ADMIN",
  COLABORADOR: "COLABORADOR",
  OWNER: "OWNER",
  CLIENTE: "CLIENTE",
} as const;

export type Role = (typeof userRole)[keyof typeof userRole];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
}

export type LoginActionResult =
  | { success: true; user: User; error?: never; requires2FA?: never }
  | {
      requires2FA: true;
      email: string;
      message: string;
      success?: never;
      error?: never;
    }
  | { error: string; success?: never; requires2FA?: never; email?: never };
