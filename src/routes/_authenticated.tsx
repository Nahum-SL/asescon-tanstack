// Este archivo protege CUALQUIER ruta que anides bajo _authenticated/
// Ejemplo: _authenticated/dashboard.tsx → /dashboard (protegida)
//          _authenticated/admin/users.tsx → /admin/users (protegida)

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    // ✅ context.auth.user ya fue hidratado por Root.beforeLoad
    if (!context.auth.user) {
      throw redirect({
        to: "/auth/login",
        // Guardamos la URL original para redirigir después del login
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => <Outlet />,
});