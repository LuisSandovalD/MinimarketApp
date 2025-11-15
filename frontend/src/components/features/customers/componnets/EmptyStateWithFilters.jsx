export default function EmptyStateWithFilters({ clearFilters }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
      <p className="text-gray-600 text-lg">
        No se encontraron clientes con los filtros aplicados
      </p>

      <button
        onClick={clearFilters}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
