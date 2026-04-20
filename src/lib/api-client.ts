// Para llamadas desde el CLIENTE (browser) a endpoints no autenticados
// o autenticados via cookie (el browser la envía automáticamente con credentials: include)
//
// IMPORTANTE: NO usar este cliente dentro de createServerFn
// En el servidor, usa fetch() directamente y pasa el Bearer token manualmente
// (como lo hacemos en getMeFn)

export const apiClient = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    // Intentamos parsear el error de NestJS (que devuelve { message: string })
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.message ?? errorBody.error ?? `Error HTTP ${res.status}`,
    );
  }

  if (res.status === 204) return undefined as T;

  return res.json();
};
