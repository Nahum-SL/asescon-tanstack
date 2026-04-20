// Cambio clave:
// ✅ useAuth lee del CONTEXTO del router — no hace fetch al cliente
//    El usuario ya está disponible desde el SSR, sin flash de loading
// ✅ Si necesitas datos extendidos del perfil (fotos, permisos granulares),
//    ahí sí se usa useQuery como segundo hook separado

import { useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMeFn } from "#/server/auth";

// Hook principal — sincrono, sin loading, sin fetch
export function useAuth() {
  return useRouteContext({
    from: "__root__",
    select: (ctx) => ctx.auth,
  });
}

// Hook auxiliar — para datos extendidos que no están en el token
// Solo úsalo si necesitas información adicional del perfil
export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["auth", "profile"] as const,
    queryFn: () => getMeFn(),
    // Solo ejecutar si hay usuario autenticado
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}
