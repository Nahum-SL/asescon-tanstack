export const userRole = {
  ADMIN: "ADMIN",
  COLABORADOR: "COLABORADOR",
  OWNER: "OWNER",
}

export type Role = typeof userRole[keyof typeof userRole];

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  avatar: string | null;
}

export interface AuthResponse {
  user?: User;
  backendToken?: string;
  requires2FA?: boolean;
  message?: string;
}

export type LoginActionResult =
  | {
      success: true;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
      };
      error?: never;
      requires2FA?: never;
    }
  | {
      requires2FA: true;
      email: string;
      message: string;
      success?: never;
      error?: never;
    }
  | { error: string; success?: never; requires2FA?: never; email?: never };
