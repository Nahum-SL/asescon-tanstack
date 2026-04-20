// Cambio clave: el contexto se hidrata en _root.tsx con beforeLoad,
// no aquí. Aquí solo defines la forma.

import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "#/routeTree.gen";
import { queryClient } from "#/lib/query-client";
import type { User } from "#/features/users/types";
import type { QueryClient } from "@tanstack/react-query";

export interface RouterContext {
  queryClient: QueryClient;
  auth: {
    user: User | null;
  };
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
      auth: {
        user: null,
        // ✅ null es correcto aquí — se hidrata en Root.beforeLoad
        // antes de renderizar cualquier componente
      },
    } satisfies RouterContext,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
