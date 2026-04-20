import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireAuth } from "@/shared/components/ProtectedRoute";

export const Route = createFileRoute("/_authenticated/dashboard/_layout")({
  beforeLoad: ({ context }) => {
    requireAuth(context);
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
}