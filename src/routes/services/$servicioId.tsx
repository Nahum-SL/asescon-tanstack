import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/servicio")({
  component: ServicioDetail,
});

function ServicioDetail() {
  return (
    <div className="text-center">
      <h1 className="text-2xl mb-4">Detalle del Servicio</h1>
      <p>Aquí se mostrarán los detalles del servicio seleccionado.</p>
    </div>
  );
}