import { redirect } from "@tanstack/react-router";
import type { RouterContext } from "#/router";

export function requireAuth(context: RouterContext) {
  if (!context) {
    throw redirect({ to: "/auth/login" });
  }
}
