export interface AuthResponse {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
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
