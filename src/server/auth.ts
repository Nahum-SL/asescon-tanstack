import { API_URL } from "@/lib/api-url";
import { setCookie } from "@tanstack/react-start/server";

export async function loginServer(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    return { error: result.message };
  }

  if (result.requires2FA) {
    return result;
  }

  // guardar cookie segura
  setCookie("asescon_token", result.backendToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return { success: true, user: result.user };
}
