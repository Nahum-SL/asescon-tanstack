export const apiClient = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  try {

    const res = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || `Error ${res.status}`);
    }

    // Para DELETE o 204
    if (res.status === 204) return undefined as T;

    return res.json();
  } catch (err) {
    throw err;
  }
};
