import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "#/shared/components/ProtectedRoute";
import { requireRole } from "#/shared/utils/require-roles";

export const Route = createFileRoute("/_authenticated/admin/_layout")({
  beforeLoad: async ({context}) => {
    requireAuth(context);
    requireRole(context.auth.user, ["ADMIN", "OWNER"]);
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div>
      <h1>Admin Panel</h1>
    </div>
  );
}