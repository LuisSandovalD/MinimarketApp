export const EmptyState = ({ hasFilters }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
    <p className="text-gray-500">
      {hasFilters
        ? "No se encontraron detalles con los filtros aplicados."
        : "No hay detalles registrados."}
    </p>
  </div>
);