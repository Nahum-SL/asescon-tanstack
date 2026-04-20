import { redirect } from "@tanstack/react-router";
import type { User } from "#/features/users/types";

export function requireRole(user: User | null, roles: string[]) {
  if (!user || !roles.includes(user.role)) {
    throw redirect({ to: "/dashboard" });
  }
}
