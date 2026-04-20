// Cambios clave:
// ✅ createServerFn garantiza ejecución SOLO en el servidor
// ✅ getCookie/setCookie/deleteCookie del servidor
// ✅ secure: solo en producción
// ✅ maxAge en la cookie para expiración
// ✅ crypto.randomInt en vez de Math.random (si lo movieras aquí; ahora es del backend)
// ✅ El import correcto de @tanstack/react-start/server

import { createServerFn } from "@tanstack/react-start";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "@tanstack/react-start/server";
import { API_URL } from "#/lib/api-url";
import type { User, LoginActionResult } from "#/features/users/types";

// --------------------
// GET ME — para hidratar el contexto del router en cada request
// --------------------
export const getMeFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<User | null> => {
    const token = getCookie("asescon_token");
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        // ✅ En el servidor, pasamos el token manualmente como Bearer
        // "credentials: include" solo funciona en el browser
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return null;
      return res.json() as Promise<User>;
    } catch {
      // Si NestJS está caído o el token expiró, no rompemos la app
      return null;
    }
  },
);

// --------------------
// LOGIN
// --------------------
export const loginFn = createServerFn({ method: "POST" })
  // .validator() describe y valida el input — el tipo es inferido automáticamente
  .inputValidator((data: unknown) => {
    const d = data as { email: string; password: string };
    if (!d?.email || !d?.password) {
      throw new Error("Email y contraseña son requeridos");
    }
    return d;
  })
  .handler(async ({ data }): Promise<LoginActionResult> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // NestJS devuelve errores como { message: string }
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return { error: error.message ?? `Error ${res.status}` };
    }

    const result = await res.json();

    // Caso: ADMIN/OWNER — requieren 2FA
    if (result.requires2FA) {
      return {
        requires2FA: true,
        email: result.email,
        message: result.message,
      };
    }

    // Caso: login completo (COLABORADOR/CLIENTE — sin 2FA en tu backend actual)
    // ✅ Cookie HttpOnly — el cliente JavaScript NUNCA puede leerla
    // ✅ secure: solo HTTPS en producción
    // ✅ sameSite: 'strict' previene CSRF
    // ✅ maxAge: 7 días de sesión
    setCookie("asescon_token", result.backendToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: result.user };
  });

// --------------------
// VERIFY 2FA
// --------------------
export const verify2FAFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const d = data as { email: string; code: string };
    if (!d?.email || !d?.code) throw new Error("Email y código requeridos");
    if (d.code.length !== 6) throw new Error("El código debe tener 6 dígitos");
    return d;
  })
  .handler(async ({ data }): Promise<LoginActionResult> => {
    const res = await fetch(`${API_URL}/api/auth/verify-2fa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return { error: error.message ?? `Error ${res.status}` };
    }

    const result = await res.json();

    setCookie("asescon_token", result.backendToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: result.user };
  });

// --------------------
// LOGOUT
// --------------------
export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  // ✅ Eliminar la cookie desde el servidor — el cliente no puede hacerlo
  // porque httpOnly=true
  deleteCookie("asescon_token");
  return { success: true };
});
