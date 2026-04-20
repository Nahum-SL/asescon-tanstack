import { createFileRoute } from "@tanstack/react-router";
import { useServices, SERVICES_QUERY_KEY } from "#/features/services/hooks";
import { getServices } from "#/features/services/api";
import { queryClient } from "#/lib/query-client";

export const Route = createFileRoute("/_authenticated/services/")({
  loader: async () => {
    await queryClient.ensureQueryData({
      queryKey: SERVICES_QUERY_KEY,
      queryFn: getServices,
    });
  },
  component: Servicio,
});

function Servicio() {
  // Data
  const { data, isLoading, error } = useServices();

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los servicios</p>;

  return (
    <div className="text-center">
      <h1 className="text-2xl mb-4">Servicios</h1>
      <ul>
        {data?.map((svc) => (
          <li key={svc.id}>{svc.title}</li>
        ))}
      </ul>
    </div>
  );
}
