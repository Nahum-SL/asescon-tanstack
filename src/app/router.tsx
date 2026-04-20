import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "#/routeTree.gen";
import { queryClient } from "#/lib/query-client";
import type { User } from "#/features/users/types";
import type { QueryClient } from "@tanstack/react-query";
import { getUserFromStorage } from "#/lib/auth";

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
        user: null, // Luego se llena
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
