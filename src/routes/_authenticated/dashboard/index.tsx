import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Dashboard,
});
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <Link to="/services">Servicios</Link>
        <Link to="/services/$servicioId">Id</Link>
        <Link to="/services/create">Crear</Link>
      </div>
    </div>
  );
}
